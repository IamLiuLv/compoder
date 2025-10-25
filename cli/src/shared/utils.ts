import chalk from "chalk"

/**
 * 日志工具类
 */
export class Logger {
  static info(message: string) {
    console.log(chalk.blue("ℹ"), message)
  }

  static success(message: string) {
    console.log(chalk.green("✓"), message)
  }

  static warn(message: string) {
    console.log(chalk.yellow("⚠"), message)
  }

  static error(message: string) {
    console.log(chalk.red("✗"), message)
  }

  static debug(message: string) {
    if (process.env.DEBUG) {
      console.log(chalk.gray("🐛"), message)
    }
  }
}

/**
 * 验证codegen名称格式
 */
export function validateCodegenName(name: string): boolean {
  if (!name || typeof name !== "string") {
    return false
  }

  // 允许字母、数字、空格、连字符和下划线
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/
  return validPattern.test(name) && name.trim().length > 0
}

/**
 * 验证组件名称格式
 */
export function validateComponentName(name: string): boolean {
  if (!name || typeof name !== "string") {
    return false
  }

  // 允许字母、数字、连字符和下划线
  const validPattern = /^[a-zA-Z0-9\-_]+$/
  return validPattern.test(name) && name.trim().length > 0
}

/**
 * 解析组件名称列表
 */
export function parseComponentNames(input: string): string[] {
  return input
    .split(",")
    .map(name => name.trim())
    .filter(name => name.length > 0)
}

/**
 * 格式化错误消息
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

/**
 * 检查端口是否可用
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const net = require("net")
    const server = net.createServer()

    server.listen(port, () => {
      server.once("close", () => {
        resolve(true)
      })
      server.close()
    })

    server.on("error", () => {
      resolve(false)
    })
  })
}
