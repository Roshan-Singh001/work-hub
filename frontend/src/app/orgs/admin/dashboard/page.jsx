"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"

import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
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
} from "lucide-react"

// ── Table Data ────────────────────────────────────────────────────────────────

const initialUsers = [
    { id: 1, name: "Arjun Mehta", role: "Freelancer", status: "Pending", joined: "2h ago" },
    { id: 2, name: "Priya Sharma", role: "Client", status: "Active", joined: "4h ago" },
    { id: 3, name: "Rahul Verma", role: "Freelancer", status: "Pending", joined: "6h ago" },
    { id: 4, name: "Neha Kapoor", role: "Organization", status: "Suspend", joined: "1d ago" },
    { id: 5, name: "Vikram Nair", role: "Freelancer", status: "Banned", joined: "1d ago" },
    { id: 6, name: "Sneha Joshi", role: "Client", status: "Active", joined: "2d ago" },
]

const recentProjects = [
    { id: 1, title: "E-commerce Website Redesign", client: "TechCorp Ltd.", status: "Active", budget: "₹45,000" },
    { id: 2, title: "Mobile App UI/UX", client: "StartupXYZ", status: "Completed", budget: "₹28,000" },
    { id: 3, title: "Backend API Development", client: "DataSys Inc.", status: "Active", budget: "₹62,000" },
    { id: 4, title: "SEO & Content Writing", client: "GrowthMedia", status: "Pending", budget: "₹12,000" },
    { id: 5, title: "React Dashboard", client: "FinTech Hub", status: "Active", budget: "₹38,000" },
]

const initialRequests = [
    { id: 1, name: "Karan Singh", type: "Freelancer Approval", submitted: "3h ago", skill: "Full Stack Dev" },
    { id: 2, name: "Meera Nambiar", type: "Freelancer Approval", submitted: "5h ago", skill: "UI/UX Design" },
    { id: 3, name: "Apex Solutions", type: "Organization Verification", submitted: "8h ago", skill: "IT Agency" },
    { id: 4, name: "DevCraft Studio", type: "Organization Verification", submitted: "1d ago", skill: "Design Studio" },
]

const initialAlerts = [
    { id: 1, icon: AlertTriangle, title: "14 Pending Approvals", desc: "Freelancer profiles awaiting review" },
    { id: 2, icon: ShieldAlert, title: "3 Reported Users", desc: "Users flagged for policy violations" },
    { id: 3, icon: MessageSquareWarning, title: "7 Open Complaints", desc: "Client disputes pending resolution" },
]

