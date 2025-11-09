import * as path from "path"
import { ensureDir, writeJsonFile } from "./file-utils"
import { Logger } from "./utils"

/**
 * 为 Cursor 设置 MCP 配置文件
 */
export async function setupCursorMcpConfig(
  currentDir: string,
  apiBaseUrl: string,
): Promise<void> {
  Logger.info("Setting up Cursor MCP configuration...")

  const cursorDir = path.join(currentDir, ".cursor")
  const mcpConfigPath = path.join(cursorDir, "mcp.json")

  // 创建 .cursor 目录
  ensureDir(cursorDir)

  // 生成 MCP 配置内容
  const mcpConfig = {
    mcpServers: {
      compoder: {
        command: "compoder",
        args: ["mcp", "server", "--api-base-url", apiBaseUrl],
      },
    },
  }

  // 写入配置文件
  writeJsonFile(mcpConfigPath, mcpConfig)
  Logger.success(`Created ${path.relative(currentDir, mcpConfigPath)}`)
}

/**
 * 为 Claude Code 设置 MCP 配置文件
 */
export async function setupClaudeCodeMcpConfig(
  currentDir: string,
  apiBaseUrl: string,
): Promise<void> {
  Logger.info("Setting up Claude Code MCP configuration...")

  const mcpConfigPath = path.join(currentDir, ".mcp.json")

  // 生成 MCP 配置内容
  const mcpConfig = {
    mcpServers: {
      compoder: {
        command: "compoder",
        args: ["mcp", "server", "--api-base-url", apiBaseUrl],
      },
    },
  }

  // 写入配置文件
  writeJsonFile(mcpConfigPath, mcpConfig)
  Logger.success(`Created ${path.relative(currentDir, mcpConfigPath)}`)
}
