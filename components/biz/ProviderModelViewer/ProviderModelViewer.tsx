import React, { useState, useEffect } from "react"
import { ProviderModelViewerProps, Model } from "./interface"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ServerIcon } from "lucide-react"
import { getProviderIcon } from "./helpers"
/**
 * ProviderModelViewer Component
 *
 * Displays providers and their models in an accordion layout
 */
const ProviderModelViewer: React.FC<ProviderModelViewerProps> = ({
  initialData,
  showSensitiveInfo = false,
  onModelSelect,
  onRefresh,
}) => {
  const [showSensitive] = useState<boolean>(showSensitiveInfo)
  const [expandedProviders, setExpandedProviders] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Initialize all providers as expanded on component mount
  useEffect(() => {
    const allProviderKeys = Object.keys(initialData)
    setExpandedProviders(allProviderKeys)
  }, [initialData])

  // Handle refresh operation
  const handleRefresh = () => {
    setIsRefreshing(true)

    if (onRefresh) {
      // Call the onRefresh callback if provided
      onRefresh()
      // Reset the refreshing state after a short delay
      setTimeout(() => {
        setIsRefreshing(false)
      }, 800)
    } else {
      // If no callback provided, just simulate a refresh
      setTimeout(() => {
        setIsRefreshing(false)
      }, 800)
    }
  }

  // Handle provider accordion toggle
  const handleProviderToggle = (provider: string) => {
    setExpandedProviders(current => {
      if (current.includes(provider)) {
        return current.filter(p => p !== provider)
      }
      return [...current, provider]
    })
  }

  // Handle model selection
  const handleModelSelect = (provider: string, model: Model) => {
    if (onModelSelect) {
      onModelSelect(provider, model)
    }
  }

  // Mask sensitive information
  const maskValue = (value?: string): string => {
    if (!value) return ""
    return showSensitive ? value : value.substring(0, 4) + "•".repeat(8)
  }

  return (
    <div className="w-full space-y-4 ">
      <div className="flex justify-between items-center mb-6 border-b dark:border-gray-800 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2 border-blue-300 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 text-blue-500 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 rounded-xl p-0.5 shadow-lg">
        <div className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden">
          <Accordion
            type="multiple"
            value={expandedProviders}
            className="w-full"
          >
            {Object.entries(initialData).map(([key, provider]) => (
              <AccordionItem
                key={key}
                value={key}
                className="border-b last:border-0 border-gray-100 dark:border-gray-800"
              >
                <AccordionTrigger
                  onClick={() => handleProviderToggle(key)}
                  className="hover:no-underline px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center">
                    {getProviderIcon(provider.provider)}
                    <span className="font-semibold text-lg mr-2">
                      {provider.provider.toUpperCase()}
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                    >
                      {provider.models.length} Models
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg mt-2">
                    {provider.models.map((model, index) => (
                      <Card
                        key={`${model.model}-${index}`}
                        className="overflow-hidden transition-all hover:shadow-md dark:hover:border-gray-600 cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:translate-y-[-2px]"
                        onClick={() =>
                          handleModelSelect(provider.provider, model)
                        }
                      >
                        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
                          <CardTitle className="text-base flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            {model.title}
                          </CardTitle>
                          <CardDescription className="text-xs truncate font-mono">
                            {model.model}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-2">
                          {model.baseURL && (
                            <div className="text-xs mb-1">
                              <span className="font-semibold">Base URL: </span>
                              <span className="font-mono break-all">
                                {model.baseURL}
                              </span>
                            </div>
                          )}
                          {model.apiKey && (
                            <div className="text-xs">
                              <span className="font-semibold">API Key: </span>
                              <span className="font-mono">
                                {maskValue(model.apiKey)}
                              </span>
                            </div>
                          )}
                          {!model.baseURL && !model.apiKey && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                              No configuration details available
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {Object.keys(initialData).length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
          <ServerIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
          <p>No provider data available</p>
        </div>
      )}
    </div>
  )
}

export default ProviderModelViewer
