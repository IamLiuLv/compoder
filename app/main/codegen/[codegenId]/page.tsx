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
import { useMemo, useState } from "react"
import {
  useDeleteComponentCode,
  useCreateComponentCode,
} from "../server-store/mutations"
import { Prompt, PromptImage } from "@/lib/db/componentCode/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useShowOnFirstData } from "@/hooks/use-show-on-first-data"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { AIProvider } from "@/lib/config/ai-providers"
import {
  LLMSelectorProvider,
  LLMSelectorButton,
} from "@/app/commons/LLMSelectorProvider"
import { useLLMOptions } from "@/app/commons/LLMSelectorProvider/useLLMOptions"

export default function CodegenDetailPage({
  params,
}: {
  params: { codegenId: string }
}) {
  const { data: codegenDetail, isLoading } = useCodegenDetail(params.codegenId)
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filterField, setFilterField] = useState<
    "all" | "name" | "description"
  >("all")

  const { data: componentCodeData, isLoading: isComponentLoading } =
    useComponentCodeList({
      codegenId: params.codegenId,
      page: currentPage,
      pageSize: 10,
      searchKeyword,
      filterField,
    })

  const [chatValue, setChatValue] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provider, setProvider] = useState<AIProvider>()
  const [model, setModel] = useState<string>()
  const { options } = useLLMOptions()
  const modelConfig = useMemo(() => {
    return options.find(opt => opt.modelId === model)
  }, [model, options])
  const supportVision = modelConfig?.features.includes("vision")
  const initComponentMutation = useCreateComponentCode()
  const deleteComponentMutation = useDeleteComponentCode()

  const shouldShowList = useShowOnFirstData(componentCodeData?.items)

  // handle LLM change
  const handleLLMChange = (
    newProvider: AIProvider | undefined,
    newModel: string | undefined,
  ) => {
    console.log(`Selected LLM: ${newProvider} - ${newModel}`)
    setProvider(newProvider)
    setModel(newModel)
  }

  const handleChatSubmit = async () => {
    if (!chatValue.trim() && images.length === 0) return

    if (!model || !provider) {
      toast({
        title: "Error",
        description: "Please select a model and provider",
        variant: "default",
      })
      return
    }

    setIsSubmitting(true)
    const prompts: Prompt[] = [
      { text: chatValue, type: "text" },
      ...(supportVision && images.length > 0
        ? images.map(
            image =>
              ({
                image,
                type: "image",
              }) as PromptImage,
          )
        : []),
    ]

    // if model is selected, add it to the request parameters
    const requestParams = {
      prompt: prompts,
      codegenId: params.codegenId,
      model,
      provider,
    }

    try {
      const { data } = await initComponentMutation.mutateAsync(requestParams)
      const componentId = data._id
      if (componentId) {
        router.push(`/main/codegen/${params.codegenId}/${componentId}`)
      }
    } catch (error) {
      console.error("Failed to create component:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteComponent = (id: string) => {
    deleteComponentMutation.mutate(
      { id },
      {
        onSuccess: () => {
          // Additional logic after successful deletion if needed
          console.log("Component deleted successfully:", id)
        },
      },
    )
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
                        setChatValue(prompt.title)
                      },
                    })) || []
                  }
                  name={codegenDetail?.name || ""}
                />

                <ChatInput
                  className="mt-6"
                  value={chatValue}
                  onChange={setChatValue}
                  onSubmit={handleChatSubmit}
                  actions={[
                    supportVision && (
                      <TooltipProvider key="draw-image">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <TldrawEdit
                                disabled={isSubmitting}
                                onSubmit={imageData => {
                                  setImages(prev => [...prev, imageData])
                                }}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Draw An Image</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ),
                    <LLMSelectorButton key="llm-selector" />,
                  ].filter(Boolean)}
                  images={supportVision ? images : []}
                  onImageRemove={handleImageRemove}
                  loading={isSubmitting}
                />
              </>
            )}
          </div>
          <div
            className={cn(
              isSubmitting || shouldShowList ? "opacity-100" : "opacity-0",
              "w-full max-w-[1920px] mx-auto px-6",
            )}
          >
            <p className="text-lg font-bold mb-4">Component List</p>
            <ComponentCodeFilterContainer
              total={componentCodeData?.total || 0}
              currentPage={currentPage}
              searchKeyword={searchKeyword}
              filterField={filterField}
              onPageChange={setCurrentPage}
              onSearchChange={setSearchKeyword}
              onFilterFieldChange={setFilterField}
            >
              {isComponentLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <ComponentCodeList
                  items={componentCodeData?.items ?? []}
                  codeRendererServer={codegenDetail?.codeRendererUrl || ""}
                  // onEditClick={id => console.log("Edit clicked:", id)}
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
