import { createAdminClient } from "@/utils/supabase/admin"
import { FileText, Users, MessageSquare, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const [
    { count: articlesCount },
    { count: publishedCount },
    { count: adminsCount },
    { count: messagesCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).not("published_at", "is", null),
    supabase.from("admin_users").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
  ])

  const stats = [
    {
      title: "إجمالي المقالات",
      value: articlesCount || 0,
      description: `${publishedCount || 0} منشورة`,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      title: "المشرفين",
      value: adminsCount || 0,
      description: "مشرف نشط",
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      title: "الرسائل",
      value: messagesCount || 0,
      description: `${unreadCount || 0} غير مقروءة`,
      icon: MessageSquare,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      title: "المقالات المنشورة",
      value: publishedCount || 0,
      description: "مقال منشور",
      icon: Eye,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">نظرة عامة على الموقع</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border/50 bg-card/50 transition-all duration-300 hover:border-border/80 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
