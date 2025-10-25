import { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { ApiClient } from "../../../shared/api-client"
import { ComponentListToolArgs, CliError } from "../../../shared/types"
import { validateCodegenName, Logger } from "../../../shared/utils"

export class ComponentListTool {
  name = "component-list"
  description =
    "Get a list of all components for a specified codegen in markdown format"

  inputSchema = {
    type: "object" as const,
    properties: {
      codegenName: {
        type: "string" as const,
        description: "Name of the codegen to get components for",
      },
    },
    required: ["codegenName"] as const,
  }

  constructor(private apiClient: ApiClient) {}

  async call(args: ComponentListToolArgs): Promise<CallToolResult> {
    try {
      Logger.debug(`Getting component list for codegen: ${args.codegenName}`)

      // 验证输入参数
      if (!validateCodegenName(args.codegenName)) {
        throw new CliError("Invalid codegen name format")
      }

      // 调用API获取组件列表
      const response = await this.apiClient.getComponentList(args.codegenName)

      Logger.debug(
        `Found ${Object.keys(response.components).length} component libraries`,
      )

      return {
        content: [
          {
            type: "text",
            text: response.markdown,
          },
        ],
        isError: false,
      }
    } catch (error) {
      Logger.error(`Failed to get component list: ${error}`)

      const errorMessage =
        error instanceof CliError
          ? error.message
          : "Failed to retrieve component list"

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
