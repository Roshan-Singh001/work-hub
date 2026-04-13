"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    FolderOpen,
    ClipboardList,
    Users,
    Handshake,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertTriangle,
    CalendarClock,
    TrendingUp,
    Briefcase,
    CircleDot,
    CalendarDays,
    ArrowRight,
    Timer,
    Flame,
    Info,
    XCircle,
} from "lucide-react"

export default function OrgAdminDashboard() {
    const { userData, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

    useEffect(() => {
        if (loading || !userData) return;
        async function fetchStats() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/admin/overview/`, {
                    method: "GET",
                    headers: {
                        orgId: userData?.orgId,
                    },
                    credentials: "include",
                });
                const data = await res.json();
                setStats(data);
                setProjectStatuses(data.projectStatuses ?? []);
                setRecentProjects(data.recentProjects ?? []);
                setUpcomingDeadlines(data.upcomingDeadlines ?? []);
            } catch (error) {
                console.error("Error fetching org stats:", error);
                toast.error("Failed to load dashboard. Please try again.");
            }
        }
        fetchStats();
    }, [loading, userData]);

    const orgName = userData?.orgName || "Your Organization";

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, {userData?.name || "Admin"} 👋
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {orgName} &middot;{" "}
                            <span className="font-medium text-foreground">
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Pending Review */}
                {userData?.status === "Pending" && <PendingOrgCard />}

                {userData?.status === "Rejected" && <RejectedOrgCard />}
                {userData?.status === "Active" && <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            icon={FolderOpen}
                            label="Total Projects"
                            value={stats?.totalProjects}
                        />
                        <StatCard
                            icon={ClipboardList}
                            label="Total Tasks"
                            value={stats?.totalTasks}

                        />
                        <StatCard
                            icon={Users}
                            label="Team Members"
                            value={stats?.teamMembers}

                        />
                        <StatCard
                            icon={Handshake}
                            label="Active Clients"
                            value={stats?.activeClients}

                        />
                        <StatCard
                            icon={DollarSign}
                            label="Total Earnings"
                            value={stats?.totalEarnings != null ? `₹${Number(stats.totalEarnings).toLocaleString("en-IN")}` : "₹ 0"}
                            highlight
                        />
                    </div>

                    {/* Project Status Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Status Breakdown */}
                        <Card className="lg:col-span-1">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Project Status</CardTitle>
                                <CardDescription className="text-xs">Breakdown across all projects</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4 space-y-4">
                                <StatusBar
                                    label="Active"
                                    count={stats?.activeProjects ?? 0}
                                    total={stats?.totalProjects ?? 1}
                                    colorClass="bg-blue-500"
                                    icon={<CircleDot className="h-3 w-3 text-blue-500" />}
                                />
                                <StatusBar
                                    label="Completed"
                                    count={stats?.completedProjects ?? 0}
                                    total={stats?.totalProjects ?? 1}
                                    colorClass="bg-green-500"
                                    icon={<CheckCircle2 className="h-3 w-3 text-green-500" />}
                                />
                                <StatusBar
                                    label="Delayed"
                                    count={stats?.delayedProjects ?? 0}
                                    total={stats?.totalProjects ?? 1}
                                    colorClass="bg-red-500"
                                    icon={<AlertTriangle className="h-3 w-3 text-red-500" />}
                                />
                                <StatusBar
                                    label="Draft"
                                    count={stats?.draftProjects ?? 0}
                                    total={stats?.totalProjects ?? 1}
                                    colorClass="bg-muted-foreground"
                                    icon={<Briefcase className="h-3 w-3 text-muted-foreground" />}
                                />
                            </CardContent>
                        </Card>

                        {/* Recent Project Updates */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Recent Project Updates</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Latest activity across your projects</CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-7 gap-1"
                                        onClick={() => router.push("/org/dashboard/projects/all")}
                                    >
                                        View all <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {recentProjects.length === 0 ? (
                                <CardContent className="h-52 flex items-center justify-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Briefcase className="h-8 w-8" />
                                        <p className="text-sm font-medium">No recent projects</p>
                                        <p className="text-xs">Project updates will appear here.</p>
                                    </div>
                                </CardContent>
                            ) : (
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="pl-6 text-xs">Project</TableHead>
                                                <TableHead className="text-xs">Client</TableHead>
                                                <TableHead className="text-xs">Progress</TableHead>
                                                <TableHead className="pr-6 text-xs">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentProjects.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="pl-6">
                                                        <p className="text-sm font-medium max-w-40 truncate">{p.title}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-2.5 w-2.5" />
                                                            {new Date(p.updatedAt).toLocaleDateString("en-US", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-muted-foreground">{p.client}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 min-w-20">
                                                            <Progress value={p.progress ?? 0} className="h-1.5 flex-1" />
                                                            <span className="text-xs text-muted-foreground w-8 shrink-0">{p.progress ?? 0}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <ProjectStatusBadge status={p.status} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            )}
                        </Card>
                    </div>

                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            Tasks &amp; projects due today or this week
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-7 gap-1"
                                    onClick={() => router.push("/org/dashboard/tasks/deadlines")}
                                >
                                    View all <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {upcomingDeadlines.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                                    <CalendarDays className="h-8 w-8" />
                                    <p className="text-sm font-medium">No upcoming deadlines</p>
                                    <p className="text-xs">You're all clear for now.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 text-xs">Item</TableHead>
                                            <TableHead className="text-xs">Type</TableHead>
                                            <TableHead className="text-xs">Assigned To</TableHead>
                                            <TableHead className="text-xs">Due</TableHead>
                                            <TableHead className="pr-6 text-xs">Urgency</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {upcomingDeadlines.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="pl-6">
                                                    <p className="text-sm font-medium max-w-52 truncate">{item.title}</p>
                                                    {item.projectName && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-52">
                                                            {item.projectName}
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {item.type === "task" ? (
                                                            <><ClipboardList className="h-3 w-3 mr-1" /> Task</>
                                                        ) : (
                                                            <><Briefcase className="h-3 w-3 mr-1" /> Project</>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.assignedTo || "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Timer className="h-2.5 w-2.5" />
                                                        {new Date(item.dueDate).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <UrgencyBadge dueDate={item.dueDate} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>}

            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, highlight = false }) {
    return (
        <Card className="py-4">
            <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className={`text-3xl font-bold tracking-tight truncate ${highlight ? "text-green-600 dark:text-green-400" : ""}`}>
                            {value ?? "0"}
                        </p>

                    </div>
                    <div className={`p-2 rounded-md shrink-0 ml-2 ${highlight ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${highlight ? "text-green-600 dark:text-green-400" : "text-foreground"}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBar({ label, count, total, colorClass, icon }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    {icon} {label}
                </span>
                <span className="font-medium tabular-nums">{count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function ProjectStatusBadge({ status }) {
    const s = (status || "").toLowerCase();
    if (s === "active")
        return <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">Active</Badge>;
    if (s === "completed")
        return <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">Completed</Badge>;
    if (s === "delayed")
        return <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0">Delayed</Badge>;
    if (s === "draft")
        return <Badge variant="outline" className="text-xs">Draft</Badge>;
    return <Badge variant="outline" className="text-xs capitalize">{status}</Badge>;
}

function UrgencyBadge({ dueDate }) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
        return (
            <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 gap-1">
                <AlertTriangle className="h-3 w-3" /> Overdue
            </Badge>
        );
    if (diffDays === 0)
        return (
            <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0 gap-1">
                <Flame className="h-3 w-3" /> Due Today
            </Badge>
        );
    if (diffDays <= 3)
        return (
            <Badge className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0 gap-1">
                <TrendingUp className="h-3 w-3" /> {diffDays}d left
            </Badge>
        );
    if (diffDays <= 7)
        return (
            <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 gap-1">
                <CalendarDays className="h-3 w-3" /> This week
            </Badge>
        );
    return (
        <Badge variant="outline" className="text-xs gap-1">
            <CalendarDays className="h-3 w-3" /> {diffDays}d left
        </Badge>
    );
}

function RejectedOrgCard() {
    return (
        <div className="w-full mx-auto mt-10 px-4">
            <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-gray-900 shadow-sm p-6 transition-all">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Application Rejected
                    </h2>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Unfortunately, your organization application has been rejected by the admin.
                    This may be due to incomplete or incorrect information provided during submission.
                </p>

                {/* Warning box */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500 dark:text-red-400" />
                    <p className="text-xs text-red-600 dark:text-red-400">
                        Please review your details carefully before reapplying. Ensure all required
                        information is accurate and up to date.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

                    {/* Status Badge */}
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Rejected
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PendingOrgCard() {
    return (
        <div className="w-full mx-auto mt-10 px-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 transition-all">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Application Pending
                    </h2>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Your organization application is currently under review by the admin team.
                    This process usually takes a short time. You will be notified once a decision
                    has been made.
                </p>

                {/* Info box */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                    <Info className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Please ensure your submitted details are accurate. You may contact support
                        if you have any urgent concerns.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

                    {/* Status Badge */}
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending Review
                    </span>

                    {/* Optional Button */}
                    <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    )
}