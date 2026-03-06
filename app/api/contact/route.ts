import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "الاسم والبريد الإلكتروني والرسالة مطلوبة" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject: subject || "",
        message,
      })

    if (error) {
      console.error("Contact form error:", error)
      return NextResponse.json(
        { error: "حدث خطأ أثناء إرسال الرسالة" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
