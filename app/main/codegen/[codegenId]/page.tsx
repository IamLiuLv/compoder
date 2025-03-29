"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/biz/AppHeader"
import { ChatInput } from "@/components/biz/ChatInput"
import { CodegenGuide } from "@/components/biz/CodegenGuide"
import { ComponentCodeFilterContainer } from "@/components/biz/ComponentCodeFilterContainer"
import { ComponentCodeList } from "@/components/biz/ComponentCodeList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import TldrawEdit from "@/components/biz/TldrawEdit/TldrawEdit"
import {
  useCodegenDetail,
  useComponentCodeList,
} from "../server-store/selectors"
import { useRef, useState } from "react"
import {
  useCreateComponentCode,
  useDeleteComponentCode,
} from "../server-store/mutations"
import { Prompt, PromptImage } from "@/lib/db/componentCode/types"
import { Skeleton } from "@/components/ui/skeleton"
import { CompoderThinkingLoading } from "@/components/biz/CompoderThinkingLoading"
import { useShowOnFirstData } from "@/hooks/use-show-on-first-data"
import { CodingBox } from "@/components/biz/CodingBox"
import {
  transformNewComponentIdFromXml,
  transformTryCatchErrorFromXml,
} from "@/lib/xml-message-parser/parser"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { AIProvider } from "@/lib/config/ai-providers"
import {
  LLMSelectorProvider,
  LLMSelectorButton,
} from "@/app/commons/LLMSelectorProvider"

// 添加类型定义
interface ChatState {
  value: string
  images: string[]
  isSubmitting: boolean
  streamingContent: string
  provider?: AIProvider
  model?: string
  showJumpPrompt: boolean
  newComponentId?: string
}

interface FilterState {
  currentPage: number
  searchKeyword: string
  filterField: "all" | "name" | "description"
}

