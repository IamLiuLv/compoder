import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongo"
import { upsertCodegen } from "@/lib/db/codegen/mutaitons"
import { validateSession } from "@/lib/auth/middleware"

export async function POST(req: NextRequest) {
  try {
    const authError = await validateSession()
    if (authError) return authError
    await connectToDatabase()
    const body = await req.json()

    // 验证请求体和_id
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "无效的请求体" }, { status: 400 })
    }

    if (!body._id) {
      return NextResponse.json({ error: "缺少必要的_id字段" }, { status: 400 })
    }

    // 确保_id是有效的MongoDB ObjectId格式
    if (!/^[0-9a-fA-F]{24}$/.test(body._id)) {
      return NextResponse.json({ error: "无效的_id格式" }, { status: 400 })
    }

    const result = await upsertCodegen(body)

    if (!result) {
      return NextResponse.json({ error: "更新失败，未找到对应ID的记录" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Codegen更新成功"
    })
  } catch (error) {
    console.error("编辑Codegen失败:", error)
    return NextResponse.json({
      error: (error as Error).message || "服务器内部错误",
      message: "Codegen更新失败"
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"