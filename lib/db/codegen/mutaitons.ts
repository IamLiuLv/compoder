import { CodegenModel } from "./schema"
import { Codegen } from "./types"

export async function createCodegen(codegen: Codegen | Codegen[]) {
  await CodegenModel.create(codegen)
}

export async function upsertCodegen(codegen: Codegen) {
  if (codegen._id) {
    const result = await CodegenModel.findByIdAndUpdate(
      codegen._id,
      codegen,
      { new: true },
    )
    return result
  } else {
    const result = await CodegenModel.findOneAndUpdate(
      { title: codegen.title },
      codegen,
      { upsert: true, new: true },
    )
    return result
  }
}

export async function upsertCodegens(codegens: Codegen[]) {
  const results = await Promise.all(
    codegens.map(async codegen => {
      return await upsertCodegen(codegen)
    }),
  )
  return results
}
