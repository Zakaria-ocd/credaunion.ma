import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, slug, content, excerpt, cover_image_url, published } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      content: content || "",
      excerpt: excerpt || "",
      cover_image_url: cover_image_url || "",
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // 1. Fetch the article to get the cover_image_url
  const { data: article } = await supabase
    .from("articles")
    .select("cover_image_url")
    .eq("id", id)
    .single()

  // 2. Delete the image from storage if it exists and is a Supabase Storage URL
  if (article?.cover_image_url && article.cover_image_url.includes("article-images")) {
    try {
      // Extract the path from the URL
      // Example: https://.../storage/v1/object/public/article-images/articles/filename.jpg
      const urlParts = article.cover_image_url.split("article-images/")
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from("article-images").remove([filePath])
      }
    } catch (e) {
      console.error("Failed to delete image from storage:", e)
    }
  }

  // 3. Delete the article record
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
