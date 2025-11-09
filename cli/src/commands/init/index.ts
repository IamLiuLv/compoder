import { Command } from "commander"
import inquirer from "inquirer"
import * as path from "path"
import { ApiClient } from "../../shared/api-client"
import { Logger } from "../../shared/utils"
import { writeJsonFile, fileExists } from "../../shared/file-utils"
import {
  setupCursorRules,
  setupClaudeCodeRules,
} from "../../shared/prompt-generator"
import {
  setupCursorMcpConfig,
  setupClaudeCodeMcpConfig,
} from "../../shared/mcp-config-generator"
import { AiClient, CompoderConfig } from "../../shared/types"

export const initCommand = new Command("init").description(
  "Initialize Compoder configuration for the current project",
)

initCommand
  .option(
    "--api-base-url <url>",
    "Base URL for the Compoder API",
    "http://localhost:3000",
  )
  .action(async (options: any) => {
    try {
      Logger.info("Initializing Compoder configuration...\n")

      const apiClient = new ApiClient(options.apiBaseUrl)

      // Step 1: 获取 codegen 列表
      Logger.info("Fetching available codegens...")
      const codegenListResponse = await apiClient.getCodegenList()

      const codegenChoices = Object.entries(codegenListResponse.codegens).map(
        ([name, info]) => ({
          name: `${info.title} - ${info.description}`,
          value: info.title,
          short: info.title,
        }),
      )

      if (codegenChoices.length === 0) {
        Logger.error("No codegens available. Please check your API server.")
        process.exit(1)
      }

      // Step 2: 交互式选择 codegen
      const { selectedCodegen } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedCodegen",
          message: "Select a codegen to initialize:",
          choices: codegenChoices,
          pageSize: 10,
          loop: false,
        },
      ])

      Logger.success(`Selected codegen: ${selectedCodegen}\n`)

      // Step 3: 交互式选择 AI 客户端
      const { selectedClients } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedClients",
          message:
            "Select AI clients to initialize (use space to select, enter to confirm):",
          choices: [
            { name: "Cursor", value: "cursor" as AiClient, checked: true },
            {
              name: "Claude Code",
              value: "claude-code" as AiClient,
              checked: false,
            },
          ],
          validate: (answer: AiClient[]) => {
            if (answer.length === 0) {
              return "You must select at least one AI client."
            }
            return true
          },
        },
      ])

      Logger.success(`Selected AI clients: ${selectedClients.join(", ")}\n`)

      // Step 4: 生成 .compoderrc 配置文件
      const currentDir = process.cwd()
      const configPath = path.join(currentDir, ".compoderrc")

      if (fileExists(configPath)) {
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message: ".compoderrc already exists. Overwrite?",
            default: false,
          },
        ])

        if (!overwrite) {
          Logger.warn("Initialization cancelled.")
          process.exit(0)
        }
      }

      const config: CompoderConfig = {
        codegen: selectedCodegen,
        aiClients: selectedClients,
        version: "0.0.1",
      }

      writeJsonFile(configPath, config)
      Logger.success(`Created .compoderrc configuration file\n`)

      // Step 5: 获取 codegen 详情
      Logger.info("Fetching codegen details...")
      const codegenDetail = await apiClient.getCodegenDetail(selectedCodegen)
      Logger.success("Codegen details fetched\n")

      // Step 6: 为每个选择的 AI 客户端生成配置
      for (const client of selectedClients) {
        if (client === "cursor") {
          // 生成 Cursor MCP 配置
          await setupCursorMcpConfig(currentDir, options.apiBaseUrl)

          // 生成 Cursor rules
          await setupCursorRules(
            currentDir,
            selectedCodegen,
            codegenDetail.rules,
          )
        } else if (client === "claude-code") {
          // 生成 Claude Code MCP 配置
          await setupClaudeCodeMcpConfig(currentDir, options.apiBaseUrl)

          // 生成 Claude Code rules
          await setupClaudeCodeRules(
            currentDir,
            selectedCodegen,
            codegenDetail.rules,
          )
        }
      }

      Logger.success("✓ Initialization completed successfully!")
      Logger.info("\nNext steps:")
      Logger.info("1. Make sure your Compoder API server is running")
      Logger.info(
        "2. Start using Compoder rules in your AI client to generate components",
      )
    } catch (error) {
      Logger.error(`Initialization failed: ${error}`)
      process.exit(1)
    }
  })
