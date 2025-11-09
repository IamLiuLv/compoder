import { NextRequest, NextResponse } from "next/server"
import { CodegenModel } from "@/lib/db/codegen/schema"
import { connectToDatabase } from "@/lib/db/mongo"

interface CodegenListResponse {
  markdown: string
  codegens: {
    [codegenName: string]: {
      title: string
      description: string
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // 从数据库获取所有codegen
    const codegenData = await CodegenModel.find({})
      .select("title description")
      .lean()

    // 构建codegen数据结构
    const codegens: CodegenListResponse["codegens"] = {}

    for (const codegen of codegenData) {
      if (codegen.title && codegen.description) {
        // 直接使用title作为key，保持与数据库查找逻辑一致
        // 在MCP工具中，用户需要使用完整的title作为codegenName
        codegens[codegen.title] = {
          title: codegen.title,
          description: codegen.description,
        }
      }
    }

    // 生成Markdown格式
    let markdown = "# Available Codegens\n\n"
    markdown +=
      "Here are all the available code generators. Use the **Name** field as the `codegenName` parameter in other tools:\n\n"

    for (const [codegenName, info] of Object.entries(codegens)) {
      markdown += `## ${info.title}\n\n`
      markdown += `**Name:** \`${codegenName}\`\n\n`
      markdown += `**Description:** ${info.description}\n\n`
      markdown += "---\n\n"
    }

    const response: CodegenListResponse = {
      markdown: markdown.trim(),
      codegens,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Failed to fetch codegen list:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
