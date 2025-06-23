import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { AIProvider } from "@/lib/config/ai-providers"
import { LLMSelector } from "."
import { LLMOption } from "./interface"
import { within, userEvent, expect } from "@storybook/test"

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
    features: ["vision"],
  },
  {
    provider: "openai",
    modelId: "anthropic/claude-3.7-sonnet",
    title: "Claude 3.7 Sonnet (OpenRouter)",
    features: ["vision"],
  },
  {
    provider: "openai",
    modelId: "anthropic/claude-3.5-sonnet",
    title: "Claude 3.5 Sonnet (OpenRouter)",
    features: ["vision"],
  },
  {
    provider: "anthropic",
    modelId: "claude-3-7-sonnet-latest",
    title: "Claude 3.7 Sonnet",
    features: ["vision"],
  },
  {
    provider: "anthropic",
    modelId: "claude-3-5-sonnet-latest",
    title: "Claude 3.5 Sonnet",
    features: ["vision"],
  },
]

// Basic example
export const Basic: Story = {
  args: {
    initialData: mockLLMOptions,
    placeholder: "Select an LLM model",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // 步骤 1: 查找并点击下拉框
    await step("Open dropdown", async () => {
      const selectButton = canvas.getByRole("combobox")
      await userEvent.click(selectButton)
    })

    // 步骤 2: 等待下拉菜单渲染并选择选项
    await step("Select option", async () => {
      // 使用 getByRole 查找选项列表
      await new Promise(resolve => setTimeout(resolve, 500)) // 增加等待时间

      // 查找下拉列表中的所有选项
      const options = document.querySelectorAll('[role="option"]')
      const gpt4Option = Array.from(options).find(option =>
        option.textContent?.includes("GPT-4o"),
      )

      if (!gpt4Option) {
        throw new Error("GPT-4o option not found")
      }

      await userEvent.click(gpt4Option)
    })

    // 步骤 3: 验证选择结果
    await step("Verify selection", async () => {
      const selectButton = canvas.getByRole("combobox")
      // 使用正则表达式进行更灵活的文本匹配
      const hasGPT4Text = selectButton.textContent?.match(/GPT-4o/i)
      expect(hasGPT4Text).toBeTruthy()
    })
  },
}

// With initial selection
export const WithSelection: Story = {
  args: {
    initialData: mockLLMOptions,
    selectedProvider: "openai",
    selectedModel: "gpt-4o",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selectButton = canvas.getByRole("combobox")
    expect(selectButton.textContent?.includes("GPT-4o")).toBeTruthy()
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    initialData: mockLLMOptions,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const selectButton = canvas.getByRole("combobox")
    expect(selectButton.hasAttribute("disabled")).toBeTruthy()
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
          </p >
          <p>
            <strong>Selected Model:</strong> {model || "None"}
          </p >
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 1. 先验证下拉框是否存在
    const selectButton = canvas.getByRole("combobox")
    expect(selectButton).toBeTruthy()

    // 2. 点击打开下拉框
    await userEvent.click(selectButton)

    // 3. 等待并选择选项
    await new Promise(resolve => setTimeout(resolve, 500))

    const options = document.querySelectorAll('[role="option"]')
    const gpt4Option = Array.from(options).find(option =>
      option.textContent?.includes("GPT-4o"),
    )

    if (gpt4Option) {
      await userEvent.click(gpt4Option)
    }

    // 5. 验证选择后的显示文本
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(selectButton.textContent).toContain("GPT-4o")
  },
}