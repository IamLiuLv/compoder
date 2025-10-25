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
