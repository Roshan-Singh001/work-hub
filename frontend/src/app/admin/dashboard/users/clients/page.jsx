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
import { Loader2, User, Mail, Phone, Building2, Star } from "lucide-react"

export default function AdminClientsPage() {
    const { userData } = useAuth()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchClients() {
            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/clients`, {
                    credentials: "include",
                })
                const data = await res.json()
                console.log("Fetched clients: ", data)
                setClients(data || [])
            } catch (err) {
                setClients([])
            }
            setLoading(false)
        }
        fetchClients()
    }, [])

    return (
        <div className="min-h-screen bg-background ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Clients</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        View and manage all registered clients on the platform.
                    </p>
                </div>
            </div>


            <Card className="mt-8 w-full shadow-lg">
                <CardContent className="">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                            <User className="h-8 w-8" />
                            <p className="text-sm font-medium">No clients found</p>
                            <p className="text-xs">Clients will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 text-xs">Name</TableHead>
                                        <TableHead className="text-xs">Email</TableHead>
                                        <TableHead className="text-xs">Country</TableHead>
                                        <TableHead className="text-xs">Rating</TableHead>
                                        <TableHead className="text-xs">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((c) => (
                                        <Dialog key={c?.id}>
                                            <DialogTrigger asChild>
                                                <TableRow className="cursor-pointer hover:bg-muted transition">
                                                    <TableCell className="pl-6 font-medium max-w-xs truncate">
                                                        {c?.first_name + " " + c?.last_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <Mail className="h-3 w-3" />
                                                            {c?.email}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs">{c?.client?.country}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <Star className="h-3 w-3 text-yellow-500" />
                                                            {c?.client?.rating?.toFixed(2) || "0.00"}
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
                                                        <User className="h-5 w-5 text-primary" />
                                                        {c?.first_name + " " + c?.last_name}
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Registered on{" "}
                                                        <span>
                                                            {new Date(c?.createdAt).toLocaleDateString("en-US", {
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
                                                <div className="py-4 space-y-3 text-base text-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        <span>{c?.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{c?.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4" />
                                                        <span>{c?.client?.org_name || <span className="text-muted-foreground">N/A</span>}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Country:</span>
                                                        <span>{c?.client?.country}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Rating:</span>
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                        <span>{c?.client?.rating?.toFixed(2) || "0.00"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Projects:</span>
                                                        <span>{c?.client?.clientProjects?.length || 0}</span>
                                                    </div>
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