"use client"

import { useState, useEffect } from "react"
import { Article } from "@/lib/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react"
import { ImageUpload } from "../../components/image-upload"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface ArticleForm {
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url: string
  published: boolean
}

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_image_url: "",
  published: false,
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ArticleForm>(emptyForm)

  const fetchArticles = async () => {
    const res = await fetch("/api/admin/articles")
    if (res.ok) {
      const data = await res.json()
      setArticles(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: editingId ? prev.slug : generateSlug(value),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const url = editingId
      ? `/api/admin/articles/${editingId}`
      : "/api/admin/articles"
    const method = editingId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      // If we're editing and the image changed, we should ideally delete the old one
      // but that's already handled by the user clicking 'remove' or it can be a separate cleanup job
      setDialogOpen(false)
      setEditingId(null)
      setForm(emptyForm)
      fetchArticles()
      toast.success(editingId ? "تم تحديث المقال" : "تم إنشاء المقال")
    } else {
      const data = await res.json()
      toast.error(data.error || "فشل حفظ المقال")
    }
    setSaving(false)
  }

  const handleImageDelete = async (url: string) => {
    if (!url || !url.includes("article-images")) return
    
    try {
      const supabase = createClient()
      const urlParts = url.split("article-images/")
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from("article-images").remove([filePath])
      }
    } catch (e) {
      console.error("Failed to delete image from storage:", e)
    }
  }

  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    setForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      cover_image_url: article.cover_image_url,
      published: article.published_at !== null,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" })
    fetchArticles()
  }

  const togglePublished = async (article: Article) => {
    await fetch(`/api/admin/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        cover_image_url: article.cover_image_url,
        published: article.published_at === null,
      }),
    })
    fetchArticles()
  }

  const openCreateDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المقالات</h1>
          <p className="text-muted-foreground mt-1">إدارة مقالات الموقع</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="bg-gold text-primary-foreground hover:bg-gold-light"
            >
              <Plus className="ml-2 h-4 w-4" />
              مقال جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingId ? "تعديل المقال" : "مقال جديد"}</DialogTitle>
              <DialogDescription>
                {editingId ? "قم بتعديل بيانات المقال" : "أضف مقال جديد للموقع"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="عنوان المقال"
                  className="bg-secondary/80 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">الرابط (Slug)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="article-slug"
                  dir="ltr"
                  className="bg-secondary/80 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">المقتطف</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="وصف مختصر للمقال"
                  rows={2}
                  className="bg-secondary/80 border-border/50 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="محتوى المقال..."
                  rows={8}
                  className="bg-secondary/80 border-border/50 resize-none"
                />
              </div>
              <div className="space-y-2">
                <ImageUpload 
                  value={form.cover_image_url} 
                  onChange={(url) => setForm({ ...form, cover_image_url: url })}
                  onDelete={handleImageDelete}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                />
                <Label htmlFor="published">نشر المقال</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">إلغاء</Button>
              </DialogClose>
              <Button
                onClick={handleSave}
                disabled={saving || !form.title || !form.slug}
                className="bg-gold text-primary-foreground hover:bg-gold-light"
              >
                {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {editingId ? "حفظ التعديلات" : "إنشاء المقال"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileTextIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">لا توجد مقالات بعد</p>
          <p className="text-sm">ابدأ بإضافة أول مقال</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الرابط</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id} className="border-border/50">
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {article.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate" dir="ltr">
                    {article.slug}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => togglePublished(article)} className="cursor-pointer">
                      {article.published_at ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                          <Eye className="ml-1 h-3 w-3" />
                          منشور
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="hover:bg-secondary">
                          <EyeOff className="ml-1 h-3 w-3" />
                          مسودة
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(article.created_at).toLocaleDateString("ar")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(article)}
                        className="h-8 w-8 hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف المقال</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(article.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}
