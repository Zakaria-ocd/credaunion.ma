import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, content, excerpt, cover_image_url, published } = body

  if (!title || !slug) {
    return NextResponse.json({ error: "العنوان والرابط مطلوبان" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      content: content || "",
      excerpt: excerpt || "",
      cover_image_url: cover_image_url || "",
      published_at: published ? new Date().toISOString() : null,
      author_id: session.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
