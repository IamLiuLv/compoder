export interface CodegenRule {
  type:
    | "public-components"
    | "styles"
    | "private-components"
    | "file-structure"
    | "attention-rules"
  description: string
  prompt?: string // only used when type is "styles" | "file-structure" | "special-attention"
  dataSet?: string[] // only used when type is "public-components"
  docs?: {
    // only used when type is "private-components"
    [libraryName: string]: {
      [componentName: string]: {
        description: string
        api: string
      }
    }
  }
}

export interface Codegen {
  _id?: string  // MongoDB 文档ID，编辑时必需
  title: string
  description: string
  fullStack: "React" | "Vue"
  guides: string[]
  model: string
  codeRendererUrl: string
  rules: CodegenRule[]
}
