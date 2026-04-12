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
    CheckCircle,
    CreditCard,
    Clock,
    ArrowRight,
    House,
    MessageSquare,
    CalendarDays,
    Flag,
    AlertCircle,
    Inbox,
    Milestone,
    CircleDot,
} from "lucide-react"

export default function ClientDashboard() {
    const { userData, loading } = useAuth();
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState(null);
    const [activeProjects, setActiveProjects] = useState([]);
    const [upcomingMilestones, setUpcomingMilestones] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => {
        if (loading) return;
        async function fetchDashboard() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/dashboard/`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setDashboardData(data);
                setActiveProjects(data.activeProjects || []);
                setUpcomingMilestones(data.upcomingMilestones || []);
                setRecentMessages(data.recentMessages || []);
            } catch (error) {
                console.error("Error fetching dashboard: ", error);
                toast.error("Failed to load dashboard. Please try again later.");
            }
        }
        fetchDashboard();
    }, [loading]);

    const totalUnread = recentMessages.reduce((sum, m) => sum + (m.unread || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, {userData?.name || "there"} 👋
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Here's an overview of your projects today —{" "}
                            <span className="font-medium text-foreground">
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2 w-fit"
                        onClick={() => router.push("/client/projects/new")}
                    >
                        <FolderOpen className="h-4 w-4" /> Post a Project
                    </Button>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={FolderOpen}
                        label="Active Projects"
                        value={dashboardData?.totalActiveProjects ?? "0"}
                        sub="Currently in progress"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Completed Projects"
                        value={dashboardData?.totalCompletedProjects ?? "0"}
                        sub="Successfully delivered"
                    />
                    <StatCard
                        icon={CreditCard}
                        label="Pending Payments"
                        value={dashboardData?.pendingPayments ?? "0"}
                        sub="Awaiting your action"
                        highlight
                    />
                </div>

                {/* ── Active Projects Snapshot ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Active Projects Snapshot</CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    Progress and status of your ongoing work
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => router.push("/client/projects")}
                            >
                                View all
                            </Button>
                        </div>
                    </CardHeader>

                    {activeProjects.length === 0 ? (
                        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <FolderOpen className="h-8 w-8" />
                                <p className="text-sm font-medium">No active projects</p>
                                <p className="text-xs">Post a project to get started.</p>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
                            {activeProjects.slice(0, 5).map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onView={() => router.push(`/client/projects/${project.id}`)}
                                />
                            ))}
                        </CardContent>
                    )}
                </Card>

                {/* ── Bottom Section: Milestones + Messages ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Upcoming Deadlines / Milestones */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Milestones & delivery dates
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => router.push("/client/milestones")}
                                >
                                    View all
                                </Button>
                            </div>
                        </CardHeader>

                        {upcomingMilestones.length === 0 ? (
                            <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <CalendarDays className="h-8 w-8" />
                                    <p className="text-sm font-medium">No upcoming deadlines</p>
                                    <p className="text-xs">All milestones are up to date.</p>
                                </div>
                            </CardContent>
                        ) : (
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 text-xs">Milestone</TableHead>
                                            <TableHead className="text-xs">Project</TableHead>
                                            <TableHead className="pr-6 text-xs">Due Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {upcomingMilestones.map((m) => {
                                            const dueDate = new Date(m.dueDate);
                                            const daysLeft = Math.ceil(
                                                (dueDate - new Date()) / (1000 * 60 * 60 * 24)
                                            );
                                            const isUrgent = daysLeft <= 3;
                                            return (
                                                <TableRow key={m.id}>
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center gap-1.5">
                                                            {isUrgent ? (
                                                                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                                                            ) : (
                                                                <Flag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                            )}
                                                            <p className="text-sm font-medium truncate max-w-32">{m.title}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-muted-foreground truncate max-w-28 block">{m.projectName}</span>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-medium flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" />
                                                                {dueDate.toLocaleDateString("en-US", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                })}
                                                            </span>
                                                            <span className={`text-[10px] ${isUrgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                                                                {daysLeft <= 0 ? "Overdue" : `${daysLeft}d left`}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        )}
                    </Card>

                    {/* Recent Messages */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Recent Messages</CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Latest conversations with freelancers
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    {totalUnread > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                            {totalUnread} unread
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() => router.push("/client/messages")}
                                    >
                                        View all
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {recentMessages.length === 0 ? (
                            <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <Inbox className="h-8 w-8" />
                                    <p className="text-sm font-medium">No messages yet</p>
                                    <p className="text-xs">Conversations will appear here.</p>
                                </div>
                            </CardContent>
                        ) : (
                            <CardContent className="p-0 divide-y">
                                {recentMessages.slice(0, 3).map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex items-start gap-3 px-6 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors"
                                        onClick={() => router.push(`/client/messages/${msg.id}`)}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-semibold">
                                            {(msg.senderName || "?")[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium truncate">{msg.senderName}</p>
                                                <span className="text-[10px] text-muted-foreground shrink-0">
                                                    {new Date(msg.sentAt).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{msg.projectName}</p>
                                        </div>
                                        {msg.unread > 0 && (
                                            <Badge className="h-4 px-1.5 text-[10px] shrink-0 self-center">{msg.unread}</Badge>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        )}
                    </Card>
                </div>

            </div>
        </div>
    );
}

/* ── Sub-components ── */

function StatCard({ icon: Icon, label, value, sub, highlight }) {
    return (
        <Card className="py-4">
            <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <div className={`p-2 rounded-md ${highlight ? "bg-destructive/10" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${highlight ? "text-destructive" : "text-foreground"}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ProjectCard({ project, onView }) {
    const statusConfig = {
        "In Progress": { variant: "default", dot: "bg-blue-500" },
        "Review": { variant: "secondary", dot: "bg-amber-500" },
        "Completed": { variant: "outline", dot: "bg-green-500" },
    };
    const config = statusConfig[project.status] || { variant: "outline", dot: "bg-muted-foreground" };
    const deadline = new Date(project.deadline);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3 px-4 space-y-3">

                {/* Title + Status */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight line-clamp-2">{project.title}</p>
                    <Badge variant={config.variant} className="text-[10px] shrink-0 flex items-center gap-1">
                        <CircleDot className="h-2.5 w-2.5" />
                        {project.status}
                    </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{project.progress ?? 0}%</span>
                    </div>
                    <Progress value={project.progress ?? 0} className="h-1.5" />
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                        {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {daysLeft >= 0 && (
                        <span className={`ml-auto font-medium ${daysLeft <= 3 ? "text-destructive" : "text-muted-foreground"}`}>
                            {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                        </span>
                    )}
                    {daysLeft < 0 && (
                        <span className="ml-auto font-medium text-destructive">Overdue</span>
                    )}
                </div>

            </CardContent>

            <Separator />

            <CardContent className="py-2.5 px-4">
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-xs gap-1 justify-between"
                    onClick={onView}
                >
                    View Project <ArrowRight className="h-3.5 w-3.5" />
                </Button>
            </CardContent>
        </Card>
    );
}