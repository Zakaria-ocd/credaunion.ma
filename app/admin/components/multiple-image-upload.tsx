"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MultipleImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  onDelete?: (url: string) => void
  maxImages?: number
}

export function MultipleImageUpload({ value = [], onChange, onDelete, maxImages = 5 }: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit the number of files we process so we don't exceed maxImages
    const spacesLeft = maxImages - value.length
    if (spacesLeft <= 0) {
      alert(`عذراً، يمكنك رفع ${maxImages} صور كحد أقصى.`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, spacesLeft)

    try {
      setUploading(true)
      setProgress(10)

      const newlyUploadedUrls: string[] = []

      // Upload files sequentially to easily track progress
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]

        // Validate size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`حجم الصورة ${file.name} يتجاوز 5 ميجابايت`)
          continue
        }

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          alert(`فشل رفع ${file.name}: ${data.error}`)
          continue
        }

        newlyUploadedUrls.push(data.url)
        setProgress(10 + Math.floor(((i + 1) / filesToUpload.length) * 90))
      }

      if (newlyUploadedUrls.length > 0) {
        onChange([...value, ...newlyUploadedUrls])
      }

    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء الرفع")
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async (indexToRemove: number) => {
    const urlToRemove = value[indexToRemove]
    
    // Opt-in deletion callback for cleanup
    if (onDelete && urlToRemove) {
      await onDelete(urlToRemove)
    }

    const newValues = [...value]
    newValues.splice(indexToRemove, 1)
    onChange(newValues)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          معرض الصور 
          <span className="text-muted-foreground mr-2 font-normal">
            ({value.length} / {maxImages})
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Render existing images */}
        {value.map((url, idx) => (
          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
            <Image 
              src={url} 
              alt={`Gallery image ${idx + 1}`} 
              fill 
              className="object-cover transition-transform group-hover:scale-105" 
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(idx)}
                className="h-8 shadow-lg"
              >
                <X className="h-4 w-4 ml-1" />
                حذف
              </Button>
            </div>
          </div>
        ))}

        {/* Upload Button visible if spaces available */}
        {value.length < maxImages && (
          <div 
            className="aspect-video relative rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 hover:border-gold/50 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 text-gold animate-spin" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">جاري الرفع...</span>
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">إضافة صور</p>
                  <p className="text-xs text-muted-foreground mt-1 px-2 mx-auto max-w-[120px]">يمكنك تحديد صور متعددة</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
