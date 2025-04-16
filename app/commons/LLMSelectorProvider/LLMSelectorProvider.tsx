import React, { useState, useEffect, useMemo } from "react"
import { AIProvider } from "@/lib/config/ai-providers"
import { useLLMOptions } from "@/app/commons/LLMSelectorProvider/useLLMOptions"
import { LLMSelectorContext } from "./LLMSelectorContext"

// Define localStorage keys
const STORAGE_KEY_PROVIDER = "llm-selector-provider"
const STORAGE_KEY_MODEL = "llm-selector-model"

interface LLMSelectorProviderProps {
  children: React.ReactNode
  // 可选的默认提供商
  defaultProvider?: AIProvider
  // 可选的默认模型
  defaultModel?: string
  // 可选的状态变化回调
  onChange?: (
    provider: AIProvider | undefined,
    model: string | undefined,
  ) => void
}

/**
 * LLM选择器的Provider组件
 * 负责管理LLM选择状态，并将其提供给子组件
 */
const LLMSelectorProvider: React.FC<LLMSelectorProviderProps> = ({
  children,
  defaultProvider,
  defaultModel,
  onChange,
}) => {
  const { options, loading, error } = useLLMOptions()
  const [provider, setProviderState] = useState<AIProvider | undefined>(
    defaultProvider,
  )
  const [model, setModelState] = useState<string | undefined>(defaultModel)
  const modelConfig = useMemo(() => {
    return options.find(opt => opt.modelId === model)
  }, [model, options])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    try {
      const savedProvider = localStorage.getItem(
        STORAGE_KEY_PROVIDER,
      ) as AIProvider | null
      const savedModel = localStorage.getItem(STORAGE_KEY_MODEL)

      if (savedProvider && savedModel) {
        setProviderState(savedProvider)
        setModelState(savedModel)
        if (onChange) {
          onChange(savedProvider, savedModel)
        }
      }
    } catch (error) {
      console.error("Error loading LLM preferences from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // 设置提供商的函数
  const setProvider = (newProvider: AIProvider) => {
    setProviderState(newProvider)

    // 如果提供商改变，为该提供商选择一个默认模型
    if (newProvider !== provider) {
      const providerModels = options.filter(opt => opt.provider === newProvider)
      if (providerModels.length > 0) {
        const firstModel = providerModels[0].modelId
        setModelState(firstModel)

        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY_PROVIDER, newProvider)
          localStorage.setItem(STORAGE_KEY_MODEL, firstModel)
        } catch (error) {
          console.error("Error saving provider to localStorage:", error)
        }

        if (onChange) {
          onChange(newProvider, firstModel)
        }
      } else {
        setModelState(undefined)

        // Remove from localStorage if no models available
        try {
          localStorage.removeItem(STORAGE_KEY_PROVIDER)
          localStorage.removeItem(STORAGE_KEY_MODEL)
        } catch (error) {
          console.error("Error removing provider from localStorage:", error)
        }

        if (onChange) {
          onChange(newProvider, undefined)
        }
      }
    }
  }

  // 设置模型的函数
  const setModel = (newModel: string) => {
    setModelState(newModel)

    // Save to localStorage
    try {
      if (provider) {
        localStorage.setItem(STORAGE_KEY_MODEL, newModel)
      }
    } catch (error) {
      console.error("Error saving model to localStorage:", error)
    }

    if (onChange) {
      onChange(provider, newModel)
    }
  }

  // 同时设置提供商和模型的函数
  const setLLM = (newProvider: AIProvider, newModel: string) => {
    setProviderState(newProvider)
    setModelState(newModel)

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_PROVIDER, newProvider)
      localStorage.setItem(STORAGE_KEY_MODEL, newModel)
    } catch (error) {
      console.error("Error saving LLM to localStorage:", error)
    }

    if (onChange) {
      onChange(newProvider, newModel)
    }
  }

  // 当options加载完毕，如果没有设置初始值，则设置默认值
  useEffect(() => {
    if (
      !loading &&
      options.length > 0 &&
      !provider &&
      !model &&
      isInitialized
    ) {
      // 设置第一个提供商和模型作为默认值
      const defaultProviderOption = options[0].provider
      const defaultModelOption = options[0].modelId

      setProviderState(defaultProviderOption)
      setModelState(defaultModelOption)

      // Save default selection to localStorage
      try {
        localStorage.setItem(STORAGE_KEY_PROVIDER, defaultProviderOption)
        localStorage.setItem(STORAGE_KEY_MODEL, defaultModelOption)
      } catch (error) {
        console.error("Error saving default LLM to localStorage:", error)
      }

      if (onChange) {
        onChange(defaultProviderOption, defaultModelOption)
      }
    }
  }, [loading, options, provider, model, isInitialized])

  // 保存Context值
  const contextValue = {
    provider,
    model,
    modelConfig,
    loading,
    error,
    setProvider,
    setModel,
    setLLM,
  }

  return (
    <LLMSelectorContext.Provider value={contextValue}>
      {children}
    </LLMSelectorContext.Provider>
  )
}

export default LLMSelectorProvider
