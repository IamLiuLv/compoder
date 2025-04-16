import { AIProvider } from "@/lib/config/ai-providers"

export interface LLMOption {
  provider: AIProvider
  modelId: string
  title: string
  features: Array<"vision">
}

export interface LLMSelectorProps {
  // Initial data for the component
  initialData?: LLMOption[]
  // Currently selected provider
  selectedProvider?: AIProvider
  // Currently selected model name
  selectedModel?: string
  // Callback when provider changes
  onProviderChange?: (provider: AIProvider) => void
  // Callback when model changes
  onModelChange?: (modelName: string) => void
  // Callback when both provider and model change
  onLLMChange?: (provider: AIProvider, modelName: string) => void
  // Component disabled state
  disabled?: boolean
  // Placeholder text
  placeholder?: string
}
