"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { LucideUpload, LucideCheck, LucideAlertCircle } from "lucide-react"

interface FileUploaderProps {
  icon?: React.ReactNode
  title: string
  description: string
  acceptedFileTypes: string
  compact?: boolean
  onFileAnalyzed?: (analysis: any) => void
}

export function FileUploader({
  icon,
  title,
  description,
  acceptedFileTypes,
  compact = false,
  onFileAnalyzed,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Filter files by accepted types
    const acceptedTypesArray = acceptedFileTypes.split(",")
    const filteredFiles = newFiles.filter((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      return acceptedTypesArray.some((type) => type.includes(fileExtension) || type === ".*" || type === "*")
    })

    if (filteredFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: `Some files were rejected. Accepted types: ${acceptedFileTypes}`,
        variant: "destructive",
      })
    }

    setFiles((prev) => [...prev, ...filteredFiles])
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const increment = Math.random() * 10
            const newProgress = Math.min(prev + increment, 90) // Cap at 90% until complete
            return newProgress
          })
        }, 300)

        // Upload the file
        const response = await fetch("/api/analyze-document", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const result = await response.json()
        setUploadProgress(100)
        setUploadStatus("success")

        // Notify parent component about the analysis
        if (onFileAnalyzed) {
          onFileAnalyzed(result)
        }

        // Show success toast
        toast({
          title: "File analyzed successfully",
          description: `${file.name} has been processed and analyzed.`,
        })
      }

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([])
        setUploadProgress(0)
        setUploadStatus("idle")
        setIsUploading(false)
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setIsUploading(false)

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          compact && "p-4",
          isUploading && "opacity-50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {icon}
        <h3 className={cn("font-medium", compact && "text-sm mt-2")}>{title}</h3>
        <p className={cn("text-sm text-muted-foreground text-center", compact && "text-xs")}>{description}</p>

        <div className="mt-4">
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            multiple
            disabled={isUploading}
          />
          <Button size={compact ? "sm" : "default"} asChild disabled={isUploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <LucideUpload className="mr-2 h-4 w-4" />
              Select Files
            </label>
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB • {file.type || "Unknown type"}
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                    aria-label="Remove file"
                  >
                    &times;
                  </Button>
                )}
              </div>
            ))}
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-xs text-center text-muted-foreground">
                Uploading and analyzing... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <LucideCheck className="h-4 w-4" />
              <p className="text-sm">Analysis complete!</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <LucideAlertCircle className="h-4 w-4" />
              <p className="text-sm">Upload failed. Please try again.</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={uploadFiles} disabled={isUploading || files.length === 0} className="w-full md:w-auto">
              {isUploading ? "Processing..." : "Analyze Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
