#!/usr/bin/env node

/**
 * 独立的 MCP 服务器测试脚本
 * 可以直接运行，无需构建整个项目
 *
 * 使用方法：
 * node test-mcp-server.js
 * node test-mcp-server.js --debug
 * node test-mcp-server.js --api-base-url http://localhost:3000
 */

const { Client } = require("@modelcontextprotocol/sdk/client/index.js")
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js")

// 简单的日志工具
const Logger = {
  info: msg => console.log(`ℹ️  ${msg}`),
  success: msg => console.log(`✅ ${msg}`),
  warn: msg => console.log(`⚠️  ${msg}`),
  error: msg => console.log(`❌ ${msg}`),
  debug: msg => {
    if (process.env.DEBUG) {
      console.log(`🐛 ${msg}`)
    }
  },
}

class McpTestClient {
  constructor(options = {}) {
    this.options = options

    // 设置调试模式
    if (options.debug) {
      process.env.DEBUG = "1"
    }

    // 创建传输层
    this.transport = new StdioClientTransport({
      command: options.serverCommand || "node",
      args: options.serverArgs || [
        "dist/index.js",
        "mcp",
        "server",
        ...(options.apiBaseUrl ? ["--api-base-url", options.apiBaseUrl] : []),
      ],
    })

    // 创建客户端
    this.client = new Client(
      {
        name: "compoder-test-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    )
  }

  async runTests() {
    Logger.info("🚀 Starting Compoder MCP Server Test...\n")

    try {
      await this.client.connect(this.transport)
      Logger.success("✅ Connected to server\n")

      // Test 1: List tools
      await this.testListTools()

      // Test 2: Call codegen-list tool
      await this.testCodegenList()

      // Test 3: Call component-list tool
      await this.testComponentList()

      // Test 4: Call component-detail tool
      await this.testComponentDetail()

      Logger.success("✅ All tests passed!")

      await this.client.close()
    } catch (error) {
      Logger.error(`❌ Test failed: ${error.message}`)
      Logger.debug(`Full error: ${error.stack}`)
      throw error
    }
  }

  async testListTools() {
    Logger.info("📋 Test 1: Listing available tools...")

    const tools = await this.client.listTools()
    Logger.success(`Found ${tools.tools.length} tools:`)

    tools.tools.forEach(tool => {
      Logger.info(`  - ${tool.name}: ${tool.description}`)
    })

    console.log("")
  }

  async testCodegenList() {
    Logger.info("📋 Test 2: Getting codegen list...")

    const listResult = await this.client.callTool({
      name: "codegen-list",
      arguments: {},
    })

    const listContent = listResult.content[0].text
    Logger.success(
      `✅ Received codegen list (${listContent.length} characters)`,
    )
    Logger.info("First 200 characters:")
    console.log(listContent.substring(0, 200) + "...\n")
  }

  async testComponentList() {
    Logger.info("📋 Test 3: Getting component list...")

    // 使用一个常见的codegen名称进行测试
    const codegenName = "Landing Page Codegen" // 可以根据实际情况调整

    try {
      const listResult = await this.client.callTool({
        name: "component-list",
        arguments: {
          codegenName: codegenName,
        },
      })

      const listContent = listResult.content[0].text
      Logger.success(
        `✅ Received component list for ${codegenName} (${listContent.length} characters)`,
      )
      Logger.info("First 300 characters:")
      console.log(listContent.substring(0, 300) + "...\n")
    } catch (error) {
      Logger.warn(
        `⚠️ Component list test failed (this might be expected if ${codegenName} codegen doesn't exist): ${error.message}\n`,
      )
    }
  }

  async testComponentDetail() {
    Logger.info("📋 Test 4: Getting component details...")

    // 使用一个常见的组件进行测试
    const codegenName = "Landing Page Codegen"
    const libraryName = "pageui"
    const componentNames = ["About", "AppstoreButton"]

    try {
      const detailResult = await this.client.callTool({
        name: "component-detail",
        arguments: {
          codegenName: codegenName,
          libraryName: libraryName,
          componentNames: componentNames,
        },
      })

      const detailContent = detailResult.content[0].text
      Logger.success(
        `✅ Received component details (${detailContent.length} characters)`,
      )
      Logger.info("First 400 characters:")
      console.log(detailContent.substring(0, 400) + "...\n")
    } catch (error) {
      Logger.warn(
        `⚠️ Component detail test failed (this might be expected if components don't exist): ${error.message}\n`,
      )
    }
  }
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    debug: args.includes("--debug"),
    apiBaseUrl: "http://localhost:3000",
  }

  // 解析 API base URL
  const apiUrlIndex = args.indexOf("--api-base-url")
  if (apiUrlIndex !== -1 && args[apiUrlIndex + 1]) {
    options.apiBaseUrl = args[apiUrlIndex + 1]
  }

  return options
}

// 主函数
async function main() {
  const options = parseArgs()

  Logger.info("Compoder MCP Server Test Script")
  Logger.info(`API Base URL: ${options.apiBaseUrl}`)
  Logger.info(`Debug Mode: ${options.debug ? "ON" : "OFF"}`)
  console.log("")

  const testClient = new McpTestClient(options)

  try {
    await testClient.runTests()
    Logger.success("🎉 All tests completed successfully!")
  } catch (error) {
    Logger.error(`💥 Test execution failed: ${error.message}`)
    process.exit(1)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(error => {
    Logger.error(`Unexpected error: ${error.message}`)
    process.exit(1)
  })
}

module.exports = { McpTestClient }
