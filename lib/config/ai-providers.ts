import fs from "fs"
import path from "path"

// Define AI provider types
export type AIProvider = "openai" | "anthropic" | "deepseek" | "ollama" | "google"

// Model configuration
export type AIModelConfig = {
  model: string
  title: string
  baseURL: string
  features: Array<"vision">
  apiKey: string
}

// Provider configuration
export type AIProviderConfig = {
  provider: AIProvider
  models: AIModelConfig[]
}

// Full configuration
export type AIProvidersConfig = {
  providers: AIProviderConfig[]
}

// Processed model configuration (with resolved environment variables)
export type ProcessedAIModelConfig = {
  model: string
  title: string
  baseURL: string
  apiKey: string
  headers?: Record<string, string>
}

// Processed provider configuration
export type ProcessedAIProviderConfig = {
  provider: AIProvider
  models: ProcessedAIModelConfig[]
}

// Cache for the loaded configuration
let configCache: Record<AIProvider, ProcessedAIProviderConfig> | null = null

// Get the current config file path
export function getConfigFilePath(): string {
  // Use default path
  const configFileName = "data/config.json"
  const configFilePath = path.join(process.cwd(), configFileName)

  return configFilePath
}

// Function to load and parse the AI providers configuration
export function loadAIProvidersConfig(
  forceReload = false,
): Record<AIProvider, ProcessedAIProviderConfig> {
  // Return cached config if available and not forcing reload
  if (configCache && !forceReload) {
    return configCache
  }

  try {
    const configFilePath = getConfigFilePath()
    console.log(`Loading AI providers config from: ${configFilePath}`)

    // Read and parse the configuration file
    const configFileContent = fs.readFileSync(configFilePath, "utf-8")
    const config = JSON.parse(configFileContent) as AIProvidersConfig

    // Process the configuration - convert array to record for backward compatibility
    const processedConfig = config.providers.reduce((acc, providerConfig) => {
      const provider = providerConfig.provider

      // Process models - directly use the values from the config file
      const processedModels = providerConfig.models.map(model => {
        return {
          ...model,
        }
      })

      acc[provider] = {
        provider,
        models: processedModels,
      }

      return acc
    }, {} as Record<AIProvider, ProcessedAIProviderConfig>)

    // Update cache
    configCache = processedConfig

    return processedConfig
  } catch (error) {
    console.error("Error loading AI providers configuration:", error)
    throw new Error(`Failed to load AI providers configuration: ${error}`)
  }
}

// Function to get the current AI providers configuration
export function getAIProviders(): Record<
  AIProvider,
  ProcessedAIProviderConfig
> {
  return loadAIProvidersConfig()
}

// Helper function to find model configuration by name
export function findModelConfig(
  provider: AIProvider,
  modelName: string,
): ProcessedAIModelConfig {
  const providerConfig = getAIProviders()[provider]

  // Find the model by name
  const modelConfig = providerConfig.models.find(
    model => model.model === modelName,
  )

  if (!modelConfig) {
    throw new Error(`Model "${modelName}" not found for provider "${provider}"`)
  }

  return modelConfig
}

// Function to reload the configuration (useful for admin panels)
export function reloadAIProvidersConfig(): Record<
  AIProvider,
  ProcessedAIProviderConfig
> {
  return loadAIProvidersConfig(true)
}
