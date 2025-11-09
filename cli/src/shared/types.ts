// API相关类型定义
export interface McpComponentListResponse {
  markdown: string
  components: {
    [libraryName: string]: {
      [componentName: string]: {
        description: string
      }
    }
  }
}

export interface McpComponentDetailResponse {
  libraryName: string
  components: {
    [componentName: string]: {
      description: string
      api: string
    }
  }
}

export interface CodegenListResponse {
  markdown: string
  codegens: {
    [codegenName: string]: {
      title: string
      description: string
    }
  }
}

export interface CodegenRule {
  type:
    | "public-components"
    | "styles"
    | "private-components"
    | "file-structure"
    | "attention-rules"
  description: string
  prompt?: string
  dataSet?: string[]
  docs?: {
    [libraryName: string]: {
      [componentName: string]: {
        description: string
        api: string
      }
    }
  }
}

export interface CodegenDetailResponse {
  title: string
  description: string
  fullStack: string
  guides: string[]
  codeRendererUrl: string
  rules: CodegenRule[]
}

export type AiClient = "cursor" | "claude-code"

export interface CompoderConfig {
  codegen: string
  aiClients: AiClient[]
  version: string
}

// CLI配置类型
export interface CliConfig {
  apiBaseUrl: string
  defaultPort: number
  defaultHost: string
}

// MCP工具参数类型
export interface ComponentListToolArgs {
  codegenName: string
}

export interface ComponentDetailToolArgs {
  codegenName: string
  libraryName: string
  componentNames: string[]
}

// 错误类型
export class CliError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "CliError"
  }
}
