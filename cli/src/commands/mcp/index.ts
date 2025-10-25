import { Command } from "commander"
import { startMcpServer } from "./server"
import { Logger } from "../../shared/utils"

export const mcpCommand = new Command("mcp").description(
  "Model Context Protocol related commands",
)

// mcp server 命令
mcpCommand
  .command("server")
  .argument("<codegenName>", "Name of the codegen to serve")
  .description("Start MCP server for the specified codegen")
  .option(
    "--api-base-url <url>",
    "Base URL for the Compoder API",
    "http://localhost:3000",
  )
  .option("--debug", "Enable debug logging")
  .action(async (codegenName: string, options: any) => {
    // 设置调试模式
    if (options.debug) {
      process.env.DEBUG = "1"
    }

    Logger.info(`Starting MCP server for codegen: "${codegenName}"`)
    Logger.debug(`API Base URL: ${options.apiBaseUrl}`)

    try {
      await startMcpServer(codegenName, {
        apiBaseUrl: options.apiBaseUrl,
      })
    } catch (error) {
      Logger.error(`Failed to start MCP server: ${error}`)
      process.exit(1)
    }
  })

// 未来可以添加更多MCP相关命令
// mcpCommand
//   .command('list')
//   .description('List available codegens')
//   .action(async () => {
//     // 实现列出可用codegen的逻辑
//   })

// mcpCommand
//   .command('validate')
//   .argument('<codegenName>', 'Name of the codegen to validate')
//   .description('Validate codegen configuration')
//   .action(async (codegenName: string) => {
//     // 实现验证codegen配置的逻辑
//   })