export default function CodegenDetailPage({
  params,
}: {
  params: { codegenId: string }
}) {
  const { data: codegenDetail, isLoading } = useCodegenDetail(params.codegenId)
  const router = useRouter()

  // 组合相关状态
  const [filterState, setFilterState] = useState<FilterState>({
    currentPage: 1,
    searchKeyword: "",
    filterField: "all",
  })

  const [chatState, setChatState] = useState<ChatState>({
    value: "",
    images: [],
    isSubmitting: false,
    streamingContent: "",
    showJumpPrompt: false,
  })

  const [showCodeDetailDigLog, setShowCodeDetailDigLog] = useState(false)
  const showcodeDetailRef = useRef(false)
  const [showCodingBox, setShowCodingBox] = useState(false)

  const { data: componentCodeData, isLoading: isComponentLoading, refetch: refetchComponentList } =
    useComponentCodeList({
      codegenId: params.codegenId,
      page: filterState.currentPage,
      pageSize: 10,
      searchKeyword: filterState.searchKeyword,
      filterField: filterState.filterField,
    })

  const createComponentMutation = useCreateComponentCode()
  const deleteComponentMutation = useDeleteComponentCode()

  // 优化状态更新函数
  const updateChatState = (updates: Partial<ChatState>) => {
    setChatState(prev => ({ ...prev, ...updates }))
  }

  const updateFilterState = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }))
  }

  const onCodeDetailChange = (val: boolean) => {
    setShowCodeDetailDigLog(val)
    showcodeDetailRef.current = val
    if (!chatState.isSubmitting) {
      setShowCodingBox(val)
    }
  }

  const shouldShowList = useShowOnFirstData(componentCodeData?.items)

  const handleLLMChange = (
    newProvider: AIProvider | undefined,
    newModel: string | undefined,
  ) => {
    updateChatState({ provider: newProvider, model: newModel })
  }

  // 提取错误处理逻辑
  const handleError = (error: Error) => {
    console.error("Operation failed:", error)
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }

  const handleChatSubmit = async () => {
    if (!chatState.value.trim() && chatState.images.length === 0) return
    setShowCodingBox(true)

    if (!chatState.model || !chatState.provider) {
      toast({
        title: "Error",
        description: "Please select a model and provider",
        variant: "default",
      })
      return
    }

    updateChatState({ isSubmitting: true })

    try {
      const prompts: Prompt[] = [
        { text: chatState.value, type: "text" },
        ...chatState.images.map(
          image => ({ image, type: "image" } as PromptImage),
        ),
      ]

      const res = await createComponentMutation.mutateAsync({
        prompt: prompts,
        codegenId: params.codegenId,
        model: chatState.model,
        provider: chatState.provider,
      })

      await handleStreamResponse(res)
      
      updateChatState({
        value: "",
        images: [],
        isSubmitting: false,
      })
      
      await refetchComponentList()
    } catch (error) {
      handleError(error as Error)
    } finally {
      updateChatState({ isSubmitting: false })
    }
  }

  // 提取流响应处理逻辑
  const handleStreamResponse = async (response: ReadableStream) => {
    const reader = response?.getReader()
    const decoder = new TextDecoder()
    let content = ""

    while (true) {
      const { done, value } = await reader?.read()
      if (done) break
      content += decoder.decode(value)
      updateChatState({ streamingContent: content })
    }

    const errorMessage = transformTryCatchErrorFromXml(content)
    if (errorMessage) {
      throw new Error(errorMessage)
    }

    const componentId = transformNewComponentIdFromXml(content)
    if (componentId) {
      updateChatState({ 
        newComponentId: componentId,
        showJumpPrompt: showcodeDetailRef.current 
      })
      
      if (!showcodeDetailRef.current) {
        router.push(`/main/codegen/${params.codegenId}/${componentId}`)
      }
    }
  }

  const handleImageRemove = (index: number) => {
    updateChatState({
      images: chatState.images.filter((_, i) => i !== index)
    })
  }

  const handleDeleteComponent = async (id: string) => {
    try {
      await deleteComponentMutation.mutateAsync({ id })
      await refetchComponentList()
    } catch (error) {
      handleError(error as Error)
    }
  }

  return (
    <LLMSelectorProvider onChange={handleLLMChange}>
      <div>
        <AppHeader
          breadcrumbs={[
            { label: "Codegen", href: "/main/codegen" },
            { label: codegenDetail?.name || "Codegen Detail" },
          ]}
        />
        <ScrollArea className="h-[calc(100vh-88px)]">
          <div className="w-full max-w-4xl pt-12 pb-12 px-6 flex flex-col mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                <CodegenGuide
                  prompts={
                    codegenDetail?.prompts.map(prompt => ({
                      title: prompt.title,
                      onClick: () => {
                        setChatState(prev => ({ ...prev, value: prompt.title }))
                      },
                    })) || []
                  }
                  name={codegenDetail?.name || ""}
                />

                <ChatInput
                  className="mt-6"
                  value={chatState.value}
                  onChange={value => setChatState(prev => ({ ...prev, value }))}
                  onSubmit={handleChatSubmit}
                  actions={[
                    <TooltipProvider key="draw-image">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <TldrawEdit
                              disabled={chatState.isSubmitting}
                              onSubmit={imageData => {
                                setChatState(prev => ({ ...prev, images: [...prev.images, imageData] }))
                              }}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Draw An Image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>,
                    <LLMSelectorButton key="llm-selector" />,
                  ]}
                  images={chatState.images}
                  onImageRemove={handleImageRemove}
                  loading={chatState.isSubmitting}
                  loadingSlot={
                    chatState.isSubmitting ? (
                      <CompoderThinkingLoading
                        text={
                          chatState.streamingContent
                            ? "Compoder is coding..."
                            : "Compoder is thinking..."
                        }
                      />
                    ) : undefined
                  }
                />
              </>
            )}
          </div>
          <div
            className={cn(
              chatState.isSubmitting || shouldShowList ? "opacity-100" : "opacity-0",
              "w-full mx-auto px-6",
            )}
          >
            <p className="text-lg font-bold mb-4">Component List</p>
            <ComponentCodeFilterContainer
              total={componentCodeData?.total || 0}
              currentPage={filterState.currentPage}
              searchKeyword={filterState.searchKeyword}
              filterField={filterState.filterField}
              onPageChange={page => updateFilterState({ currentPage: page })}
              onSearchChange={keyword => updateFilterState({ searchKeyword: keyword })}
              onFilterFieldChange={field => updateFilterState({ filterField: field })}
            >
              {isComponentLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <ComponentCodeList
                  newItem={
                    chatState.streamingContent && showCodingBox ? (
                      <CodingBox
                        className="h-full"
                        code={chatState.streamingContent}
                        showJumpPrompt={chatState.showJumpPrompt}
                        isSubmitting={chatState.isSubmitting}
                        onJumpConfirm={() => {
                          setChatState(prev => ({ ...prev, showJumpPrompt: false }))
                          if (chatState.newComponentId) {
                            router.push(`/main/codegen/${params.codegenId}/${chatState.newComponentId}`)
                          }
                        }}
                        onJumpCancel={() => {
                          setChatState(prev => ({ ...prev, showJumpPrompt: false }))
                        }}
                        showCodeDetail={showCodeDetailDigLog}
                        setShowCodeDetail={onCodeDetailChange}
                        newComponentId={chatState.newComponentId}
                      />
                    ) : undefined
                  }
                  items={componentCodeData?.items ?? []}
                  codeRendererServer={codegenDetail?.codeRendererUrl || ""}
                  onDeleteClick={id => handleDeleteComponent(id)}
                  onItemClick={id =>
                    router.push(`/main/codegen/${params.codegenId}/${id}`)
                  }
                />
              )}
            </ComponentCodeFilterContainer>
          </div>
        </ScrollArea>
      </div>
    </LLMSelectorProvider>
  )
}
