import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "@storybook/test"
import { Logo } from "./Logo"

const meta: Meta<typeof Logo> = {
  title: "Biz/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "品牌 Logo 组件，支持自定义尺寸和样式 className，SVG 实现渐变与路径。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: "number" },
    height: { control: "number" },
    className: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Logo>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole("img", { hidden: true }) || canvas.getByTestId("logo-svg") || canvas.getByTitle(/logo/i) || canvas.getByText((_, node) => node?.nodeName === "svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "200")
    expect(svg).toHaveAttribute("height", "200")
  },
}

export const Small: Story = {
  args: { width: 100, height: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole("img", { hidden: true }) || canvas.getByTestId("logo-svg") || canvas.getByTitle(/logo/i) || canvas.getByText((_, node) => node?.nodeName === "svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "100")
    expect(svg).toHaveAttribute("height", "100")
  },
}

export const Large: Story = {
  args: { width: 400, height: 400 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole("img", { hidden: true }) || canvas.getByTestId("logo-svg") || canvas.getByTitle(/logo/i) || canvas.getByText((_, node) => node?.nodeName === "svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "400")
    expect(svg).toHaveAttribute("height", "400")
  },
}

export const CustomClassName: Story = {
  args: { className: "custom-logo" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole("img", { hidden: true }) || canvas.getByTestId("logo-svg") || canvas.getByTitle(/logo/i) || canvas.getByText((_, node) => node?.nodeName === "svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass("custom-logo")
  },
}

export const BatchSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Logo width={50} height={50} />
      <Logo width={150} height={80} />
      <Logo width={300} height={300} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svgs = canvas.getAllByText((_, node) => node?.nodeName === "svg")
    expect(svgs[0]).toHaveAttribute("width", "50")
    expect(svgs[0]).toHaveAttribute("height", "50")
    expect(svgs[1]).toHaveAttribute("width", "150")
    expect(svgs[1]).toHaveAttribute("height", "80")
    expect(svgs[2]).toHaveAttribute("width", "300")
    expect(svgs[2]).toHaveAttribute("height", "300")
  },
}
