"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface AdminSidebarProps {
  email: string
  unreadCount: number
}

const navItems = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "المقالات",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "المشرفين",
    href: "/admin/admins",
    icon: Users,
  },
  {
    label: "الرسائل",
    href: "/admin/messages",
    icon: MessageSquare,
  },
]

export function AdminSidebar({ email, unreadCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-l border-border/50 bg-card/50 backdrop-blur-sm flex flex-col transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 h-16">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-foreground truncate">لوحة التحكم</h2>
            <p className="text-xs text-muted-foreground truncate">إدارة الموقع</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mr-auto flex h-7 w-7 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 text-muted-foreground transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <Separator className="bg-border/50" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-gold")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/admin/messages" && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 min-w-5 flex items-center justify-center rounded-full text-[10px] px-1.5"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && item.href === "/admin/messages" && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center rounded-full text-[9px] px-1"
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-border/50" />

      {/* User / Logout */}
      <div className="p-3 space-y-2">
        {!collapsed && (
          <div className="rounded-xl bg-secondary/50 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">المشرف</p>
            <p className="text-sm font-medium text-foreground truncate">{email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="mr-2">{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>}
        </Button>
      </div>
    </aside>
  )
}
