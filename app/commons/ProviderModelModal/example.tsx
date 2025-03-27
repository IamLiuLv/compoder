/**
 * Example of how to use the ProviderModelModal
 *
 * This is a demonstration and not part of the actual implementation
 */

import React from "react"
import {
  ProviderModelModalProvider,
  ProviderModelModalButton,
  useProviderModelModal,
} from "./index"
import { Model } from "@/components/biz/ProviderModelViewer/interface"

// 1. Wrap your application or part of it with the Provider
export const ExampleWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Optional: Handle model selection changes
  const handleModelChange = (
    provider: string | undefined,
    model: Model | undefined,
  ) => {
    if (provider && model) {
      console.log(`Selected: ${provider} - ${model.title} (${model.model})`)
      // Do something with the selection, e.g. update app state or call an API
    }
  }

  return (
    <ProviderModelModalProvider onChange={handleModelChange}>
      {children}
    </ProviderModelModalProvider>
  )
}

// 2. Use the button to trigger the modal
export const ExampleButton: React.FC = () => {
  return (
    <div className="p-4">
      {/* Basic usage */}
      <ProviderModelModalButton />

      {/* Customized button */}
      <ProviderModelModalButton
        label="Select AI Model"
        variant="default"
        size="default"
        className="ml-4"
      />
    </div>
  )
}

// 3. Or use the hook to programmatically control the modal
export const ExampleProgrammaticControl: React.FC = () => {
  const { openModal, selectedModel } = useProviderModelModal()

  return (
    <div className="p-4">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Model Selector
      </button>

      {selectedModel && (
        <div className="mt-4">
          <h3>Selected Model:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(selectedModel, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// 4. Full example of wrapping an app
export const ExampleApp: React.FC = () => {
  return (
    <ExampleWrapper>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Provider Model Modal Example
        </h1>
        <p className="mb-6">
          This example shows how to use the Provider Model Modal in your
          application.
        </p>

        <div className="flex space-x-4">
          <ExampleButton />
          <ExampleProgrammaticControl />
        </div>
      </div>
    </ExampleWrapper>
  )
}
