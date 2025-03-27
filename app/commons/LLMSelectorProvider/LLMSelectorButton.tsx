import React from "react"
import { AIProvider } from "@/lib/config/ai-providers"
import { LLMSelector } from "@/components/biz/LLMSelector"
import { useLLMOptions } from "@/app/commons/LLMSelectorProvider/useLLMOptions"
import { useLLMSelectorContext } from "./LLMSelectorContext"

interface LLMSelectorButtonProps {
  disabled?: boolean
}

/**
 * LLM选择器按钮组件，用于内嵌到ChatInput的actions中
 * 直接使用LLMSelector组件，不添加额外的包装层
 * 支持从localStorage读取上次选择的模型
 */
const LLMSelectorButton: React.FC<LLMSelectorButtonProps> = ({
  disabled = false,
}) => {
  const { options, loading } = useLLMOptions()
  const { provider, model, setLLM } = useLLMSelectorContext()

  // 当选择LLM时
  const handleLLMChange = (provider: AIProvider, model: string) => {
    setLLM(provider, model)
  }

  return (
    <LLMSelector
      initialData={options}
      selectedProvider={provider}
      selectedModel={model}
      onLLMChange={handleLLMChange}
      placeholder="选择模型"
      disabled={disabled || loading}
    />
  )
}

export default LLMSelectorButton
