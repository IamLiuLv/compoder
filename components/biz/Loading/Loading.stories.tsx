import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "@storybook/test"
import { Loading } from "./Loading"

const meta: Meta<typeof Loading> = {
  title: "Biz/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "多场景加载指示器，支持不同尺寸、全屏、定制class。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    fullscreen: {
      control: "boolean",
      description: "是否全屏显示加载指示器",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "加载指示器尺寸",
    },
    className: {
      control: "text",
      description: "自定义className",
    },
  },
}

export default meta

type Story = StoryObj<typeof Loading>

export const Default: Story = {
  args: {
    size: "default",
    fullscreen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinner = canvas.getByRole("status")
    expect(spinner).toBeInTheDocument()
    expect(spinner.className).toMatch(/w-10 h-10/)
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    fullscreen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinner = canvas.getByRole("status")
    expect(spinner).toBeInTheDocument()
    expect(spinner.className).toMatch(/w-5 h-5/)
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    fullscreen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinner = canvas.getByRole("status")
    expect(spinner).toBeInTheDocument()
    expect(spinner.className).toMatch(/w-14 h-14/)
  },
}

export const Fullscreen: Story = {
  args: {
    size: "default",
    fullscreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overlay = canvas.getByTestId?.("fullscreen-overlay") || canvas.getByRole("status").parentElement
    expect(overlay).toBeInTheDocument()
    expect(overlay?.className).toMatch(/fixed|inset-0|backdrop-blur/)
  },
}

export const FullscreenLarge: Story = {
  args: {
    size: "lg",
    fullscreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overlay = canvas.getByTestId?.("fullscreen-overlay") || canvas.getByRole("status").parentElement
    expect(overlay).toBeInTheDocument()
    expect(overlay?.className).toMatch(/fixed|inset-0|backdrop-blur/)
    const spinner = canvas.getByRole("status")
    expect(spinner.className).toMatch(/w-14 h-14/)
  },
}

export const CustomClass: Story = {
  args: {
    size: "default",
    className: "text-blue-500",
    fullscreen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const spinner = canvas.getByRole("status")
    expect(spinner).toBeInTheDocument()
    expect(spinner.className).toMatch(/text-blue-500/)
  },
}
