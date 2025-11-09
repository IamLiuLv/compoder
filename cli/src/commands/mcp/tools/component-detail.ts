import { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { ApiClient } from "../../../shared/api-client"
import { ComponentDetailToolArgs, CliError } from "../../../shared/types"
import {
  validateCodegenName,
  validateComponentName,
  parseComponentNames,
  Logger,
} from "../../../shared/utils"

export class ComponentDetailTool {
  name = "component-detail"
  description = "Get detailed API documentation for specific components"

  inputSchema = {
    type: "object" as const,
    properties: {
      codegenName: {
        type: "string" as const,
        description: "Name of the codegen",
      },
      libraryName: {
        type: "string" as const,
        description: "Name of the component library",
      },
      componentNames: {
        type: "array" as const,
        items: {
          type: "string" as const,
        },
        description: "Array of component names to get details for",
      },
    },
    required: ["codegenName", "libraryName", "componentNames"] as const,
  }

  constructor(private apiClient: ApiClient) {}

  async call(args: ComponentDetailToolArgs): Promise<CallToolResult> {
    try {
      Logger.debug(
        `Getting component details for: ${args.componentNames.join(", ")} from ${args.libraryName}`,
      )

      // 验证输入参数
      if (!validateCodegenName(args.codegenName)) {
        throw new CliError("Invalid codegen name format")
      }

      if (!args.libraryName || args.libraryName.trim().length === 0) {
        throw new CliError("Library name is required")
      }

      if (!args.componentNames || args.componentNames.length === 0) {
        throw new CliError("At least one component name is required")
      }

      // 验证组件名称格式
      for (const componentName of args.componentNames) {
        if (!validateComponentName(componentName)) {
          throw new CliError(`Invalid component name format: ${componentName}`)
        }
      }

      // 调用API获取组件详情
      const response = await this.apiClient.getComponentDetail(
        args.codegenName,
        args.libraryName,
        args.componentNames,
      )

      // 格式化输出
      let output = `# Component Details for ${args.libraryName}\n\n`

      for (const [componentName, details] of Object.entries(
        response.components,
      )) {
        output += `## ${componentName}\n\n`
        output += `**Description:** ${details.description}\n\n`
        output += `**API Documentation:**\n\n`
        output += "```\n"
        output += details.api
        output += "\n```\n\n"
      }

      Logger.debug(
        `Retrieved details for ${Object.keys(response.components).length} components`,
      )

      return {
        content: [
          {
            type: "text",
            text: output.trim(),
          },
        ],
        isError: false,
      }
    } catch (error) {
      Logger.error(`Failed to get component details: ${error}`)

      const errorMessage =
        error instanceof CliError
          ? error.message
          : "Failed to retrieve component details"

      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      }
    }
  }
}
