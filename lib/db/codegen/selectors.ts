import { CodegenModel } from "./schema"
import { CodegenApi } from "@/app/api/codegen/types"
import { Codegen } from "./types"

export async function findCodegens(params: CodegenApi.ListRequest) {
  const { page, pageSize, name, fullStack } = params

  // Build query conditions
  const query: Record<string, unknown> = {}

  if (name) {
    // Use regex for fuzzy title search
    query.title = { $regex: name, $options: "i" }
  }

  if (fullStack) {
    query.fullStack = fullStack
  }

  // Execute query
  const skip = (page - 1) * pageSize

  const [data, total] = await Promise.all([
    CodegenModel.find(query)
      .select("   title description fullStack")
      .skip(skip)
      .limit(pageSize)
      .lean(),
    CodegenModel.countDocuments(query),
  ])

  return {
    data,
    total,
  }
}

export async function findCodegenById(id: string) {
  const codegen = await CodegenModel.findById(id)
    .select("_id title description fullStack guides codeRendererUrl rules model")
    .lean<
      Pick<
        Codegen,
        | "title"
        | "description"
        | "fullStack"
        | "guides"
        | "codeRendererUrl"
        | "rules"
        | "model"
      > & {
        _id: string
      }
    >()

  if (!codegen) {
    throw new Error("Codegen not found")
  }

  return codegen
}

export async function getCodeRendererUrl(codegenId: string) {
  const codegen = await CodegenModel.findById(codegenId)
  return codegen?.codeRendererUrl
}
