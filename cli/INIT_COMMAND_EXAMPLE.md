# Compoder Init Command - Usage Example

## 概述

`compoder init` 命令用于在项目中初始化 Compoder 配置，自动生成 AI 客户端所需的规则文件。

## 前置条件

1. 确保 Compoder API 服务器正在运行（默认: http://localhost:3000）
2. 数据库中已有可用的 codegen 配置
3. CLI 已构建完成（运行 `npm run build`）

## 使用步骤

### 1. 运行初始化命令

```bash
cd /path/to/your/project
npx compoder init
```

或使用自定义 API 地址：

```bash
npx compoder init --api-base-url http://localhost:3001
```

### 2. 选择 Codegen

命令会显示可用的 codegen 列表，使用上下箭头键选择：

```
? Select a codegen to initialize: (Use arrow keys)
❯ Landing Page Codegen - Generate beautiful landing page components
  Dashboard Codegen - Create dashboard UI components
  Form Builder Codegen - Build complex form components
```

按回车确认选择。

### 3. 选择 AI 客户端

使用空格键选择/取消选择，回车确认：

```
? Select AI clients to initialize: (Press <space> to select, <enter> to confirm)
❯ ◉ Cursor
  ◯ Claude Code
```

### 4. 生成的文件

命令执行成功后，会在项目根目录生成以下文件：

#### .compoderrc

```json
{
  "codegen": "Landing Page Codegen",
  "aiClients": ["cursor"],
  "version": "0.0.1"
}
```

#### Cursor 规则文件（如果选择了 Cursor）

```
.cursor/
└── rules/
    └── compoder/
        └── landing-page-codegen/
            ├── index.mdc       # 主编排文件
            ├── step1.md        # 组件设计阶段规则
            └── step2.md        # 组件实现阶段规则
```

## 使用生成的规则

### 在 Cursor 中使用

1. 在 Cursor 中打开你的项目
2. 在聊天窗口中引用规则：`@landing-page-codegen`
3. 提供组件需求，AI 会按照两步流程执行：
   - **Step 1**: 分析需求，设计组件结构
   - **Step 2**: 生成组件代码文件

### 示例对话

```
User: @landing-page-codegen
帮我创建一个英雄区（Hero Section）组件，包含标题、副标题、CTA按钮和背景图片

AI: [执行 Step 1]
## Component Design

**Component Name**: HeroSection

**Component Description**: A hero section component with title, subtitle, CTA button and background image

**Required Libraries and Components**:
### shadcn
- Button
- Card

[执行 Step 2]
[创建组件文件...]
```

## 工作流程说明

### Step 1: 组件设计阶段

AI 会：

1. 分析用户需求
2. 提取组件名称和描述
3. 识别需要使用的基础组件库
4. 调用 MCP `component-list` 工具获取可用组件列表
5. 输出组件设计信息

### Step 2: 组件实现阶段

AI 会：

1. 根据 Step 1 的设计信息
2. 调用 MCP `component-detail` 工具获取组件 API 详情
3. 生成完整的组件代码文件
4. 创建 TypeScript 类型定义
5. 创建测试/演示文件

## MCP 工具集成

生成的规则文件会引导 AI 使用以下 MCP 工具：

### component-list

获取指定 codegen 的所有可用组件列表

```typescript
// AI 会自动调用
mcp.callTool("component-list", {
  codegenName: "Landing Page Codegen",
})
```

### component-detail

获取特定组件的详细 API 文档

```typescript
// AI 会自动调用
mcp.callTool("component-detail", {
  codegenName: "Landing Page Codegen",
  libraryName: "pageui",
  componentNames: ["Hero", "CTA"],
})
```

## 故障排除

### 问题 1: "No codegens available"

**原因**: API 服务器未运行或数据库中没有 codegen 数据

**解决方案**:

1. 确保 API 服务器正在运行
2. 检查数据库连接
3. 运行 codegen 初始化脚本

### 问题 2: ".compoderrc already exists"

**原因**: 项目已经初始化过

**解决方案**:

- 选择 "Yes" 覆盖现有配置
- 或选择 "No" 取消操作，手动编辑 .compoderrc

### 问题 3: "Failed to fetch codegen detail"

**原因**: 选择的 codegen 在数据库中不存在或 API 连接失败

**解决方案**:

1. 检查 API 服务器日志
2. 验证 codegen 名称是否正确
3. 检查网络连接

## 高级用法

### 自定义 API 地址

```bash
npx compoder init --api-base-url http://production-api.example.com
```

### 批量初始化多个项目

```bash
#!/bin/bash
projects=("project1" "project2" "project3")
for project in "${projects[@]}"; do
  cd "$project"
  npx compoder init --api-base-url http://localhost:3000
  cd ..
done
```

### 版本控制建议

建议将以下文件添加到版本控制：

- `.compoderrc` - 项目配置
- `.cursor/rules/compoder/**/*.md*` - 规则文件

这样团队成员可以共享相同的 Compoder 配置。

## 下一步

1. 确保 MCP 服务器正在运行：`npx compoder mcp server`
2. 在 Cursor 中引用生成的规则
3. 开始创建组件！

## 相关文档

- [CLI README](./README.md) - CLI 完整文档
- [MCP Server 测试](./test-mcp-server.js) - MCP 服务器测试脚本
- [Compoder 主文档](../README.md) - Compoder 项目文档
