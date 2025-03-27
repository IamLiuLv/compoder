import { createContext, useContext } from "react"
import { Model } from "@/components/biz/ProviderModelViewer/interface"

interface ProviderModelModalContextType {
  // 是否显示模态框
  isOpen: boolean
  // 打开模态框
  openModal: () => void
  // 关闭模态框
  closeModal: () => void
  // 当前选择的提供商和模型
  selectedProvider?: string
  selectedModel?: Model
  // 设置选中的提供商和模型
  setSelected: (provider: string, model: Model) => void
  // 是否正在加载数据
  isLoading: boolean
  // 错误信息
  error: Error | null
  // 刷新数据
  refreshData: () => Promise<void>
}

// 创建Context
export const ProviderModelModalContext =
  createContext<ProviderModelModalContextType>({
    isOpen: false,
    openModal: () => {},
    closeModal: () => {},
    selectedProvider: undefined,
    selectedModel: undefined,
    setSelected: () => {},
    isLoading: false,
    error: null,
    refreshData: async () => {},
  })

// 提供一个使用Context的hook
export const useProviderModelModalContext = () =>
  useContext(ProviderModelModalContext)
