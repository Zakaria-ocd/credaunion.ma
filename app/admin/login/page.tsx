"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "حدث خطأ")
        setLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("حدث خطأ في الاتصال")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold/[0.02] rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl shadow-gold/[0.05]">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <ShieldCheck className="h-8 w-8 text-gold" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              قم بتسجيل الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 h-12 rounded-xl"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="bg-gold text-primary-foreground hover:bg-gold-light transition-all duration-500 hover:shadow-xl hover:shadow-gold/25 w-full h-12 rounded-xl text-base font-bold"
            >
              {loading ? (
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="ml-2 h-5 w-5" />
              )}
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
