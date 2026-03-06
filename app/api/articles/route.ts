import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "6")
  const offset = (page - 1) * limit

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch articles
  const { data: articles, error, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    articles,
    count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  })
}
