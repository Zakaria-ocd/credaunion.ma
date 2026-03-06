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
