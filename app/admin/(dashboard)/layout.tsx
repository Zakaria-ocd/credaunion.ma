import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/utils/supabase/admin"
import { AdminSidebar } from "../components/admin-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }

  // Fetch unread messages count for sidebar badge
  const supabase = createAdminClient()
  const { count: unreadCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <AdminSidebar email={session.email} unreadCount={unreadCount || 0} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
