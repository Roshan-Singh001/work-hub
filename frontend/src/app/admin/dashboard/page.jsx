"use client"
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Users,
    UserCheck,
    Building2,
    FolderOpen,
    TrendingUp,
    BarChart3,
    UserPlus,
    FolderPlus,
    CheckCircle,
    CircleAlert,
    CircleX,
    RotateCw,
    Ban,
    MoreHorizontal,
    AlertTriangle,
    MessageSquareWarning,
    ShieldAlert,
    Bell,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Clock,
    Phone,
    User,
    PhoneCall,
    Mail,
    Lock,
    Globe,
    Briefcase,
} from "lucide-react"

export default function AdminDashboard() {
    const { userData, loading } = useAuth();
    const router = useRouter();
    const [overviewStats, setOverviewStats] = useState(null);

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        if (loading) return;
        async function fetchStats() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview/`, {
                    method: "GET",
                    credentials: "include",
                })
                const data = await res.json();
                setOverviewStats(data);
                setRecentUsers(data.recentUsers);
                setRecentProjects(data.recentProjects);
                setPendingRequests(data.pendingRequests);
                console.log("Stats data: ", data);

            } catch (error) {
                console.error("Error fetching stats: ", error);
                toast.error("Failed to load dashboard stats. Please try again later.");
            }
        }
        fetchStats();
    }, [])

    const handleUserAction = (id, action) => {
        setRecentUsers(prev =>
            prev.map(u =>
                u.id === id ? { ...u, status: action === "Active" ? "Active" : "Banned" } : u
            )
        )
    }

    const handleApprove = async (id) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/approve/${id}`, {
                method: "POST",
                credentials: "include",
            })
            toast.success("Request approved successfully");
            setPendingRequests(prev => prev.filter(r => r.id !== id))
        } catch (error) {
            console.error("Error approving request: ", error);
            toast.error("Failed to approve request. Please try again later.");
        }
    }

    const handleReject = async (id) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reject/${id}`, {
                method: "POST",
                credentials: "include",
            })
            toast.success("Request rejected successfully");
            setPendingRequests(prev => prev.filter(r => r.id !== id))
        } catch (error) {
            console.error("Error rejecting request: ", error);
            toast.error("Failed to reject request. Please try again later.");
        }
    }

    console.log("User Data: ", userData);

    return (
        <>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* ── Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>

                            <h1 className="text-3xl font-bold tracking-tight">Welcome, {userData?.name || "Admin"} 👋</h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Here's what's happening on WorkHub today -{" "}
                                <span className="font-medium text-foreground">{new Date().toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </p>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Bell className="h-4 w-4" />
                                Notifications
                                <Badge className="h-4 px-1.5 text-[10px]">24</Badge>
                            </Button>
                        </div> */}
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Users} label="Total Users" value={overviewStats?.totalUsers} sub="" />
                        <StatCard icon={UserCheck} label="Freelancers" value={overviewStats?.totalFreelancer} sub="" />
                        <StatCard icon={Building2} label="Organizations" value={overviewStats?.totalOrgs} sub="" />
                        <StatCard icon={FolderOpen} label="Active Projects" value={overviewStats?.totalProjects} sub="" />
                    </div>

                    {/* ── Quick Actions ── */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                            <CardDescription className="text-xs">Common admin tasks - one click away</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-2">
                                <AddUserDialog />
                                <AddProjectDialog />
                            </div>
                        </CardContent>
                    </Card>



                    {/* ── User & Project Tables ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Recent Users */}
                        {recentUsers && (<Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Recent Users</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Newly registered accounts</CardDescription>
                                    </div>
                                    <Button onClick={() => { router.push("/admin/dashboard/users/all") }} variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                                </div>
                            </CardHeader>

                            {recentUsers.length === 0 ?
                                <CardContent className="h-60 flex items-center justify-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <User className="h-8 w-8" />
                                        <p className="text-sm font-medium">No recent users</p>
                                        <p className="text-xs">New user registrations will appear here.</p>
                                    </div>
                                </CardContent> :

                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="pl-6 text-xs">Name</TableHead>
                                                <TableHead className="text-xs">Role</TableHead>
                                                <TableHead className="text-xs">Status</TableHead>
                                                <TableHead className="pr-6 text-xs">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentUsers.map((u) => (
                                                <TableRow key={u.id}>
                                                    <TableCell className="pl-6">
                                                        <div>
                                                            <p className="text-sm font-medium">{u.first_name + ' ' + u.last_name}</p>
                                                            {u.role == 'ORG_Owner' && <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                                                                {u.organization?.org_name}
                                                            </p>}
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" />{new Date(u.createdAt).toLocaleDateString("en-US", {
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-muted-foreground">{u.role == 'ORG_Owner' ? 'Organization Owner' : u.role}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={(u.status).toUpperCase()} />
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">

                                                                {u.status === 'Pending' && <DropdownMenuItem
                                                                    className="text-xs gap-2"
                                                                    onClick={() => handleUserAction(u.id, "Active")}
                                                                >
                                                                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                                                                </DropdownMenuItem>}

                                                                {u.status === 'Pending' && <DropdownMenuItem
                                                                    className="text-xs gap-2"
                                                                    onClick={() => handleUserAction(u.id, "Rejected")}
                                                                >
                                                                    <CircleX className="h-3.5 w-3.5" /> Reject
                                                                </DropdownMenuItem>}

                                                                {u.status === 'Active' && <DropdownMenuItem
                                                                    className="text-xs gap-2"
                                                                    onClick={() => handleUserAction(u.id, "Suspend")}
                                                                >
                                                                    <CircleAlert className="h-3.5 w-3.5" /> Suspend
                                                                </DropdownMenuItem>}

                                                                {(u.status === 'Active' || u.status === 'Suspend') && <DropdownMenuItem
                                                                    className="text-xs gap-2 text-destructive focus:text-destructive"
                                                                    onClick={() => handleUserAction(u.id, "Banned")}
                                                                >
                                                                    <Ban className="h-3.5 w-3.5" /> Ban
                                                                </DropdownMenuItem>}

                                                                {(u.status === 'Suspend' || u.status === 'Banned') && <DropdownMenuItem
                                                                    className="text-xs gap-2"
                                                                    onClick={() => handleUserAction(u.id, "Active")}
                                                                >
                                                                    <RotateCw className="h-3.5 w-3.5" /> Reactivate
                                                                </DropdownMenuItem>}

                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                            }
                        </Card>)}

                        {/* Recent Projects */}
                        {recentProjects && (<Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Recent Projects</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Latest project postings</CardDescription>
                                    </div>
                                    <Button onClick={() => { router.push("/admin/dashboard/projects/all") }} variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                                </div>
                            </CardHeader>

                            {recentProjects.length === 0 ?
                                <CardContent className="h-60 flex items-center justify-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Briefcase className="h-8 w-8" />
                                        <p className="text-sm font-medium">No recent projects</p>
                                        <p className="text-xs">New project postings will appear here.</p>
                                    </div>
                                </CardContent> :

                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="pl-6 text-xs">Title</TableHead>
                                                <TableHead className="text-xs">Client</TableHead>
                                                <TableHead className="text-xs">Budget</TableHead>
                                                <TableHead className="pr-6 text-xs">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentProjects.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="pl-6">
                                                        <p className="text-sm font-medium max-w-37.5 truncate">{p.title}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-muted-foreground">{p.client}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs font-medium">{p.budget}</span>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <StatusBadge status={p.status} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                            }
                        </Card>)}

                    </div>

                    {/* ── Pending Requests ── */}
                    {pendingRequests && (<Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Pending Requests</CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Freelancer approvals & organization verifications
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">{pendingRequests.length} pending</Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {pendingRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                                    <CheckCircle className="h-8 w-8" />
                                    <p className="text-sm font-medium">All caught up!</p>
                                    <p className="text-xs">No pending requests right now.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 text-xs">Name</TableHead>
                                            <TableHead className="text-xs">Type</TableHead>
                                            <TableHead className="text-xs">Skill / Category</TableHead>
                                            <TableHead className="text-xs">Submitted</TableHead>
                                            <TableHead className="pr-6 text-xs">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.map((r) => (
                                            <TableRow key={r.id}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <TableCell className="pl-6 cursor-pointer">
                                                            <div className="inline-block cursor-pointer hover:text-muted-foreground">
                                                                <p className="text-sm font-medium">
                                                                    {r.role === 'ORG_Owner'
                                                                        ? r.organization.org_name
                                                                        : r.first_name + ' ' + r.last_name}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </DialogTrigger>

                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>User Details</DialogTitle>
                                                            <DialogDescription>View and manage user information.</DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4 py-2">
                                                            <div className="space-y-1.5">
                                                                <h1>{userData?.name}</h1>
                                                                <p className="text-sm text-muted-foreground">{userData?.email}</p>
                                                                <p className="text-sm text-muted-foreground">{userData?.phone}</p>
                                                                <p className="text-sm text-muted-foreground">{userData?.country}</p>

                                                            </div>

                                                        </div>

                                                    </DialogContent>
                                                </Dialog>

                                                <TableCell>
                                                    <Badge
                                                        variant={r.role.includes("Freelancer") ? "outline" : "secondary"}
                                                        className="text-xs whitespace-nowrap"
                                                    >
                                                        {r.role === 'ORG_Owner' ? 'Organization' : r.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground">{r.freelancer?.skills_category ? r.freelancer.skills_category : r.organization.industry}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-2.5 w-2.5" />{new Date(r.createdAt).toLocaleDateString("en-US", {
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-xs gap-1"
                                                            onClick={() => handleApprove(r.id)}
                                                        >
                                                            <CheckCircle className="h-3 w-3" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                                                            onClick={() => handleReject(r.id)}
                                                        >
                                                            <Ban className="h-3 w-3" /> Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>)}

                </div>
            </div>
        </>
    )
}

function StatusBadge({ status }) {
    const variants = {
        Active: "default",
        Completed: "secondary",
        Pending: "outline",
        Banned: "destructive",
        Suspend: "warning",
    }
    return (
        <>
            {status === 'Suspend' ?
                <Badge className={' dark:bg-amber-600 dark:text-white'} variant={"default"}>{status}</Badge> :
                <Badge variant={variants[status] || "outline"}>{status}</Badge>}
        </>
    )
}

function CountrySelect({ value, onChange, invalid }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger aria-invalid={invalid}>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>
    )
}

function StatCard({ icon: Icon, label, value, sub }) {
    return (
        <Card className={'py-4'}>
            <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <div className="p-2 rounded-md bg-muted">
                        <Icon className="h-5 w-5 text-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AddUserDialog() {
    const [userRole, setUserRole] = useState(null);
    const adminSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Enter a valid email address"),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })
    const clientSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        organization: z.string().optional(),
        country: z.string().min(1, "Please select a country"),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number"),
        email: z.email("Enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    })

    const schema = useMemo(() => {
        return userRole === "Client" ? clientSchema : adminSchema
    }, [userRole])

    const { control, register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
    })

    async function onSubmit(data) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add/user/${userRole.toLowerCase()}`, {
                method: "POST",
                body: JSON.stringify({ role: userRole, ...data }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                signal: AbortSignal.timeout(60000),
            })
            const json = await res.json()
            if (!res.ok) {
                toast.error(json.message || "User Creation failed")
            } else {
                toast.success(json.message);
            }
        } catch (err) {
            console.error("User creation error: ", err);
            toast.error("User Creation failed")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account on WorkHub.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Role</Label>
                        <Select defaultValue={userRole || ""} onValueChange={(value) => setUserRole(value)}>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Client">Client</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {userRole === 'Admin' && <>
                        <form onSubmit={handleSubmit(onSubmit)} className="h-fit space-y-4 overflow-auto">
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> Name
                                </FieldLabel>
                                <Input {...register("name")} id="name" type="text" placeholder="Roshan Singh" aria-invalid={!!errors.name} />
                                {errors.name && <FieldError errors={[errors.name]} />}
                            </Field>

                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> Email Address
                                </FieldLabel>
                                <Input {...register("email")} id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
                                {errors.email && <FieldError errors={[errors.email]} />}
                            </Field>

                            <Field data-invalid={!!errors.phone}>
                                <FieldLabel htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <PhoneCall className="w-3 h-3" /> Phone
                                </FieldLabel>
                                <Input {...register("phone")} id="phone" type="tel" placeholder="+1 555 0000" aria-invalid={!!errors.phone} />
                                {errors.phone && <FieldError errors={[errors.phone]} />}
                            </Field>

                            <Field data-invalid={!!errors?.password}>
                                <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <Lock className="w-3 h-3" /> Password
                                </FieldLabel>
                                <Input {...register("password")} id="password" type="password" placeholder="Min. 8 characters" aria-invalid={!!errors.password} />
                                {errors?.password && <FieldError errors={[errors.password]} />}
                            </Field>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? "Creating user…" : <>Create User</>}
                                </Button>
                            </DialogFooter>
                        </form>

                    </>}

                    {userRole === 'Client' && <>
                        <form onSubmit={handleSubmit(onSubmit)} className="h-fit overflow-auto space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Field data-invalid={!!errors.firstName}>
                                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                    <Input {...register("firstName")} id="firstName" placeholder="John" aria-invalid={!!errors.firstName} />
                                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                                </Field>

                                <Field data-invalid={!!errors.lastName}>
                                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                    <Input {...register("lastName")} id="lastName" placeholder="Doe" aria-invalid={!!errors.lastName} />
                                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                                </Field>
                            </div>

                            <Field data-invalid={!!errors.organization}>
                                <FieldLabel htmlFor="organization" className="flex items-center gap-1.5">
                                    <Building2 className="w-3 h-3" /> Organization <span className="text-muted-foreground font-normal">(Optional)</span>
                                </FieldLabel>
                                <Input {...register("organization")} id="organization" placeholder="Your company or org name" />
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="country" className="flex items-center gap-1.5">
                                                <Globe className="w-3 h-3" /> Country
                                            </FieldLabel>
                                            <CountrySelect value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Field data-invalid={!!errors.phone}>
                                    <FieldLabel htmlFor="phone" className="flex items-center gap-1.5">
                                        <Phone className="w-3 h-3" /> Phone
                                    </FieldLabel>
                                    <Input {...register("phone")} id="phone" type="tel" placeholder="+1 555 0000" aria-invalid={!!errors.phone} />
                                    {errors.phone && <FieldError errors={[errors.phone]} />}
                                </Field>
                            </div>

                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> Email Address
                                </FieldLabel>
                                <Input {...register("email")} id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
                                {errors.email && <FieldError errors={[errors.email]} />}
                            </Field>

                            <Field data-invalid={!!errors?.password}>
                                <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                    <Lock className="w-3 h-3" /> Password
                                </FieldLabel>
                                <Input {...register("password")} id="password" type="password" placeholder="Min. 8 characters" aria-invalid={!!errors.password} />
                                {errors?.password && <FieldError errors={[errors.password]} />}
                            </Field>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? "Creating user…" : <>Create User</>}
                                </Button>
                            </DialogFooter>
                        </form>

                    </>}
                </div>

            </DialogContent>
        </Dialog>
    )
}

function AddProjectDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <FolderPlus className="h-4 w-4" /> Add Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>Post a new project listing on WorkHub.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Project Title</Label>
                        <Input placeholder="e.g. React Dashboard Development" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Client Name</Label>
                        <Input placeholder="e.g. TechCorp Ltd." />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Budget</Label>
                        <Input placeholder="e.g. ₹25,000" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Status</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="w-full">Create Project</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}