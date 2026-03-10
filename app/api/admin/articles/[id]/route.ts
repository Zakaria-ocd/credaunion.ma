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
  const { title, slug, content, excerpt, cover_image_url, images, published, category } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      content: content || "",
      excerpt: excerpt || "",
      cover_image_url: cover_image_url || "",
      images: images || [],
      published_at: published ? new Date().toISOString() : null,
      category: category || null,
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

  // 1. Fetch the article to get the cover_image_url and images array
  const { data: article } = await supabase
    .from("articles")
    .select("cover_image_url, images")
    .eq("id", id)
    .single()

  // 2. Delete the images from storage if they exist
  const filesToDelete: string[] = []
  
  // Add cover image if it exists
  if (article?.cover_image_url && article.cover_image_url.includes("article-images")) {
    const urlParts = article.cover_image_url.split("article-images/")
    if (urlParts.length > 1) {
      filesToDelete.push(urlParts[1])
    }
  }

  // Add gallery images if they exist
  if (article?.images && Array.isArray(article.images) && article.images.length > 0) {
    article.images.forEach((imgUrl: string) => {
      if (imgUrl && imgUrl.includes("article-images")) {
        const urlParts = imgUrl.split("article-images/")
        if (urlParts.length > 1) {
          filesToDelete.push(urlParts[1])
        }
      }
    })
  }

  if (filesToDelete.length > 0) {
    try {
      await supabase.storage.from("article-images").remove(filesToDelete)
    } catch (e) {
      console.error("Failed to delete images from storage:", e)
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
