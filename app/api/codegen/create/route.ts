import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongo"
import { createCodegen } from "@/lib/db/codegen/mutaitons"
import { validateSession } from "@/lib/auth/middleware"

export async function POST(req: NextRequest) {
  try {
    const authError = await validateSession()
    if (authError) return authError
    await connectToDatabase()
    const body = await req.json()
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }
    await createCodegen(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"