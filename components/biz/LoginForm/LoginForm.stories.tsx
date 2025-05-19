import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within, fn, fireEvent } from "@storybook/test"
import LoginForm from "./LoginForm"

const meta: Meta<typeof LoginForm> = {
  title: "Biz/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "支持 Github 登录、loading 态、无回调健壮性的登录入口组件。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onGithubSignIn: { action: "onGithubSignIn" },
    onSubmit: { action: "onSubmit" },
    loading: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onGithubSignIn: fn(),
    loading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole("button", { name: /sign in with github/i })
    await userEvent.click(btn)
    expect(args.onGithubSignIn).toHaveBeenCalled()
  },
}

export const Loading: Story = {
  args: {
    onGithubSignIn: fn(),
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole("button", { name: /sign in with github/i })
    expect(btn).toBeDisabled()
    expect(btn.querySelector(".animate-spin")).toBeInTheDocument()
  },
}

export const NoCallback: Story = {
  args: {
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole("button", { name: /sign in with github/i })
    await userEvent.click(btn)
    expect(btn).not.toBeDisabled()
  },
}

export const FormSubmit: Story = {
  args: {
    onSubmit: fn(),
    loading: false,
  },
  play: async ({ canvasElement, args }) => {
    const form = canvasElement.querySelector("form")
    fireEvent.submit(form!)
    expect(args.onSubmit).toHaveBeenCalled()
  },
}
