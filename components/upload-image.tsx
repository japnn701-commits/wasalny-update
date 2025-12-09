"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface UploadImageProps {
  onUpload: (file: File) => Promise<string>
  onRemove?: () => void
  currentUrl?: string
  label?: string
  bucket: string
  maxSize?: number // in MB
  accept?: string
}

export function UploadImage({
  onUpload,
  onRemove,
  currentUrl,
  label = "رفع صورة",
  bucket,
  maxSize = 5,
  accept = "image/*",
}: UploadImageProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const url = await onUpload(file)
      setPreview(url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.")
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Card>
        <CardContent className="p-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 left-2"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                لا توجد صورة مرفوعة
              </p>
            </div>
          )}
          <div className="mt-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id={`upload-${bucket}`}
            />
            <Label htmlFor={`upload-${bucket}`}>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload className="ml-2 w-4 h-4" />
                  {uploading ? "جاري الرفع..." : preview ? "تغيير الصورة" : "رفع صورة"}
                </span>
              </Button>
            </Label>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              الحد الأقصى: {maxSize} ميجابايت
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

