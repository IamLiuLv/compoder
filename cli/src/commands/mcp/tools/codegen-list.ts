import { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { ApiClient } from "../../../shared/api-client"
import { CliError } from "../../../shared/types"
import { Logger } from "../../../shared/utils"

export class CodegenListTool {
  name = "codegen-list"
  description =
    "Get a list of all available codegens with their titles and descriptions"

  inputSchema = {
    type: "object" as const,
    properties: {},
    required: [] as const,
  }

  constructor(private apiClient: ApiClient) {}

  async call(): Promise<CallToolResult> {
    try {
      Logger.debug("Getting codegen list")

      // 调用API获取codegen列表
      const response = await this.apiClient.getCodegenList()

      Logger.debug(`Found ${Object.keys(response.codegens).length} codegens`)

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
      Logger.error(`Failed to get codegen list: ${error}`)

      const errorMessage =
        error instanceof CliError
          ? error.message
          : "Failed to retrieve codegen list"

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
