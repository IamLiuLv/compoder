import { useState, useMemo } from "react"
import { AppHeader } from "@/components/biz/AppHeader"
import { ComponentCodeVersionsContainer } from "@/components/biz/ComponentCodeVersionsContainer"
import { FileNode } from "@/components/biz/CodeIDE"
import { ChatInput } from "@/components/biz/ChatInput"
import { TldrawEdit } from "@/components/biz/TldrawEdit"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useComponentDetail } from "./useComponentDetail"
import { flushSync } from "react-dom"

import { CodeRenderer as CodeRendererComponent } from "@/components/biz/CodeRenderer"
import { useFile } from "@/components/biz/CodeIDE/context/FileContext"
import { Prompt } from "@/lib/db/componentCode/types"
import { CodingBox } from "@/components/biz/CodingBox"
import { LLMSelectorButton } from "@/app/commons/LLMSelectorProvider"
import { StreamCodeIDE } from "@/components/biz/CodeIDE/CodeIDE"

export const ComponentDetailContainer = () => {
  const [images, setImages] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [compoderThinkingProcess, setCompoderThinkingProcess] = useState("")

  const {
    componentDetail,
    activeVersionId,
    setActiveVersion,
    isStreaming,
    readableStream,
    handleEdit,
    handleSave,
    artifact,
    codegenId,
    modelConfig,
  } = useComponentDetail()

  const supportVision = modelConfig?.features.includes("vision")

  const loadingSlot = useMemo(() => {
    if (!isStreaming || !compoderThinkingProcess) return null
    return (
      <CodingBox
        code={compoderThinkingProcess}
        className="h-[300px]"
        showMacControls={true}
      />
    )
  }, [isStreaming, compoderThinkingProcess])

  const handleChatSubmit = async (input?: string) => {
    if (!codegenId) return

    const prompt: Prompt[] = [
      ...(supportVision && images.length > 0
        ? images.map(image => ({ type: "image" as const, image }))
        : []),
      {
        type: "text" as const,
        text: input || chatInput,
      },
    ]

    const result = await handleEdit(prompt)

    if (result) {
      setImages([])
      setChatInput("")
    }
  }

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onFixError = (error: string) => {
    flushSync(() => {
      setChatInput(error)
    })
    handleChatSubmit(error)
  }

  return (
    <div className="h-screen relative">
      <AppHeader
        showSidebarTrigger={false}
        breadcrumbs={[
          { label: "Codegen", href: "/main/codegen" },
          {
            label: "Codegen Detail",
            href: `/main/codegen/${codegenId}`,
          },
          { label: componentDetail?.name || "Component Detail" },
        ]}
      />
      <div className="h-[calc(100%-200px)]">
        <ComponentCodeVersionsContainer
          disabled={isStreaming}
          versions={
            componentDetail?.versions.map(version => ({
              id: version._id.toString(),
              prompt: version.prompt,
            })) || []
          }
          activeVersion={activeVersionId.toString()}
          onVersionChange={version => setActiveVersion(version)}
        >
          <div className="h-[calc(100%-60px)]">
            <StreamCodeIDE
              isStreaming={isStreaming}
              readableStream={readableStream}
              onCompoderThinkingProcess={content => {
                setCompoderThinkingProcess(content)
              }}
              readOnly={isStreaming}
              data={artifact.files}
              onSave={async (files: FileNode[]) => {
                await handleSave(files)
              }}
              codeRenderer={
                !isStreaming && (
                  <CodeRenderer
                    onFixError={onFixError}
                    codeRendererUrl={componentDetail?.codeRendererUrl!}
                  />
                )
              }
            />
          </div>
        </ComponentCodeVersionsContainer>
      </div>
      {isStreaming && compoderThinkingProcess && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-10" />
      )}
      <ChatInput
        className="absolute left-1/2 -translate-x-1/2 bottom-6 w-2/3 z-20"
        value={chatInput}
        onChange={setChatInput}
        onSubmit={handleChatSubmit}
        actions={[
          supportVision && (
            <TooltipProvider key="draw-image">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <TldrawEdit
                      disabled={isStreaming}
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
        loading={isStreaming}
        loadingSlot={loadingSlot}
      />
    </div>
  )
}

const CodeRenderer = ({
  onFixError,
  codeRendererUrl,
}: {
  onFixError: (error: string) => void
  codeRendererUrl: string
}) => {
  const { files } = useFile()
  const codes = useMemo(
    () =>
      files.reduce(
        (acc, file) => {
          if (file.content) {
            acc[file.name] = file.content
          }
          if (file.children) {
            file.children.forEach(child => {
              if (child.content) {
                acc[child.name] = child.content
              }
            })
          }
          return acc
        },
        {} as Record<string, string>,
      ),
    [files],
  )
  const entryFile = files.find(file => file.isEntryFile)?.name || "App.tsx"

  return (
    <CodeRendererComponent
      codeRendererServer={codeRendererUrl}
      onFixError={onFixError}
      codes={codes}
      entryFile={entryFile}
      hideControls={false}
    />
  )
}
