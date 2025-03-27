import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { AIProvider } from "@/lib/config/ai-providers"
import { LLMSelector } from "."
import { LLMOption } from "./interface"

const meta: Meta<typeof LLMSelector> = {
  title: "biz/LLMSelector",
  component: LLMSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof LLMSelector>

// Mock LLM options data
const mockLLMOptions: LLMOption[] = [
  {
    provider: "openai",
    modelId: "gpt-4o",
    title: "GPT-4o",
  },
  {
    provider: "openai",
    modelId: "anthropic/claude-3.7-sonnet",
    title: "Claude 3.7 Sonnet (OpenRouter)",
  },
  {
    provider: "openai",
    modelId: "anthropic/claude-3.5-sonnet",
    title: "Claude 3.5 Sonnet (OpenRouter)",
  },
  {
    provider: "anthropic",
    modelId: "claude-3-7-sonnet-latest",
    title: "Claude 3.7 Sonnet",
  },
  {
    provider: "anthropic",
    modelId: "claude-3-5-sonnet-latest",
    title: "Claude 3.5 Sonnet",
  },
]

// Basic example
export const Basic: Story = {
  args: {
    initialData: mockLLMOptions,
    placeholder: "Select an LLM model",
  },
}

// With initial selection
export const WithSelection: Story = {
  args: {
    initialData: mockLLMOptions,
    selectedProvider: "openai",
    selectedModel: "gpt-4o",
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    initialData: mockLLMOptions,
    disabled: true,
  },
}

// Interactive example with state
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [provider, setProvider] = useState<AIProvider | undefined>()
    const [model, setModel] = useState<string | undefined>()

    return (
      <div className="space-y-4 w-[300px]">
        <LLMSelector
          initialData={mockLLMOptions}
          selectedProvider={provider}
          selectedModel={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
          placeholder="Select an LLM model"
        />

        <div className="p-4 bg-muted rounded-md text-sm">
          <p>
            <strong>Selected Provider:</strong> {provider || "None"}
          </p>
          <p>
            <strong>Selected Model:</strong> {model || "None"}
          </p>
        </div>
      </div>
    )
  },
}
