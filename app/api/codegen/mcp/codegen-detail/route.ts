import { NextRequest, NextResponse } from "next/server"
import { findCodegenByName } from "@/lib/db/codegen/selectors"
import { connectToDatabase } from "@/lib/db/mongo"

interface CodegenDetailResponse {
  title: string
  description: string
  fullStack: string
  guides: string[]
  codeRendererUrl: string
  rules: Array<{
    type: string
    description: string
    prompt?: string
    dataSet?: string[]
    docs?: Record<string, any>
  }>
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const codegenName = searchParams.get("codegenName")

    if (!codegenName) {
      return NextResponse.json(
        { error: "Missing codegenName parameter" },
        { status: 400 },
      )
    }

    const codegen = await findCodegenByName(codegenName)

    const response: CodegenDetailResponse = {
      title: codegen.title,
      description: codegen.description,
      fullStack: codegen.fullStack,
      guides: codegen.guides,
      codeRendererUrl: codegen.codeRendererUrl,
      rules: codegen.rules,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch codegen detail:", error)
    return NextResponse.json(
      { error: "Codegen not found or internal server error" },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"

