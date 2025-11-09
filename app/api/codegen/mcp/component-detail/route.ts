import { NextRequest, NextResponse } from "next/server"
import { findCodegenByName } from "@/lib/db/codegen/selectors"
import { CodegenApi } from "../../types"
import { connectToDatabase } from "@/lib/db/mongo"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const codegenName = searchParams.get("codegenName")
    const libraryName = searchParams.get("libraryName")
    const componentNamesParam = searchParams.get("componentNames")

    if (!codegenName) {
      return NextResponse.json(
        { error: "Missing codegenName parameter" },
        { status: 400 },
      )
    }

    if (!libraryName) {
      return NextResponse.json(
        { error: "Missing libraryName parameter" },
        { status: 400 },
      )
    }

    if (!componentNamesParam) {
      return NextResponse.json(
        { error: "Missing componentNames parameter" },
        { status: 400 },
      )
    }

    const componentNames = componentNamesParam
      .split(",")
      .map(name => name.trim())

    // 查找匹配的codegen
    let codegen
    try {
      codegen = await findCodegenByName(codegenName)
    } catch (error) {
      return NextResponse.json(
        { error: `Codegen '${codegenName}' not found` },
        { status: 404 },
      )
    }

    // 查找private-components规则
    const privateComponentsRule = codegen.rules?.find(
      (rule: any) => rule.type === "private-components",
    )

    if (!privateComponentsRule || !privateComponentsRule.docs) {
      return NextResponse.json(
        { error: `No private components found for codegen '${codegenName}'` },
        { status: 404 },
      )
    }

    const docs = privateComponentsRule.docs

    // 检查指定的库是否存在
    if (!docs[libraryName]) {
      return NextResponse.json(
        {
          error: `Library '${libraryName}' not found in codegen '${codegenName}'`,
        },
        { status: 404 },
      )
    }

    const libraryComponents = docs[libraryName]
    const responseComponents: CodegenApi.McpComponentDetailResponse["components"] =
      {}

    // 获取请求的组件详情
    for (const componentName of componentNames) {
      if (libraryComponents[componentName]) {
        responseComponents[componentName] = {
          description: libraryComponents[componentName].description,
          api: libraryComponents[componentName].api,
        }
      } else {
        console.warn(
          `Component '${componentName}' not found in library '${libraryName}'`,
        )
      }
    }

    // 如果没有找到任何组件，返回404
    if (Object.keys(responseComponents).length === 0) {
      return NextResponse.json(
        {
          error: `None of the requested components found in library '${libraryName}'`,
        },
        { status: 404 },
      )
    }

    const response: CodegenApi.McpComponentDetailResponse = {
      libraryName,
      components: responseComponents,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch component details:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
