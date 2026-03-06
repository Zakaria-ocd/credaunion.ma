import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `articles/${fileName}`

    // Convert File to Buffer for Supabase upload if version requires it, 
    // but usually File works in standard environments.
    // In some Node versions/Supabase-js versions, you might need:
    // const buffer = Buffer.from(await file.arrayBuffer())
    
    const { data, error } = await supabase.storage
      .from("article-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from("article-images")
      .getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
