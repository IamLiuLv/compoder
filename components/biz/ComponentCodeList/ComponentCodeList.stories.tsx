import type { Meta, StoryObj } from "@storybook/react"
import { ComponentCodeList } from "./ComponentCodeList"
import { ComponentItem } from "./interface"
import { useState, useEffect } from "react"
import { within, userEvent, waitFor, screen } from "@storybook/testing-library"
import { expect } from "@storybook/jest"

const meta = {
  title: "Biz/ComponentCodeList",
  component: ComponentCodeList,
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentCodeList>

export default meta
type Story = StoryObj<typeof ComponentCodeList>

const mockItems = [
  {
    id: "1",
    title: "CSS Theme Switch CSS Theme Switch CSS Theme Switch ",
    description:
      "A beautiful A beautiful A beautiful  A beautiful A beautiful A beautiful A beautiful  A beautiful A beautiful  A beautiful",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
  {
    id: "2",
    title: "Dark Mode Toggle",
    description: "Simple and elegant dark mode toggle with system preference",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
  {
    id: "3",
    title: "Color Scheme Picker",
    description: "Advanced color scheme picker with custom theme support",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
  {
    id: "4",
    title: "Customizable Button",
    description: "A customizable button with various styles and sizes",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
  {
    id: "5",
    title: "Responsive Layout",
    description: "A responsive layout with breakpoints and media queries",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
  {
    id: "6",
    title: "Animated Loader",
    description: "A loader with smooth animations and customizable colors",
    code: {
      "App.tsx":
        "import React from 'react'; import { Button } from 'antd'; return <Button>Hello World</Button>;",
    },
    entryFile: "App.tsx",
  },
] as ComponentItem[]

export const Default: Story = {
  args: {
    items: mockItems,
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
    onItemClick: id => console.log("Edit clicked:", id),
    onDeleteClick: id => console.log("Delete clicked:", id),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // 1. 检查所有卡片标题和描述（用 startsWith 部分匹配，避免长文本分割问题）
    args.items.forEach(item => {
      expect(canvas.getByText((content) => content.startsWith(item.title.slice(0, 10)))).toBeInTheDocument()
      expect(canvas.getByText((content) => content.startsWith(item.description.slice(0, 10)))).toBeInTheDocument()
    })
    // 2. 点击第一个卡片
    const firstCard = canvas.getByText((content) => content.startsWith(args.items[0].title.slice(0, 10))).closest(".group") || canvas.getByText((content) => content.startsWith(args.items[0].title.slice(0, 10))).parentElement
    await userEvent.click(firstCard!)
    // 3. 点击第一个卡片的删除按钮
    const deleteButtons = canvas.getAllByRole("button", { name: /delete/i })
    await userEvent.click(deleteButtons[0])
    // 4. 检查弹窗出现（用 screen）
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.toLowerCase().includes("confirm deletion"))
      ).toBeInTheDocument()
    })
    // 5. 点击弹窗中的 Delete 按钮（用 screen）
    const confirmDeleteBtn = screen.getByRole("button", { name: /delete/i })
    await userEvent.click(confirmDeleteBtn)
    // 6. 弹窗关闭（用 screen）
    await waitFor(() => {
      expect(
        screen.queryByText((content) => content.toLowerCase().includes("confirm deletion"))
      ).not.toBeInTheDocument()
    })
  },
}

export const SingleItem: Story = {
  args: {
    items: [mockItems[0]],
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
    onItemClick: id => console.log("Edit clicked:", id),
    onDeleteClick: id => console.log("Delete clicked:", id),
  }
}

export const TwoItems: Story = {
  args: {
    items: mockItems.slice(0, 2),
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
    onItemClick: id => console.log("Edit clicked:", id),
    onDeleteClick: id => console.log("Delete clicked:", id),
  },
}

export const AnimatedAddition: Story = {
  render: function AnimatedAdditionStory() {
    const [items, setItems] = useState<ComponentItem[]>(mockItems)

    useEffect(() => {
      // Add a new item after 1.5 seconds
      const timer = setTimeout(() => {
        setItems(prevItems => [
          {
            id: "new-1",
            title: "New Component",
            description: "This component just flew in!",
            code: {
              "index.css": "body { background-color: red; }",
            },
            entryFile: "App.tsx",
          },
          ...prevItems,
        ])
      }, 1500)

      return () => clearTimeout(timer)
    }, [])

    return (
      <ComponentCodeList
        codeRendererServer="https://antd-renderer.pages.dev/artifacts"
        items={items}
        onItemClick={id => console.log("Edit clicked:", id)}
        onDeleteClick={id => console.log("Delete clicked:", id)}
      />
    )
  },
}

export const EmptyList: Story = {
  args: {
    items: [],
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // 检查没有卡片渲染
    expect(canvas.queryAllByRole("heading").length).toBe(0)
    // 可根据实际 UI 增加"暂无数据"断言
  },
}

export const LongText: Story = {
  args: {
    items: [
      {
        id: "long",
        title: "超长标题".repeat(20),
        description: "超长描述".repeat(50),
        code: { "App.tsx": "export default function() { return null }" },
        entryFile: "App.tsx",
      },
    ],
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText((content) => content.startsWith(args.items[0].title.slice(0, 10)))).toBeInTheDocument()
    expect(canvas.getByText((content) => content.startsWith(args.items[0].description.slice(0, 10)))).toBeInTheDocument()
  },
}

export const DeleteCancel: Story = {
  args: {
    items: mockItems,
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
    onDeleteClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const deleteButtons = canvas.getAllByRole("button", { name: /delete/i })
    await userEvent.click(deleteButtons[0])
    // 用 screen 检查弹窗
    await waitFor(() => {
      expect(screen.getByText((content) => content.toLowerCase().includes("confirm deletion"))).toBeInTheDocument()
    })
    // 点击 Cancel
    const cancelBtn = screen.getByRole("button", { name: /cancel/i })
    await userEvent.click(cancelBtn)
    // 弹窗关闭
    await waitFor(() => {
      expect(screen.queryByText((content) => content.toLowerCase().includes("confirm deletion"))).not.toBeInTheDocument()
    })
    // onDeleteClick 不应被调用（这里只能人工看 log，mock 函数需 jest 环境）
  },
}

export const NoCallbacks: Story = {
  args: {
    items: mockItems,
    codeRendererServer: "https://antd-renderer.pages.dev/artifacts",
    // 不传 onItemClick/onDeleteClick
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // 点击卡片/删除按钮应无报错
    const firstCard = canvas.getByText((content) => content.startsWith(mockItems[0].title.slice(0, 10))).closest(".group")
    await userEvent.click(firstCard!)
    const deleteButtons = canvas.getAllByRole("button", { name: /delete/i })
    await userEvent.click(deleteButtons[0])
    // 弹窗出现后直接点 Cancel
    const cancelBtn = screen.getByRole("button", { name: /cancel/i })
    await userEvent.click(cancelBtn)
  },
}
