// 规则类型定义
export interface Rule {
  type: "public-components" | "styles" | "private-components" | "file-structure" | "attention-rules"
  description: string
  prompt?: string
  dataSet?: string[]
  docs?: Record<string, Record<string, { description: string; api: string }>>
}

// Codegen类型
export interface Codegen {
  _id?: string
  title: string
  description: string
  fullStack: "React" | "Vue"
  guides: string[]
  model: string
  codeRendererUrl: string
  rules: Rule[]
}

// CodegenListItem类型（列表项，与API返回的数据结构保持一致）
export interface CodegenListItem {
  _id?: string  // API可能返回undefined，需要匹配API类型
  title: string
  description: string
  fullStack: "React" | "Vue"
  guides?: string[]
  rules?: Rule[]
}