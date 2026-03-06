import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.email !== "admin_2026@gmail.com") {
    return NextResponse.json(
      { error: "غير مصرح لك بحذف مشرفين" },
      { status: 403 }
    )
  }

  const { id } = await params

  const supabase = createAdminClient()

  // Find the admin being deleted to check its email
  const { data: adminToDelete } = await supabase
    .from("admin_users")
    .select("email")
    .eq("id", id)
    .single()

  if (adminToDelete?.email === "admin_2026@gmail.com") {
    return NextResponse.json(
      { error: "لا يمكن حذف المسؤول الأساسي للنظام" },
      { status: 403 }
    )
  }

  // Check total admin count - prevent deleting the last admin
  const { count } = await supabase
    .from("admin_users")
    .select("*", { count: "exact", head: true })

  if (count !== null && count <= 1) {
    return NextResponse.json(
      { error: "لا يمكن حذف المشرف الأخير" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only the root admin can update other admins
  if (session.email !== "admin_2026@gmail.com") {
    return NextResponse.json(
      { error: "غير مصرح لك بتعديل بيانات المشرفين" },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await request.json()
  const { email, password } = body

  if (!email) {
    return NextResponse.json(
      { error: "البريد الإلكتروني مطلوب" },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Find the admin being edited to prevent modifying the root admin's email if they are not the root admin themselves
  // (Though the above check ensures only root admin is here, we shouldn't let root admin change their own identity here 
  // without careful session handling, but for now we'll allow updating others).
  const { data: adminToEdit } = await supabase
    .from("admin_users")
    .select("email")
    .eq("id", id)
    .single()

  if (adminToEdit?.email === "admin_2026@gmail.com") {
    return NextResponse.json(
      { error: "لا يمكن تعديل بيانات المسؤول الأساسي من هذه الواجهة" },
      { status: 403 }
    )
  }

  const updates: any = { email }

  if (password && password.length > 0) {
    // Generate new hash if password is provided
    const crypto = await import("crypto")
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
    updates.password_hash = `${salt}:${hash}`
  }

  const { data, error } = await supabase
    .from("admin_users")
    .update(updates)
    .eq("id", id)
    .select("id, email, created_at")
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مسجل بالفعل" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, admin: data })
}
