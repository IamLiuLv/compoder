import { useEffect, useState } from "react"
import { AIProvider, AIProviderConfig } from "@/lib/config/ai-providers"
import { LLMOption } from "@/components/biz/LLMSelector/interface"

// Define a new interface for API response which matches the return from the API
interface ConfigApiResponse {
  providers: Record<AIProvider, AIProviderConfig>
}

/**
 * Custom hook that loads LLM options from the config file
 */
export function useLLMOptions() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [options, setOptions] = useState<LLMOption[]>([])

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true)

        // Fetch config data from API endpoint
        const response = await fetch("/api/config")

        if (!response.ok) {
          throw new Error(`Failed to load config data: ${response.statusText}`)
        }

        const config = (await response.json()) as ConfigApiResponse
        const llmOptions: LLMOption[] = []

        // Process providers and models
        Object.entries(config.providers).forEach(
          ([providerKey, providerConfig]) => {
            const provider = providerKey as AIProvider

            // Add each model as an option
            providerConfig.models.forEach(model => {
              llmOptions.push({
                provider,
                modelId: model.model,
                title: model.title,
                features: model.features,
              })
            })
          },
        )

        setOptions(llmOptions)
        setError(null)
      } catch (err) {
        console.error("Error loading LLM options:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadOptions()
  }, [])

  return { options, loading, error }
}
