import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

import { ApiClient } from "../../shared/api-client"
import { ComponentListTool } from "./tools/component-list"
import { ComponentDetailTool } from "./tools/component-detail"
import { ComponentDetailToolArgs } from "../../shared/types"
import { getConfig } from "../../config/default"
import { Logger, validateCodegenName } from "../../shared/utils"

export interface McpServerOptions {
  codegenName: string
  apiBaseUrl?: string
}

export class McpServer {
  private server: Server
  private apiClient: ApiClient
  private componentListTool: ComponentListTool
  private componentDetailTool: ComponentDetailTool

  constructor(private options: McpServerOptions) {
    const config = getConfig()

    // 初始化API客户端
    this.apiClient = new ApiClient(options.apiBaseUrl || config.apiBaseUrl)

    // 初始化工具
    this.componentListTool = new ComponentListTool(this.apiClient)
    this.componentDetailTool = new ComponentDetailTool(this.apiClient)

    // 初始化MCP服务器
    this.server = new Server(
      {
        name: "compoder-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )

    this.setupHandlers()
  }

  private setupHandlers() {
    // 处理工具列表请求
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      Logger.debug("Received list tools request")

      return {
        tools: [
          {
            name: this.componentListTool.name,
            description: this.componentListTool.description,
            inputSchema: this.componentListTool.inputSchema,
          },
          {
            name: this.componentDetailTool.name,
            description: this.componentDetailTool.description,
            inputSchema: this.componentDetailTool.inputSchema,
          },
        ],
      }
    })

    // 处理工具调用请求
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params

      Logger.debug(`Received tool call: ${name}`)

      try {
        switch (name) {
          case this.componentListTool.name:
            // 自动注入codegenName
            const listArgs = {
              ...args,
              codegenName: this.options.codegenName,
            }
            return await this.componentListTool.call(listArgs)

          case this.componentDetailTool.name:
            // 自动注入codegenName
            const detailArgs = {
              ...args,
              codegenName: this.options.codegenName,
            } as ComponentDetailToolArgs
            return await this.componentDetailTool.call(detailArgs)

          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        Logger.error(`Tool execution error: ${error}`)
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${error}`,
            },
          ],
          isError: true,
        }
      }
    })
  }

  async start() {
    Logger.info(`Starting MCP server for codegen: ${this.options.codegenName}`)

    // 验证codegen名称
    if (!validateCodegenName(this.options.codegenName)) {
      throw new Error("Invalid codegen name format")
    }

    // 检查API连接
    try {
      const isHealthy = await this.apiClient.healthCheck()
      if (!isHealthy) {
        Logger.warn("API health check failed, but continuing...")
      } else {
        Logger.success("API connection verified")
      }
    } catch (error) {
      Logger.warn(`API health check failed: ${error}`)
    }

    // 启动服务器
    const transport = new StdioServerTransport()
    await this.server.connect(transport)

    Logger.success("MCP server started successfully")
    Logger.info("Available tools:")
    Logger.info(
      `  - ${this.componentListTool.name}: ${this.componentListTool.description}`,
    )
    Logger.info(
      `  - ${this.componentDetailTool.name}: ${this.componentDetailTool.description}`,
    )
  }
}

/**
 * 启动MCP服务器
 */
export async function startMcpServer(codegenName: string, options: any = {}) {
  try {
    const server = new McpServer({
      codegenName,
      apiBaseUrl: options.apiBaseUrl,
    })

    await server.start()
  } catch (error) {
    Logger.error(`Failed to start MCP server: ${error}`)
    process.exit(1)
  }
}
