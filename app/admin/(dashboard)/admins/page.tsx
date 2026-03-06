"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Loader2, Users, ShieldCheck } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  created_at: string
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const fetchAdmins = async () => {
    const res = await fetch("/api/admin/admins")
    if (res.ok) {
      const data = await res.json()
      setAdmins(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreate = async () => {
    setSaving(true)
    setError("")

    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "حدث خطأ")
      setSaving(false)
      return
    }

    setDialogOpen(false)
    setForm({ email: "", password: "" })
    setError("")
    fetchAdmins()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "حدث خطأ")
      return
    }

    fetchAdmins()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المشرفين</h1>
          <p className="text-muted-foreground mt-1">إدارة حسابات المشرفين</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-primary-foreground hover:bg-gold-light">
              <Plus className="ml-2 h-4 w-4" />
              مشرف جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مشرف جديد</DialogTitle>
              <DialogDescription>
                أضف حساب مشرف جديد للوحة التحكم
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">البريد الإلكتروني</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  dir="ltr"
                  className="bg-secondary/80 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">كلمة المرور</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-secondary/80 border-border/50"
                />
              </div>
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive text-center">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">إلغاء</Button>
              </DialogClose>
              <Button
                onClick={handleCreate}
                disabled={saving || !form.email || !form.password}
                className="bg-gold text-primary-foreground hover:bg-gold-light"
              >
                {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                إضافة المشرف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-right">المشرف</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                        <ShieldCheck className="h-4 w-4 text-gold" />
                      </div>
                      <span className="font-medium" dir="ltr">{admin.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(admin.created_at).toLocaleDateString("ar")}
                  </TableCell>
                  <TableCell>
                    {admin.email === "admin_2026@gmail.com" ? (
                      <Badge className="bg-primary text-primary-foreground border-primary/20">
                        مسؤول النظام
                      </Badge>
                    ) : (
                      <Badge className="bg-gold/10 text-gold border-gold/20">
                        مشرف
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          disabled={admins.length <= 1 || admin.email === "admin_2026@gmail.com"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المشرف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(admin.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
