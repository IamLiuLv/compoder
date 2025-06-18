import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useSuspenseComponentCodeDetail } from "../../server-store/selectors"
import {
  useEditComponentCode,
  useInitComponentCode,
  useSaveComponentCode,
} from "../../server-store/mutations"
import {
  transformComponentArtifactFromXml,
  transformFileNodeToXml,
} from "@/lib/xml-message-parser/parser"
import { toast } from "@/hooks/use-toast"
import { FileNode } from "@/components/biz/CodeIDE"
import { Prompt } from "@/lib/db/componentCode/types"
import { useStreamingContent } from "@/hooks/useStreaming"
import { useLLMSelectorContext } from "@/app/commons/LLMSelectorProvider"
import { useParams } from "next/navigation"

export function useComponentDetail() {
  const { componentId, codegenId } = useParams<{
    componentId: string
    codegenId: string
  }>()
  const [activeVersionId, setActiveVersion] = useState("")
  const { provider, model, modelConfig } = useLLMSelectorContext()
  const initRef = useRef(false)

  const {
    data: componentDetail,
    isLoading,
    refetch,
  } = useSuspenseComponentCodeDetail(componentId, codegenId)

  const { isStreaming, readableStream, startStreaming } = useStreamingContent()

  const editMutation = useEditComponentCode()
  const initMutation = useInitComponentCode()
  const saveMutation = useSaveComponentCode()

  const handleInit = useCallback(
    async (lastVersionPrompt: Prompt[]) => {
      if (!componentDetail || !lastVersionPrompt.length) return null

      if (!provider || !model) {
        toast({
          title: "Error",
          description: "Please select a model and provider",
          variant: "default",
        })
        return null
      }

      const requestParams = {
        codegenId,
        component: {
          id: componentDetail._id.toString(),
          name: componentDetail.name,
          code: "",
          prompt: lastVersionPrompt,
          isInitialized: true,
        },
        model,
        provider,
        prompt: lastVersionPrompt,
      }

      const result = await startStreaming<string>(async () =>
        initMutation.mutateAsync(requestParams),
      )
      refetch()
      return result
    },
    [componentDetail, provider, model],
  )

  const handleEdit = useCallback(
    async (prompt: Prompt[]) => {
      if (!componentDetail) return null

      if (!provider || !model) {
        toast({
          title: "Error",
          description: "Please select a model and provider",
          variant: "default",
        })
        return null
      }

      const activeVersion = componentDetail.versions.find(
        version => version._id.toString() === activeVersionId,
      )

      // build request parameters
      const requestParams = {
        codegenId,
        prompt,
        component: {
          id: componentDetail._id.toString(),
          name: componentDetail.name,
          code: activeVersion?.code || "",
          prompt: activeVersion?.prompt || [],
        },
        model,
        provider,
      }

      const result = await startStreaming<string>(async () =>
        editMutation.mutateAsync(requestParams),
      )
      const { data } = await refetch()

      if (data?.versions.length) {
        // 流式输出生成新版本后，将 activeVersionId 设置为新版本
        const lastVersion = data.versions[data.versions.length - 1]
        if (lastVersion._id.toString() !== activeVersionId) {
          setActiveVersion(lastVersion._id.toString())
        }
      }
      return result
    },
    [componentDetail, activeVersionId, provider, model],
  )

  const handleSave = async (files: FileNode[]) => {
    if (!componentDetail || !activeVersionId) return false
    try {
      const code = transformFileNodeToXml(files, componentDetail.name)
      await saveMutation.mutateAsync({
        id: componentDetail._id.toString(),
        versionId: activeVersionId,
        code,
      })
      toast({
        title: "Success",
        description: "Component code saved successfully",
      })
      return true
    } catch (error) {
      console.error("Failed to save component code:", error)
      toast({
        title: "Error",
        description: "Failed to save component code",
        variant: "destructive",
      })
      return false
    }
  }

  const artifact = useMemo(() => {
    return transformComponentArtifactFromXml(
      componentDetail?.versions.find(
        version => version._id.toString() === activeVersionId,
      )?.code || "",
    )
  }, [activeVersionId, componentDetail])

  useEffect(() => {
    if (!componentDetail || !provider || !model) return

    if (!componentDetail.versions.length) {
      toast({
        title: "Error",
        description: "No versions found for this component",
        variant: "default",
      })
      return
    }

    if (initRef.current) return
    initRef.current = true
    const { versions } = componentDetail
    const lastVersion = versions[versions.length - 1]

    if (activeVersionId === "") {
      // 初始化时，将 activeVersionId 设置为最新版本，适用于首次进入已有完整代码的组件
      setActiveVersion(lastVersion._id.toString())
    }

    if (!lastVersion.code && lastVersion.prompt.length) {
      // initial component, need to call LLM to generate code
      handleInit(lastVersion.prompt)
    }
  }, [componentDetail, activeVersionId, handleEdit, provider, model])

  return {
    componentDetail,
    isLoading,
    activeVersionId,
    setActiveVersion,
    isStreaming,
    readableStream,
    handleEdit,
    handleSave,
    artifact,
    codegenId,
    componentId,
    modelConfig,
  }
}
