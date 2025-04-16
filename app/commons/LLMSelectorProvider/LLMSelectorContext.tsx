import { LLMOption } from "@/components/biz/LLMSelector"
import { AIProvider } from "@/lib/config/ai-providers"
import { createContext, useContext } from "react"

export interface LLMSelectorContextType {
  // 当前选择的AI提供商
  provider: AIProvider | undefined
  // 当前选择的模型ID
  model: string | undefined
  // 当前选择的模型配置
  modelConfig: LLMOption | undefined
  // 是否正在加载模型列表
  loading: boolean
  // 加载错误信息
  error: Error | null
  // 切换AI提供商
  setProvider: (provider: AIProvider) => void
  // 切换模型
  setModel: (model: string) => void
  // 同时设置提供商和模型
  setLLM: (provider: AIProvider, model: string) => void
}

// 创建Context
export const LLMSelectorContext = createContext<LLMSelectorContextType>({
  provider: undefined,
  model: undefined,
  modelConfig: undefined,
  loading: false,
  error: null,
  setProvider: () => {},
  setModel: () => {},
  setLLM: () => {},
})

// 提供一个使用Context的hook
export const useLLMSelectorContext = () => useContext(LLMSelectorContext)