export default function OrgAdminDashboard() {
    const { userData, loading } = useAuth();
    const [userRows, setUserRows] = useState(initialUsers)
    const [requestRows, setRequestRows] = useState(initialRequests)
    const [alertList, setAlertList] = useState(initialAlerts)
    const [overviewStats, setOverviewStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState(null);
    const [recentProjects, setRecentProjects] = useState(null);
    const [pendingRequests, setPendingRequests] = useState(null);

    useEffect(() => {
        if (loading) return;
        async function fetchStats() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview/`,{
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
        setUserRows(prev =>
            prev.map(u =>
                u.id === id ? { ...u, status: action === "approve" ? "Active" : "Banned" } : u
            )
        )
    }

    const handleRequest = (id) =>
        setRequestRows(prev => prev.filter(r => r.id !== id))

    const dismissAlert = (id) =>
        setAlertList(prev => prev.filter(a => a.id !== id))



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
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Bell className="h-4 w-4" />
                                Notifications
                                <Badge className="h-4 px-1.5 text-[10px]">24</Badge>
                            </Button>
                        </div>
                    </div>

                    {/* ── Alerts ── */}
                    {alertList.length > 0 && (
                        <div className="space-y-2">
                            {alertList.map(({ id, icon: Icon, title, desc }) => (
                                <Alert key={id} className="flex items-center justify-between pr-3">
                                    <div className="flex items-start gap-3">
                                        <Icon className="h-4 w-4 mt-0.5 text-foreground" />
                                        <div>
                                            <AlertTitle className="text-sm font-semibold leading-none mb-1">{title}</AlertTitle>
                                            <AlertDescription className="text-xs">{desc}</AlertDescription>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs h-7 shrink-0" onClick={() => dismissAlert(id)}>
                                        Dismiss
                                    </Button>
                                </Alert>
                            ))}
                        </div>
                    )}

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
                                <Button size="sm" variant="outline" className="gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Approve Freelancers
                                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">14</Badge>
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2 text-destructive hover:text-destructive">
                                    <Ban className="h-4 w-4" />
                                    Ban User
                                </Button>
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
                                    <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                                </div>
                            </CardHeader>
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
                                                        <p className="text-sm font-medium">{u.first_name +' '+ u.last_name}</p>
                                                        {u.role=='ORG_Owner' && <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                                                            {u.organization?.org_name}
                                                        </p>}
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-2.5 w-2.5" />{new Date(u.createdAt).toLocaleDateString( "en-US", {
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',})}
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

                                                            {u.status === 'pending' && <DropdownMenuItem
                                                                className="text-xs gap-2"
                                                                onClick={() => handleUserAction(u.id, "approve")}
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5" /> Approve
                                                            </DropdownMenuItem>}

                                                            {u.status === 'pending' && <DropdownMenuItem
                                                                className="text-xs gap-2"
                                                                onClick={() => handleUserAction(u.id, "reject")}
                                                            >
                                                                <CircleX className="h-3.5 w-3.5" /> Reject
                                                            </DropdownMenuItem>}

                                                            {u.status === 'active' && <DropdownMenuItem
                                                                className="text-xs gap-2"
                                                                onClick={() => handleUserAction(u.id, "suspend")}
                                                            >
                                                                <CircleAlert className="h-3.5 w-3.5" /> Suspend
                                                            </DropdownMenuItem>}

                                                            {(u.status === 'active' || u.status === 'suspend')  && <DropdownMenuItem
                                                                className="text-xs gap-2 text-destructive focus:text-destructive"
                                                                onClick={() => handleUserAction(u.id, "ban")}
                                                            >
                                                                <Ban className="h-3.5 w-3.5" /> Ban
                                                            </DropdownMenuItem>}

                                                            {(u.status === 'suspend' || u.status === 'banned')  && <DropdownMenuItem
                                                                className="text-xs gap-2"
                                                                onClick={() => handleUserAction(u.id, "active")}
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
                        </Card>)}

                        {/* Recent Projects */}
                        {recentProjects && (<Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Recent Projects</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Latest project postings</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                                </div>
                            </CardHeader>
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
                                                <TableCell className="pl-6">
                                                    <p className="text-sm font-medium">{r.role === 'ORG_Owner' ? r.organization.org_name : r.first_name + ' '+ r.last_name}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={r.role.includes("Freelancer") ? "outline" : "secondary"}
                                                        className="text-xs whitespace-nowrap"
                                                    >
                                                        {r.role === 'ORG_Owner' ? 'Organization': r.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground">{r.freelancer?.skills_category ? r.freelancer.skills_category : r.organization.industry}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-2.5 w-2.5" />{new Date(r.createdAt).toLocaleDateString( "en-US", {
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',})}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-xs gap-1"
                                                            onClick={() => handleRequest(r.id)}
                                                        >
                                                            <CheckCircle className="h-3 w-3" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                                                            onClick={() => handleRequest(r.id)}
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
            {status==='Suspend' ? 
                <Badge className={' dark:bg-amber-600 dark:text-white'} variant={"default"}>{status}</Badge> : 
                <Badge variant={variants[status] || "outline"}>{status}</Badge>}
        </>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>First Name</Label>
                            <Input placeholder="Arjun" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Last Name</Label>
                            <Input placeholder="Mehta" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input type="email" placeholder="arjun@example.com" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Role</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="freelancer">Freelancer</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="organization">Organization</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="w-full">Create User</Button>
                </DialogFooter>
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
                                <SelectItem value="active">Active</SelectItem>
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