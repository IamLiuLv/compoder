import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongo"
import { CodegenModel } from "@/lib/db/codegen/schema"
import { validateSession } from "@/lib/auth/middleware"

export async function POST(req: NextRequest) {
  try {
    const authError = await validateSession()
    if (authError) return authError
    await connectToDatabase()
    const body = await req.json()
    if (!body || typeof body !== "object" || !body._id) {
      return NextResponse.json({ error: "Missing _id in body" }, { status: 400 })
    }
    await CodegenModel.findByIdAndDelete(body._id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"