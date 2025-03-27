import { NextResponse } from "next/server"
import {
  getAIProviders,
  AIProvider,
  ProcessedAIProviderConfig,
} from "@/lib/config/ai-providers"
import { validateSession } from "@/lib/auth/middleware"

export const dynamic = "force-dynamic"

/**
 * API route that returns the config.json file content
 * This allows the frontend to access the configuration without exposing API keys directly
 */
export async function GET() {
  try {
    const authError = await validateSession()
    if (authError) {
      return authError
    }

    // Get AI providers configuration using the utility function
    const aiProviders = getAIProviders()

    // Mask API keys - only show first 5 and last 2 characters
    const maskedProviders = Object.entries(aiProviders).reduce(
      (acc, [key, providerConfig]) => {
        const provider = key as AIProvider

        // Create a copy of the provider config with masked API keys
        const maskedConfig: ProcessedAIProviderConfig = {
          provider: providerConfig.provider,
          models: providerConfig.models.map(model => ({
            ...model,
            apiKey: maskApiKey(model.apiKey),
          })),
        }

        acc[provider] = maskedConfig
        return acc
      },
      {} as Record<AIProvider, ProcessedAIProviderConfig>,
    )

    // Return the configuration as JSON with masked API keys
    return NextResponse.json({ providers: maskedProviders })
  } catch (error) {
    console.error("Error reading config file:", error)
    return NextResponse.json(
      { error: "Failed to read configuration file" },
      { status: 500 },
    )
  }
}

/**
 * Masks an API key by showing only the first 5 and last 2 characters
 * @param apiKey The API key to mask
 * @returns The masked API key
 */
function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length <= 7) {
    return apiKey
  }

  const firstPart = apiKey.substring(0, 5)
  const lastPart = apiKey.substring(apiKey.length - 2)
  const maskedPart = "*".repeat(apiKey.length - 7)

  return `${firstPart}${maskedPart}${lastPart}`
}
