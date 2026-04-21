"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Megaphone } from "lucide-react"

const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

export default function AdminAnnouncementCreatePage() {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementSchema),
  })

  async function onSubmit(data) {
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/announcement/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          adminId: userData?.id,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.message || "Failed to create announcement")
      } else {
        toast.success("Announcement created!")
        reset()
        router.push("/admin/dashboard/announcement/all")
      }
    } catch (err) {
      toast.error("Failed to create announcement")
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background ">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Create Announcement</CardTitle>
              <CardDescription className="text-xs mt-1">
                Share important updates with all users. Announcements will be visible to everyone on the platform.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title" className="flex items-center gap-1.5">
                <Label>Title</Label>
              </FieldLabel>
              <Input
                id="title"
                placeholder="Announcement title"
                {...register("title")}
                aria-invalid={!!errors.title}
                maxLength={100}
              />
              {errors.title && <FieldError errors={[errors.title]} />}
            </Field>

            <Field data-invalid={!!errors.content}>
              <FieldLabel htmlFor="content" className="flex items-center gap-1.5">
                <Label>Content</Label>
              </FieldLabel>
              <Textarea
                id="content"
                placeholder="Write your announcement here..."
                rows={6}
                {...register("content")}
                aria-invalid={!!errors.content}
                maxLength={1000}
              />
              {errors.content && <FieldError errors={[errors.content]} />}
            </Field>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || loading}
                className="gap-2"
              >
                {submitting && <Loader2 className="animate-spin h-4 w-4" />}
                Post Announcement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}