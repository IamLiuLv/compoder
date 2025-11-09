import { NextRequest, NextResponse } from "next/server"
import { findCodegenByName } from "@/lib/db/codegen/selectors"
import { CodegenApi } from "../../types"
import { connectToDatabase } from "@/lib/db/mongo"

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

    // 构建组件数据结构
    const components: CodegenApi.McpComponentListResponse["components"] = {}
    const docs = privateComponentsRule.docs

    for (const libraryName in docs) {
      if (docs.hasOwnProperty(libraryName)) {
        components[libraryName] = {}
        const libraryComponents = docs[libraryName]

        for (const componentName in libraryComponents) {
          if (libraryComponents.hasOwnProperty(componentName)) {
            components[libraryName][componentName] = {
              description: libraryComponents[componentName].description,
            }
          }
        }
      }
    }

    // 生成Markdown格式
    let markdown = `# Components for ${codegenName}\n\n`

    for (const libraryName in components) {
      markdown += `## ${libraryName}\n\n`
      const libraryComponents = components[libraryName]

      for (const componentName in libraryComponents) {
        const component = libraryComponents[componentName]
        markdown += `- **${componentName}**: ${component.description}\n`
      }

      markdown += "\n"
    }

    const response: CodegenApi.McpComponentListResponse = {
      markdown: markdown.trim(),
      components,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch component list:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
