import { CliConfig } from "../shared/types"

export const defaultConfig: CliConfig = {
  apiBaseUrl: process.env.COMPODER_API_URL || "http://localhost:3000",
  defaultPort: 3001,
  defaultHost: "localhost",
}

/**
 * 获取配置，支持环境变量覆盖
 */
export function getConfig(): CliConfig {
  return {
    apiBaseUrl: process.env.COMPODER_API_URL || defaultConfig.apiBaseUrl,
    defaultPort: parseInt(
      process.env.COMPODER_MCP_PORT || defaultConfig.defaultPort.toString(),
    ),
    defaultHost: process.env.COMPODER_MCP_HOST || defaultConfig.defaultHost,
  }
}
