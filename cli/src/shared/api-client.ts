import axios, { AxiosInstance } from "axios"
import {
  McpComponentListResponse,
  McpComponentDetailResponse,
  CliError,
} from "./types"

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // 添加响应拦截器处理错误
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // 服务器返回错误状态码
          const message = error.response.data?.error || error.message
          throw new CliError(
            `API Error: ${message}`,
            error.response.status.toString(),
          )
        } else if (error.request) {
          // 请求发送但没有收到响应
          throw new CliError("Network Error: Unable to connect to API server")
        } else {
          // 其他错误
          throw new CliError(`Request Error: ${error.message}`)
        }
      },
    )
  }

  /**
   * 获取组件列表
   */
  async getComponentList(
    codegenName: string,
  ): Promise<McpComponentListResponse> {
    const response = await this.client.get("/api/codegen/mcp/component-list", {
      params: { codegenName },
    })
    return response.data
  }

  /**
   * 获取组件详情
   */
  async getComponentDetail(
    codegenName: string,
    libraryName: string,
    componentNames: string[],
  ): Promise<McpComponentDetailResponse> {
    const response = await this.client.get(
      "/api/codegen/mcp/component-detail",
      {
        params: {
          codegenName,
          libraryName,
          componentNames: componentNames.join(","),
        },
      },
    )
    return response.data
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get("/api/health")
      return true
    } catch {
      return false
    }
  }
}
