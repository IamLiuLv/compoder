import type { Meta, StoryObj } from "@storybook/react"
import { usePathname } from "next/navigation"
import { AppSidebarLayout } from "./AppSidebarLayout"
import { mockData } from "./mock-data"
import { AppHeader } from "../AppHeader"
import { NavMainItem, UserInfo } from "./interface"

const meta: Meta<typeof AppSidebarLayout> = {
  component: AppSidebarLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/codegen",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AppSidebarLayout>

const ExampleContent = () => (
  <>
    <AppHeader
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Codegen", href: "/codegen" },
      ]}
    />
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </>
)

const StoryWrapper = ({
  children,
  navMain,
  user,
}: {
  children: React.ReactNode
  navMain: NavMainItem[]
  user: UserInfo
}) => {
  const pathname = usePathname()
  const navMainWithActive = navMain.map((item: NavMainItem) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  return (
    <AppSidebarLayout
      navMain={navMainWithActive}
      user={user}
      onLogout={() => {}}
    >
      {children}
    </AppSidebarLayout>
  )
}

export const Default: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
}

export const Mobile: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

export const Tablet: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
}

export const Desktop: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
}

export const WithSettingsActive: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/settings",
      },
    },
  },
}

export const EmptyMenu: Story = {
  render: () => (
    <StoryWrapper navMain={[]} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  name: "Empty Menu",
}

export const SingleMenuItem: Story = {
  render: () => (
    <StoryWrapper navMain={[mockData.navMain[0]]} user={mockData.user}>
      <ExampleContent />
    </StoryWrapper>
  ),
  name: "Single Menu Item",
}

export const ThemeSwitch: Story = {
  render: () => (
    <div className="dark bg-zinc-900 min-h-screen">
      <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
        <ExampleContent />
      </StoryWrapper>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#18181b" },
      ],
    },
  },
  name: "Theme Switch (Dark)",
}

export const LoadingState: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <div className="flex items-center justify-center h-96 text-xl text-muted-foreground">
        Loading...
      </div>
    </StoryWrapper>
  ),
  name: "Loading State",
}

export const ErrorState: Story = {
  render: () => (
    <StoryWrapper navMain={mockData.navMain} user={mockData.user}>
      <div className="flex items-center justify-center h-96 text-xl text-destructive">
        Loading failed, please try again.
      </div>
    </StoryWrapper>
  ),
  name: "Error State",
}
