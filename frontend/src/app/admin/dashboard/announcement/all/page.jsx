"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Megaphone, Loader2, User } from "lucide-react"

export default function AdminAnnouncementsPage() {
  const { userData } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/announcement/all`, {
          credentials: "include",
        })
        const data = await res.json()
        setAnnouncements(data || [])
      } catch (err) {
        setAnnouncements([])
      }
      setLoading(false)
    }
    fetchAnnouncements()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">All Announcements</CardTitle>
              <CardDescription className="text-xs mt-1">
                View and manage all platform announcements.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
              <Megaphone className="h-8 w-8" />
              <p className="text-sm font-medium">No announcements yet</p>
              <p className="text-xs">Announcements will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 text-xs">Title</TableHead>
                    <TableHead className="text-xs">Posted By</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((a) => (
                    <Dialog key={a.id}>
                      <DialogTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted transition">
                          <TableCell className="pl-6 font-medium max-w-xs truncate">{a.title}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-xs">
                              <User className="h-3 w-3" />
                              {a.admin?.name || "Admin"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {new Date(a.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">View</Badge>
                          </TableCell>
                        </TableRow>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-primary" />
                            {a.title}
                          </DialogTitle>
                          <DialogDescription>
                            Posted by <span className="font-medium">{a.admin?.name || "Admin"}</span> on{" "}
                            <span>
                              {new Date(a.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <Separator />
                        <div className="py-4 whitespace-pre-line text-base text-foreground">
                          {a.content}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}