#!/usr/bin/env node

import { Command } from "commander"
import { mcpCommand } from "./commands/mcp"
import { Logger } from "./shared/utils"

const program = new Command()

program
  .name("compoder")
  .description("Compoder CLI - AI-Powered Component Code Generator")
  .version("0.0.1")

// 注册MCP子命令
program.addCommand(mcpCommand)

// 未来可以添加更多子命令
// import { generateCommand } from './commands/generate'
// import { deployCommand } from './commands/deploy'
// import { configCommand } from './commands/config'
// program.addCommand(generateCommand)
// program.addCommand(deployCommand)
// program.addCommand(configCommand)

// 全局错误处理
process.on("uncaughtException", error => {
  Logger.error(`Uncaught Exception: ${error.message}`)
  process.exit(1)
})

process.on("unhandledRejection", reason => {
  Logger.error(`Unhandled Rejection: ${reason}`)
  process.exit(1)
})

// 解析命令行参数
program.parse()

// 如果没有提供任何命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
