import { Codegen } from "@/lib/db/codegen/types"

declare namespace CodegenApi {
  // codegen list request
  export interface ListRequest {
    page: number
    pageSize: number
    name?: string
    fullStack?: "React" | "Vue"
  }
  // codegen list response
  export interface ListResponse {
    data: Pick<Codegen, "_id" | "title" | "description" | "fullStack">[]
    total: number
  }
  // codegen detail request
  export interface DetailRequest {
    id: string
  }
  // codegen detail response
  export interface DetailResponse {
    data: Pick<
      Codegen,
      | "_id"
      | "title"
      | "description"
      | "fullStack"
      | "guides"
      | "codeRendererUrl"
    >
  }

  // MCP component list request
  export interface McpComponentListRequest {
    codegenName: string
  }
  // MCP component list response
  export interface McpComponentListResponse {
    markdown: string
    components: {
      [libraryName: string]: {
        [componentName: string]: {
          description: string
        }
      }
    }
  }

  // MCP component detail request
  export interface McpComponentDetailRequest {
    codegenName: string
    libraryName: string
    componentNames: string[]
  }
  // MCP component detail response
  export interface McpComponentDetailResponse {
    libraryName: string
    components: {
      [componentName: string]: {
        description: string
        api: string
      }
    }
  }
}
