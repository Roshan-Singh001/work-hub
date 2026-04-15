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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CheckSquare,
    Square,
    FolderOpen,
    DollarSign,
    Clock,
    AlertCircle,
    ArrowRight,
    MoreHorizontal,
    Briefcase,
    ListTodo,
    CalendarClock,
    CircleDot,
    CheckCircle2,
    Flame,
} from "lucide-react"

export default function FreelancerDashboard() {
    const { userData, loading } = useAuth();
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [urgentTasks, setUrgentTasks] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);

    useEffect(() => {
        if (loading) return;
        async function fetchDashboard() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/freelancer/dashboard/overview`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setDashboardData(data);
                setMyTasks(data.myTasks || []);
                setUrgentTasks(data.urgentTasks || []);
                setActiveProjects(data.activeProjects || []);
            } catch (error) {
                console.error("Error fetching dashboard: ", error);
                toast.error("Failed to load dashboard. Please try again later.");
            }
        }
        fetchDashboard();
    }, [loading]);

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
                            Here's your work overview for today —{" "}
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

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Square} label="Pending Tasks" value={dashboardData?.pendingTasks ?? "0"}/>
                    <StatCard icon={CheckSquare} label="Completed Tasks" value={dashboardData?.completedTasks ?? "0"}/>
                    <StatCard icon={FolderOpen} label="Active Projects" value={dashboardData?.activeProjects ?? "0"} />
                    <StatCard icon={DollarSign} label="Total Earnings" value={dashboardData?.TotalEarnings ?? "0"} highlight />
                </div>

                {/* ── My Tasks (MAIN AREA) ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    My Tasks
                                </CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    All your assigned tasks across projects
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => router.push("/freelancer/tasks")}
                            >
                                View all
                            </Button>
                        </div>
                    </CardHeader>

                    {myTasks.length === 0 ? (
                        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <ListTodo className="h-8 w-8" />
                                <p className="text-sm font-medium">No tasks assigned</p>
                                <p className="text-xs">Tasks from your active projects will appear here.</p>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 text-xs">Task</TableHead>
                                        <TableHead className="text-xs">Project</TableHead>
                                        <TableHead className="text-xs">Deadline</TableHead>
                                        <TableHead className="text-xs">Priority</TableHead>
                                        <TableHead className="text-xs">Status</TableHead>
                                        <TableHead className="pr-6 text-xs"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myTasks.map((task) => {
                                        const deadline = new Date(task.deadline);
                                        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                                        return (
                                            <TableRow key={task.id}>
                                                <TableCell className="pl-6">
                                                    <p className="text-sm font-medium max-w-48 truncate">{task.name}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-muted-foreground max-w-32 truncate block">{task.projectName}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-medium flex items-center gap-1">
                                                            <Clock className="h-2.5 w-2.5" />
                                                            {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                                                        </span>
                                                        <span className={`text-[10px] ${daysLeft < 0 ? "text-destructive font-medium" : daysLeft <= 2 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                                            {daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <PriorityBadge priority={task.priority} />
                                                </TableCell>
                                                <TableCell>
                                                    <TaskStatusBadge status={task.status} />
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-xs gap-2"
                                                                onClick={() => router.push(`/freelancer/tasks/${task.id}`)}
                                                            >
                                                                <ArrowRight className="h-3.5 w-3.5" /> View Task
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs gap-2">
                                                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    )}
                </Card>

                {/* ── Bottom Section: Urgent Work + Active Projects ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Deadlines / Urgent Work */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Deadlines & Urgent Work</CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Due today and overdue tasks
                                    </CardDescription>
                                </div>
                                {urgentTasks.length > 0 && (
                                    <Badge variant="destructive" className="text-[10px]">
                                        {urgentTasks.length} urgent
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        {urgentTasks.length === 0 ? (
                            <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className="h-8 w-8" />
                                    <p className="text-sm font-medium">All clear!</p>
                                    <p className="text-xs">No overdue or due-today tasks.</p>
                                </div>
                            </CardContent>
                        ) : (
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 text-xs">Task</TableHead>
                                            <TableHead className="text-xs">Project</TableHead>
                                            <TableHead className="pr-6 text-xs">Due</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {urgentTasks.map((task) => {
                                            const deadline = new Date(task.deadline);
                                            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                                            const isOverdue = daysLeft < 0;
                                            return (
                                                <TableRow key={task.id}>
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center gap-1.5">
                                                            <AlertCircle className={`h-3.5 w-3.5 shrink-0 ${isOverdue ? "text-destructive" : "text-amber-500"}`} />
                                                            <p className="text-sm font-medium truncate max-w-36">{task.name}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-muted-foreground truncate max-w-28 block">{task.projectName}</span>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-medium flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" />
                                                                {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                                                            </span>
                                                            <span className={`text-[10px] font-semibold ${isOverdue ? "text-destructive" : "text-amber-600"}`}>
                                                                {isOverdue ? `${Math.abs(daysLeft)}d overdue` : "Due today"}
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

                    {/* Active Projects Snapshot */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Active Projects</CardTitle>
                                    <CardDescription className="text-xs mt-0.5">
                                        Your current project assignments
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => router.push("/freelancer/projects")}
                                >
                                    View all
                                </Button>
                            </div>
                        </CardHeader>

                        {activeProjects.length === 0 ? (
                            <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <Briefcase className="h-8 w-8" />
                                    <p className="text-sm font-medium">No active projects</p>
                                    <p className="text-xs">Projects you're assigned to will appear here.</p>
                                </div>
                            </CardContent>
                        ) : (
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 text-xs">Project</TableHead>
                                            <TableHead className="text-xs">Progress</TableHead>
                                            <TableHead className="text-xs">Status</TableHead>
                                            <TableHead className="pr-6 text-xs">Deadline</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeProjects.map((project) => {
                                            const deadline = new Date(project.deadline);
                                            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                                            return (
                                                <TableRow
                                                    key={project.id}
                                                    className="cursor-pointer"
                                                    onClick={() => router.push(`/freelancer/projects/${project.id}`)}
                                                >
                                                    <TableCell className="pl-6">
                                                        <p className="text-sm font-medium max-w-36 truncate">{project.title}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 min-w-20">
                                                            <Progress value={project.progress ?? 0} className="h-1.5 flex-1" />
                                                            <span className="text-[10px] font-medium text-muted-foreground w-7 shrink-0">{project.progress ?? 0}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <ProjectStatusBadge status={project.status} />
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-medium">
                                                                {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                                                            </span>
                                                            <span className={`text-[10px] ${daysLeft < 0 ? "text-destructive font-medium" : daysLeft <= 3 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                                                {daysLeft < 0 ? "Overdue" : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
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

                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, highlight }) {
    return (
        <Card className="py-4">
            <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                    </div>
                    <div className={`p-2 rounded-md ${highlight ? "bg-emerald-500/10" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function PriorityBadge({ priority }) {
    const config = {
        High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${config[priority] || "bg-muted text-muted-foreground"}`}>
            {priority}
        </span>
    );
}

function TaskStatusBadge({ status }) {
    const config = {
        "Todo": { variant: "outline" },
        "In Progress": { variant: "default" },
        "In Review": { variant: "secondary" },
        "Done": { variant: "outline" },
    };
    return (
        <Badge variant={config[status]?.variant || "outline"} className="text-[10px] flex items-center gap-1 w-fit">
            <CircleDot className="h-2.5 w-2.5" />
            {status}
        </Badge>
    );
}

function ProjectStatusBadge({ status }) {
    const config = {
        "In Progress": { variant: "default" },
        "Review": { variant: "secondary" },
        "Completed": { variant: "outline" },
        "On Hold": { variant: "outline" },
    };
    return (
        <Badge variant={config[status]?.variant || "outline"} className="text-[10px] whitespace-nowrap">
            {status}
        </Badge>
    );
}