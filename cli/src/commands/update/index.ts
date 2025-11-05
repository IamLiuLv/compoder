import { Command } from "commander"
import * as path from "path"
import { ApiClient } from "../../shared/api-client"
import { Logger } from "../../shared/utils"
import { readJsonFile, fileExists } from "../../shared/file-utils"
import {
  setupCursorRules,
  setupClaudeCodeRules,
} from "../../shared/prompt-generator"
import {
  setupCursorMcpConfig,
  setupClaudeCodeMcpConfig,
} from "../../shared/mcp-config-generator"
import { CompoderConfig } from "../../shared/types"

export const updateCommand = new Command("update").description(
  "Update Compoder rules based on .compoderrc configuration",
)

updateCommand
  .option(
    "--api-base-url <url>",
    "Base URL for the Compoder API",
    "http://localhost:3000",
  )
  .action(async (options: any) => {
    try {
      Logger.info("Updating Compoder rules...\n")

      const currentDir = process.cwd()
      const configPath = path.join(currentDir, ".compoderrc")

      // 检查 .compoderrc 是否存在
      if (!fileExists(configPath)) {
        Logger.error(".compoderrc file not found in the current directory.")
        Logger.info(
          "Please run 'compoder init' first to initialize the configuration.",
        )
        process.exit(1)
      }

      // 读取配置文件
      Logger.info("Reading .compoderrc configuration...")
      const config: CompoderConfig = readJsonFile(configPath)
      Logger.success(
        `Configuration loaded: codegen=${config.codegen}, aiClients=${config.aiClients.join(", ")}\n`,
      )

      // 验证配置
      if (
        !config.codegen ||
        !config.aiClients ||
        config.aiClients.length === 0
      ) {
        Logger.error("Invalid .compoderrc configuration.")
        Logger.info(
          "The configuration file must contain 'codegen' and 'aiClients' fields.",
        )
        process.exit(1)
      }

      // 创建 API 客户端
      const apiClient = new ApiClient(options.apiBaseUrl)

      // 获取最新的 codegen 详情
      Logger.info(`Fetching latest codegen details for '${config.codegen}'...`)
      const codegenDetail = await apiClient.getCodegenDetail(config.codegen)
      Logger.success("Codegen details fetched\n")

      // 为每个配置的 AI 客户端更新规则
      for (const client of config.aiClients) {
        if (client === "cursor") {
          // 更新 Cursor MCP 配置
          await setupCursorMcpConfig(currentDir, options.apiBaseUrl)

          // 更新 Cursor rules
          await setupCursorRules(
            currentDir,
            config.codegen,
            codegenDetail.rules,
          )
        } else if (client === "claude-code") {
          // 更新 Claude Code MCP 配置
          await setupClaudeCodeMcpConfig(currentDir, options.apiBaseUrl)

          // 更新 Claude Code rules
          await setupClaudeCodeRules(
            currentDir,
            config.codegen,
            codegenDetail.rules,
          )
        } else {
          Logger.warn(`Unknown AI client: ${client}. Skipping...\n`)
        }
      }

      Logger.success("✓ Rules updated successfully!")
      Logger.info(
        "\nThe rule files have been regenerated based on the latest codegen configuration.",
      )
    } catch (error) {
      Logger.error(`Update failed: ${error}`)
      process.exit(1)
    }
  })
