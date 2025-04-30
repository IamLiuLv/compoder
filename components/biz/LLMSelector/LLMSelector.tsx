import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AIProvider } from "@/lib/config/ai-providers"
import type { LLMOption, LLMSelectorProps } from "./interface"

const LLMSelector: React.FC<LLMSelectorProps> = ({
  initialData = [],
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  onLLMChange,
  disabled = false,
  placeholder = "Select a model",
}) => {
  // Group models by provider
  const modelsByProvider = React.useMemo(() => {
    const grouped: Record<AIProvider, LLMOption[]> = {
      openai: [],
      anthropic: [],
      deepseek: [],
      ollama: [],
      google: []
    }

    initialData.forEach(option => {
      if (grouped[option.provider]) {
        grouped[option.provider].push(option)
      }
    })

    return grouped
  }, [initialData])

  // Handle provider selection
  const handleProviderChange = (provider: AIProvider) => {
    if (onProviderChange) {
      onProviderChange(provider)
    }

    // If there are models for this provider, select the first one
    if (modelsByProvider[provider]?.length > 0) {
      const firstModel = modelsByProvider[provider][0].modelId
      handleModelChange(provider, firstModel)
    }
  }

  // Handle model selection
  const handleModelChange = (provider: AIProvider, modelName: string) => {
    if (onModelChange) {
      onModelChange(modelName)
    }

    if (onLLMChange) {
      onLLMChange(provider, modelName)
    }
  }

  // Handle full LLM selection (provider:model format)
  const handleValueChange = (value: string) => {
    // 只按第一个冒号分割
    const firstColonIndex = value.indexOf(":")
    const provider = value.substring(0, firstColonIndex) as AIProvider
    const model = value.substring(firstColonIndex + 1)

    if (provider && model) {
      if (provider !== selectedProvider) {
        handleProviderChange(provider)
      }

      handleModelChange(provider, model)
    }
  }

  // Build select value from provider and model
  const selectValue =
    selectedProvider && selectedModel
      ? `${selectedProvider}:${selectedModel}`
      : undefined

  return (
    <div className="w-full">
      <Select
        value={selectValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full border-0 shadow-none focus:ring-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modelsByProvider).map(
            ([provider, models]) =>
              models.length > 0 && (
                <SelectGroup key={provider}>
                  <SelectLabel className="capitalize">{provider}</SelectLabel>
                  {models.map(model => (
                    <SelectItem
                      key={`${provider}:${model.modelId}`}
                      value={`${provider}:${model.modelId}`}
                    >
                      {model.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ),
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LLMSelector
