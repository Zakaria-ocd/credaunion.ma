"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onDelete?: (url: string) => void
}

export function ImageUpload({ value, onChange, onDelete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت")
      return
    }

    try {
      setUploading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "فشل رفع الصورة")
      }

      const data = await res.json()
      const publicUrl = data.url

      onChange(publicUrl)
      setPreview(publicUrl)
      toast.success("تم رفع الصورة بنجاح")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error("فشل رفع الصورة: " + error.message)
    } finally {
      setUploading(false)
      setProgress(100)
    }
  }

  const removeImage = () => {
    if (onDelete && value) {
      onDelete(value)
    }
    onChange("")
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4 w-full" dir="rtl">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">صورة الغلاف</Label>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeImage}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="ml-1 h-3 w-3" />
            حذف الصورة
          </Button>
        )}
      </div>
      
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-secondary/20">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-gold/30 transition-all gap-4"
        >
          <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">اضغط لرفع صورة</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (بحد أقصى 5MB)</p>
          </div>
        </button>
      )}

      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              جاري الرفع...
            </span>
          </div>
          <Progress value={45} className="h-1" />
        </div>
      )}
    </div>
  )
}
