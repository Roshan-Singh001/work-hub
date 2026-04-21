"use client"
import { useState, useEffect, use } from "react"
import {
    ArrowLeft, MoreHorizontal, CalendarDays, Users, Briefcase, CheckCircle2,
    AlertTriangle, Clock, Plus, X, ChevronDown, MessageSquare, Paperclip,
    DollarSign, ExternalLink, Edit2, Trash2, Globe, Timer, TrendingUp,
    SquareKanban, Filter, Tag, Flag, Layers, Building2, User, Star,
    FileText, Image as ImageIcon, File, Link2, Github, HardDrive,
    Figma, CircleDot, BadgeCheck, Ban, ChevronRight, Wallet,
    CreditCard, ShieldCheck, Receipt, Send, Eye, ThumbsUp, ThumbsDown,
    AlertCircle, Zap, Award, Target, Activity, ArrowUpRight,
    CheckSquare, XSquare, RotateCcw, Banknote, PartyPopper, Info,
    ListChecks, Milestone, ClipboardList, UserCheck, UserX, Clock3,
    TrendingDown, Sparkles, RefreshCw, Lock
} from "lucide-react"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import sanitizeHtml from "sanitize-html"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const MOCK_PROJECT = {
    project_id: "proj_01",
    title: "Revamp E-Commerce Platform",
    shortDesc: "Full redesign and re-architecture of the client's e-commerce platform.",
    description: `<h2>Project Overview</h2><p>We need a complete overhaul of our existing e-commerce platform. The current system is built on legacy technology and struggles to handle peak traffic. We're looking for a team that can deliver a modern, scalable solution.</p><h2>Requirements</h2><ul><li>New design system using Tailwind CSS + shadcn/ui</li><li>Next.js 14 with App Router and server components</li><li>Integration with Razorpay and Stripe payment gateways</li><li>Real-time inventory management with WebSockets</li><li>Admin dashboard with analytics</li></ul><h2>Scope</h2><p>The project includes frontend, backend APIs, database migration, and deployment on AWS.</p>`,
    assignedToId: "user_rohan",
    assignedAt: "2025-04-01T10:00:00Z",
    assignedType: "FREELANCER",
    clientId: "client_01",
    visibility: "BOTH",
    status: "IN_PROGRESS",
    minBudget: 200000,
    maxBudget: 300000,
    finalPrice: 260000,
    deadline: "2025-05-30T00:00:00Z",
    experienceLevel: "EXPERT",
    projectType: "FIXED",
    industry: ["Technology", "E-Commerce"],
    skills: ["React", "Node.js", "AWS", "Stripe", "PostgreSQL"],
    startDate: "2025-04-01T00:00:00Z",
    completionDate: null,
    progress: 100,
    files: [
        { id: "f1", name: "Design_System_v2.fig", size: "4.2 MB", type: "figma", uploadedBy: "Priya Nair", date: "2025-04-28" },
        { id: "f2", name: "API_Documentation.pdf", size: "1.1 MB", type: "pdf", uploadedBy: "Rohan Das", date: "2025-04-25" },
        { id: "f3", name: "DB_Schema.png", size: "780 KB", type: "image", uploadedBy: "Rohan Das", date: "2025-04-18" },
    ],
    review: null,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-04-28T15:30:00Z",
}

const MOCK_APPLICATIONS = [
    {
        id: "app_01",
        projectId: "proj_01",
        applicantType: "FREELANCER",
        applicantId: "user_rohan",
        applicant: {
            id: "user_rohan",
            name: "Rohan Das",
            avatar: "RD",
            title: "Full-Stack Developer",
            rating: 4.9,
            reviews: 47,
            completedProjects: 63,
            location: "Bengaluru, India",
            skills: ["React", "Node.js", "AWS", "PostgreSQL"],
        },
        coverLetter: "Hi, I have 6+ years of experience building scalable e-commerce platforms. I've led similar projects for Myntra and Nykaa. I'm confident I can deliver this within your timeline. My approach involves a phased delivery starting with core architecture, followed by feature development and testing.",
        proposedPrice: 260000,
        status: "ACCEPTED",
        appliedAt: "2025-03-05T08:00:00Z",
    },
    {
        id: "app_02",
        projectId: "proj_01",
        applicantType: "FREELANCER",
        applicantId: "user_arjun",
        applicant: {
            id: "user_arjun",
            name: "Arjun Mehta",
            avatar: "AM",
            title: "React & Next.js Specialist",
            rating: 4.7,
            reviews: 32,
            completedProjects: 41,
            location: "Mumbai, India",
            skills: ["Next.js", "TypeScript", "Stripe", "Docker"],
        },
        coverLetter: "I specialize in modern React architectures and have built payment-integrated platforms for 3 startups. I can reduce the timeline by implementing micro-frontend architecture for better scalability.",
        proposedPrice: 245000,
        status: "PENDING",
        appliedAt: "2025-03-06T11:30:00Z",
    },
    {
        id: "app_03",
        projectId: "proj_01",
        applicantType: "ORGANIZATION",
        applicantId: "org_techwave",
        applicant: {
            id: "org_techwave",
            name: "TechWave Solutions",
            avatar: "TW",
            title: "Full-Service Tech Agency",
            rating: 4.8,
            reviews: 89,
            completedProjects: 120,
            location: "Hyderabad, India",
            skills: ["React", "Node.js", "AWS", "DevOps", "UI/UX"],
        },
        coverLetter: "TechWave has a dedicated team for e-commerce platforms. We've delivered 12+ large-scale platforms in the last 2 years. We offer post-launch support and a dedicated project manager.",
        proposedPrice: 285000,
        status: "REJECTED",
        appliedAt: "2025-03-07T09:00:00Z",
    },
    {
        id: "app_04",
        projectId: "proj_01",
        applicantType: "FREELANCER",
        applicantId: "user_sneha",
        applicant: {
            id: "user_sneha",
            name: "Sneha Kulkarni",
            avatar: "SK",
            title: "Backend & DevOps Engineer",
            rating: 4.6,
            reviews: 21,
            completedProjects: 28,
            location: "Pune, India",
            skills: ["Node.js", "AWS", "Docker", "PostgreSQL", "Redis"],
        },
        coverLetter: "I focus on backend architecture and DevOps. My expertise lies in building high-performance APIs and CI/CD pipelines. I'd bring strong backend ownership to this project?.",
        proposedPrice: 230000,
        status: "PENDING",
        appliedAt: "2025-03-08T14:00:00Z",
    },
]

const FILE_CONFIG = {
    figma: { icon: Zap, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    image: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    doc: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
}

export default function ProjectDetailPage({ params }) {
    const { slug } = use(params);
    const [project, setProject] = useState(null)
    const [applications, setApplications] = useState(null)
    const [assignedToData, setAssignedToData] = useState(null);
    const [activeTab, setActiveTab] = useState("overview")
    const [appFilter, setAppFilter] = useState("ALL")
    const [notFound, setNotFound] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [paymentDialog, setPaymentDialog] = useState(false)
    const [acceptDialog, setAcceptDialog] = useState(false)
    const [completeDialog, setCompleteDialog] = useState(false)
    const [selectedApp, setSelectedApp] = useState(null)

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/project/detail/${slug}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    setNotFound(true);
                    return;
                }
                const data = await res.json();
                console.log(data);


                let project = data?.projectData?.project;
                if (project) {
                    if (Array.isArray(project.skills) && typeof project.skills[0] === "object") {
                        project.skills = project.skills.map(s => s.name || s.title || s.skill || "");
                    }
                    if (Array.isArray(project.industry) && typeof project.industry[0] === "object") {
                        project.industry = project.industry.map(i => i.name || i.title || i.industry || "");
                    }
                }

                setProject(project);
                setApplications(data?.projectData?.applications);
                setAssignedToData(data?.projectData?.assignedTo);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        }

        fetchProject()
    }, [refresh])

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        The project you are looking for does not exist or has been removed.
                    </p>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }


    const assignedApp = assignedToData ? assignedToData : null;
    const acceptApp = applications ? applications?.filter(a => a.status === "ACCEPTED") : null
    const pendingApps = applications ? applications?.filter(a => a.status === "PENDING") : null
    const isInProgress = project?.status === "IN_PROGRESS"
    const isOpen = project?.status === "OPEN"
    const isCompleted = project?.status === "COMPLETED"
    const canComplete = isInProgress && project?.progress === 100
    const daysRemaining = daysLeft(project?.deadline)
    const clean = sanitizeHtml(project?.description);

    const filteredApps = appFilter === "ALL" ? applications : applications?.filter(a => a.status === appFilter)


    async function handleAccept(app) {
        setAcceptDialog(true);

        setSelectedApp(app)
    }

    async function confirmAccept(app) {
        try {
            console.log(app);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/project/proposal/accept`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectId: project?.project_id, applicantId: app?.applicantId, appId: app?.id })
            });
            toast.success("Application accepted successfully");
            setApplications(prev => prev.map(a => ({
                ...a,
                status: a.id === app?.id ? "ACCEPTED" : a.status === "PENDING" ? "REJECTED" : a.status
            })))
            setProject(p => ({ ...p, status: "IN_PROGRESS", assignedToId: app?.applicantId, assignedAt: new Date().toISOString(), finalPrice: app?.proposedPrice }))
        } catch (error) {
            console.error("Error accepting application:", error);
            toast.error("Failed to accept application");
        }
    }

    async function handleReject(id) {
        try {
            console.log(app);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/project/proposal/reject`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectId: project?.project_id, applicantId: app?.applicantId })
            });
            toast.success("Application rejected successfully");
            setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a))
        } catch (error) {
            console.error("Error rejecting application:", error);
            toast.error("Failed to reject application");
        }
    }

    function handleComplete() {
        setPaymentDialog(true)
    }

    function handlePaid() {
        setProject(p => ({ ...p, status: "COMPLETED", completionDate: new Date().toISOString() }))
    }

    const APP_FILTER_OPTIONS = [
        { value: "ALL", label: "All", count: applications?.length },
        { value: "PENDING", label: "Pending", count: applications?.filter(a => a.status === "PENDING").length },
        { value: "ACCEPTED", label: "Accepted", count: applications?.filter(a => a.status === "ACCEPTED").length },
        { value: "REJECTED", label: "Rejected", count: applications?.filter(a => a.status === "REJECTED").length },
    ]

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Page Header ── */}
                <div className="space-y-4">

                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 -ml-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> All Projects
            </Button>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-xs">{project?.title}</span>
          </div> */}

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold tracking-tight">{project?.title}</h1>
                                <ProjectStatusBadge status={project?.status} />
                                <Badge variant="outline" className="text-xs gap-1">
                                    {project?.projectType === "FIXED" ? <Briefcase className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                    {project?.projectType}
                                </Badge>
                                <Badge variant="outline" className="text-xs gap-1">
                                    <Eye className="h-3 w-3" /> {project?.visibility}
                                </Badge>
                            </div>
                            {project?.shortDesc && <p className="text-sm text-muted-foreground">{project?.shortDesc}</p>}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />
                                    {fmtDate(project?.startDate)} – {fmtDate(project?.deadline)}
                                </span>
                                <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />
                                    {fmtCurrency(project?.minBudget)} – {fmtCurrency(project?.maxBudget)}
                                </span>
                                {project?.experienceLevel && (
                                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" />{project?.experienceLevel}</span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {(project?.skills || []).map(s => (
                                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                                ))}
                                {(project?.industry || []).map(ind => (
                                    <Badge key={ind} variant="outline" className="text-xs gap-1"><Building2 className="h-2.5 w-2.5" />{ind}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {pendingApps?.length > 0 && isOpen && (
                                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" onClick={() => setActiveTab("applications")}>
                                    <Users className="h-3.5 w-3.5" />
                                    {pendingApps?.length} Pending Application{pendingApps?.length !== 1 ? "s" : ""}
                                </Button>
                            )}
                            {canComplete && (
                                <Button size="sm" className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCompleteDialog(true)}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                                </Button>
                            )}
                            {isCompleted && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-1.5">
                                    <BadgeCheck className="h-4 w-4" /> Project Completed
                                </div>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 px-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setRefresh(prev => prev + 1)} className="text-xs gap-2"><RefreshCw className="h-3.5 w-3.5" />Refresh Status</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs gap-2 text-red-600"><Ban className="h-3.5 w-3.5" />Cancel Project</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className={cn("font-semibold", project?.progress === 100 && "text-emerald-600")}>{isNaN(project?.progress) ? "—" : project?.progress}%</span>
                        </div>
                        <Progress value={project?.progress} className={cn("h-2", project?.progress === 100 && "[&>div]:bg-emerald-500")} />
                        {canComplete && (
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" /> Project is Completed! You can now mark this project as completed.
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="h-9 bg-muted/60 w-full sm:w-auto">
                        {[
                            { value: "overview", icon: CircleDot, label: "Overview" },
                            { value: "applications", icon: Users, label: "Applications", count: pendingApps?.length },
                            { value: "files", icon: Paperclip, label: "Files" },
                            { value: "details", icon: Layers, label: "Details" },
                        ].map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs h-7 px-3 relative">
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                        {tab.count}
                                    </span>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* ══ OVERVIEW ══ */}
                    <TabsContent value="overview" className="mt-5 space-y-5">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <StatCard icon={DollarSign} label="Final Price" value={project?.finalPrice ? fmtCurrency(project?.finalPrice) : "—"} sub={`Max: ${fmtCurrency(project?.maxBudget)}`} accent="bg-emerald-500" />
                            <StatCard
                                icon={Timer}
                                label="Days Left"
                                value={
                                    isNaN(daysRemaining)
                                        ? "—"
                                        : daysRemaining < 0
                                            ? "Overdue"
                                            : daysRemaining
                                }
                                sub={
                                    isNaN(daysRemaining)
                                        ? ""
                                        : daysRemaining < 0
                                            ? `${Math.abs(daysRemaining)}d past deadline`
                                            : "until deadline"
                                }
                                accent="bg-orange-500"
                                highlight={!isNaN(daysRemaining) && daysRemaining < 5}
                            />
                            <StatCard icon={Users} label="Applications" value={applications?.length} sub={`${pendingApps?.length} pending`} accent="bg-violet-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Assigned Talent */}
                            <Card className="lg:col-span-1">
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><UserCheck className="h-4 w-4 text-muted-foreground" />Assigned Talent</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4">
                                    {assignedApp ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="font-bold bg-emerald-100 text-emerald-700">{assignedApp?.org_logo_url}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="font-semibold text-sm truncate">{assignedApp?.org_name}</p>
                                                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                                                    </div>
                                                    {/* <p className="text-xs text-muted-foreground">{assignedApp?.applicant.title}</p> */}
                                                    <Stars rating={assignedApp?.rating} />
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Type</span>
                                                    <Badge variant="outline" className="text-xs">{acceptApp?.applicantType}</Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Agreed Price</span>
                                                    <span className="font-semibold text-primary">{fmtCurrency(acceptApp?.proposedPrice)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Assigned On</span>
                                                    <span>{fmtDate(project?.assignedAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Country</span>
                                                    <span>{assignedApp?.country || "—"}</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full h-7 text-xs gap-1.5 mt-1">
                                                <MessageSquare className="h-3.5 w-3.5" /> Message Talent
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                            <User className="h-8 w-8 opacity-30" />
                                            <p className="text-xs font-medium">No talent assigned yet</p>
                                            <p className="text-xs text-center">Accept an application to assign the project?.</p>
                                            {pendingApps?.length > 0 && (
                                                <Button size="sm" variant="outline" className="text-xs h-7 mt-1 gap-1" onClick={() => setActiveTab("applications")}>
                                                    View {pendingApps?.length} Application{pendingApps?.length !== 1 ? "s" : ""}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card className="lg:col-span-2">
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Milestone className="h-4 w-4 text-muted-foreground" />Project Timeline</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4">
                                    <div className="relative space-y-0">
                                        {[
                                            {
                                                label: "Project Created",
                                                date: project?.createdAt,
                                                done: true,
                                                desc: "Project posted and opened for applications",
                                                icon: Sparkles,
                                            },
                                            {
                                                label: "Talent Assigned",
                                                date: project?.assignedAt,
                                                done: !!project?.assignedAt,
                                                desc: assignedApp ? `Assigned to ${assignedApp?.org_name}` : "Pending assignment",
                                                icon: UserCheck,
                                            },
                                            {
                                                label: "In Progress",
                                                date: project?.startDate,
                                                done: ["IN_PROGRESS", "DELAYED", "COMPLETED"].includes(project?.status),
                                                desc: "Active development phase",
                                                icon: Activity,
                                            },
                                            {
                                                label: "Deadline",
                                                date: project?.deadline,
                                                done: isCompleted,
                                                desc: `Due ${fmtDate(project?.deadline)}`,
                                                icon: Flag,
                                                highlight: !isCompleted && daysRemaining <= 7,
                                            },
                                            {
                                                label: "Completed",
                                                date: project?.completionDate,
                                                done: isCompleted,
                                                desc: project?.completionDate ? `Completed on ${fmtDate(project?.completionDate)}` : "Pending completion",
                                                icon: BadgeCheck,
                                            },
                                        ].map((step, idx, arr) => (
                                            <div key={step.label} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={cn(
                                                        "h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10",
                                                        step.done ? "bg-primary text-primary-foreground" :
                                                            step.highlight ? "bg-red-100 border-2 border-red-400 text-red-500" :
                                                                "bg-muted border-2 border-border text-muted-foreground"
                                                    )}>
                                                        <step.icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    {idx < arr.length - 1 && (
                                                        <div className={cn("w-0.5 h-10 mt-1", step.done ? "bg-primary/30" : "bg-border")} />
                                                    )}
                                                </div>
                                                <div className="pb-4 flex-1 min-w-0 pt-0.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className={cn("text-sm font-medium", !step.done && "text-muted-foreground")}>{step.label}</p>
                                                        {step.date && <p className="text-xs text-muted-foreground shrink-0">{fmtDate(step.date)}</p>}
                                                    </div>
                                                    <p className={cn("text-xs mt-0.5", step.highlight ? "text-red-500" : "text-muted-foreground")}>{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>


                    </TabsContent>

                    {/* ══ APPLICATIONS ══ */}
                    <TabsContent value="applications" className="mt-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="font-semibold text-sm">Project Applications</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">{applications?.length} total · {pendingApps?.length} awaiting your decision</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex rounded-lg border overflow-hidden">
                                    {APP_FILTER_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setAppFilter(opt.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 flex items-center gap-1.5",
                                                appFilter === opt.value ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {opt.label}
                                            {opt.count > 0 && (
                                                <span className={cn("text-xs", appFilter === opt.value ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                                    ({opt.count})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {isInProgress && assignedApp && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                <BadgeCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Project Assigned</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                                        This project is currently assigned to <strong>{assignedApp?.org_name}</strong>. Other applications can still be viewed but no longer actioned.
                                    </p>
                                </div>
                            </div>
                        )}

                        {filteredApps?.length === 0 ? (
                            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                                <Users className="h-10 w-10 opacity-30" />
                                <p className="text-sm font-medium">No {appFilter !== "ALL" ? appFilter.toLowerCase() : ""} applications</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredApps?.map(app => (
                                    <ApplicationCard
                                        key={app?.id}
                                        app={app}
                                        onAccept={handleAccept}
                                        onReject={handleReject}
                                        isAssigned={!!assignedApp}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* ══ FILES ══ */}
                    <TabsContent value="files" className="mt-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-sm">Project Files</h2>
                            <Button size="sm" className="text-xs h-8 gap-1.5">
                                <Paperclip className="h-3.5 w-3.5" /> Upload File
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(project?.files || []).map(file => {
                                const fc = FILE_CONFIG[file.type] || { icon: File, color: "text-muted-foreground", bg: "bg-muted" }
                                return (
                                    <Card key={file.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2.5 rounded-lg shrink-0", fc.bg)}>
                                                    <fc.icon className={cn("h-4 w-4", fc.color)} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.size} · {file.uploadedBy} · {fmtDate(file.date)}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0">
                                                    <ExternalLink className="h-3 w-3" /> Open
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            {(!project?.files || project?.files.length === 0) && (
                                <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                                    <Paperclip className="h-10 w-10 opacity-30" />
                                    <p className="text-sm font-medium">No files uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ══ DETAILS ══ */}
                    <TabsContent value="details" className="mt-5 space-y-4">
                        <Card>
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-muted-foreground" />Full Project Description</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                <div
                                    className="ProseMirror prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: clean }}
                                />
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" />Project Info</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-3 text-sm">
                                    {[
                                        { label: "Project ID", value: project?.project_id },
                                        { label: "Type", value: project?.projectType },
                                        { label: "Visibility", value: project?.visibility },
                                        { label: "Experience", value: project?.experienceLevel || "—" },
                                        { label: "Created", value: fmtDate(project?.createdAt) },

                                    ].map(row => (
                                        <div key={row.label} className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">{row.label}</span>
                                            <span className="text-xs font-medium truncate max-w-[60%] text-right">{row.value}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" />Financial Details</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-3 text-sm">
                                    {[
                                        { label: "Min Budget", value: fmtCurrency(project?.minBudget) },
                                        { label: "Max Budget", value: fmtCurrency(project?.maxBudget) },
                                        { label: "Final Price", value: project?.finalPrice ? fmtCurrency(project?.finalPrice) : "Not set" },
                                        { label: "Platform Fee (5%)", value: project?.finalPrice ? fmtCurrency(project?.finalPrice * 0.05) : "—" },
                                        { label: "Total Payable", value: project?.finalPrice ? fmtCurrency(project?.finalPrice * 1.05) : "—" },
                                    ].map(row => (
                                        <div key={row.label} className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">{row.label}</span>
                                            <span className="text-xs font-semibold">{row.value}</span>
                                        </div>
                                    ))}
                                    {isInProgress && !isCompleted && (
                                        <>
                                            <Separator />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-xs h-8 gap-1.5"
                                                onClick={() => setPaymentDialog(true)}
                                                disabled={!canComplete}
                                            >
                                                {canComplete ? (
                                                    <><Wallet className="h-3.5 w-3.5" /> Release Payment</>
                                                ) : (
                                                    <><Lock className="h-3.5 w-3.5" /> Available when progress is 100%</>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    {isCompleted && (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium justify-center pt-1">
                                            <Receipt className="h-3.5 w-3.5" /> Payment Released
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Review */}
                        {(isCompleted || project?.review) && (
                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" />Your Review</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4">
                                    {project?.review ? (
                                        <p className="text-sm text-muted-foreground leading-relaxed">{project?.review}</p>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                                            <Star className="h-7 w-7 opacity-30" />
                                            <p className="text-xs">No review added yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* ── Dialogs ── */}
            <AcceptDialog
                open={acceptDialog}
                onOpenChange={setAcceptDialog}
                app={selectedApp}
                onConfirm={confirmAccept}
            />
            <CompleteDialog
                open={completeDialog}
                onOpenChange={setCompleteDialog}
                onComplete={handleComplete}
            />
            <PaymentDialog
                open={paymentDialog}
                onOpenChange={setPaymentDialog}
                project={project}
                onPay={handlePaid}
                applications={applications}
            />
        </div>
    )
}

function daysLeft(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / 86400000)
}

function fmtDate(dateStr, opts = {}) {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts })
}

function fmtCurrency(n) {
    return `₹${Number(n).toLocaleString("en-IN")}`
}

function initials(name) {
    return name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

function ProjectStatusBadge({ status }) {
    const cfg = {
        OPEN: { label: "Open", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0" },
        IN_PROGRESS: { label: "In Progress", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0" },
        DELAYED: { label: "Delayed", class: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0" },
        COMPLETED: { label: "Completed", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0" },
        CANCELLED: { label: "Cancelled", class: "bg-muted text-muted-foreground border-0" },
    }[status] || { label: status, class: "" }
    return <Badge className={cn("text-xs font-semibold", cfg.class)}>{cfg.label}</Badge>
}

function AppStatusBadge({ status }) {
    const cfg = {
        PENDING: { label: "Pending", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0" },
        ACCEPTED: { label: "Accepted", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0" },
        REJECTED: { label: "Rejected", class: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0" },
    }[status] || { label: status, class: "" }
    return <Badge className={cn("text-xs font-semibold", cfg.class)}>{cfg.label}</Badge>
}

function Stars({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{rating}</span>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub, accent, highlight }) {
    return (
        <Card className="overflow-hidden">
            <div className={cn("h-0.5", accent)} />
            <CardContent className="py-4 px-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={cn("text-2xl font-bold tracking-tight", highlight && "text-red-500")}>{value}</p>
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ApplicationCard({ app, onAccept, onReject, isAssigned }) {
    const [expanded, setExpanded] = useState(false)
    const isAccepted = app?.status === "ACCEPTED"
    const isRejected = app?.status === "REJECTED"
    const isPending = app?.status === "PENDING"

    return (
        <Card className={cn(
            "border transition-all duration-200",
            isAccepted && "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/50 dark:bg-emerald-900/10",
            isRejected && "opacity-60"
        )}>
            <CardContent className="py-4 px-5">
                <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                            <AvatarFallback className={cn(
                                "text-sm font-bold",
                                isAccepted ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"
                            )}>
                                {/* {app?.applicant.avatar} */}
                                {app?.applicantType === "FREELANCER" ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm">{app?.applicantType === "FREELANCER" ? app?.applicant.freelancer?.first_name + " " + app?.applicant.freelancer?.last_name : app?.applicant.organization.org_name}</p>
                                {isAccepted && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                                <AppStatusBadge status={app?.status} />
                                <Badge variant="outline" className="text-xs ml-auto">
                                    {app?.applicantType === "FREELANCER" ? <User className="h-3 w-3 mr-1" /> : <Building2 className="h-3 w-3 mr-1" />}
                                    {app?.applicantType}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{app?.applicantType === "FREELANCER" ? app?.applicant.freelancer.title : app?.applicant.first_name + " " + app?.applicant.last_name} · {app?.applicantType === "FREELANCER" ? app?.applicant.freelancer.country : app?.applicant.organization.country}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <Stars rating={app?.applicant?.rating} />
                                {/* <span className="text-xs text-muted-foreground">{app?.applicant.reviews} reviews</span> */}
                                {/* <span className="text-xs text-muted-foreground">{app?.applicant.completedProjects} projects</span> */}
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-base font-bold text-foreground">{fmtCurrency(app?.proposedPrice)}</p>
                            <p className="text-xs text-muted-foreground">Proposed</p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                        {app?.applicantType === "FREELANCER" && app?.applicant.freelancer.skills && app?.applicant.freelancer.skills.map(s => (
                            <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                        ))}

                        {
                            app?.applicantType === "ORGANIZATION" && app?.applicant.organization.industry &&
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{app?.applicant.organization.industry}</span>
                        }
                    </div>

                    {/* Cover Letter */}
                    <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                        <p className={cn("text-xs text-foreground/80 leading-relaxed", !expanded && "line-clamp-2")}>
                            {app?.coverLetter}
                        </p>
                        {app?.coverLetter?.length > 120 && (
                            <button className="text-xs text-primary hover:underline" onClick={() => setExpanded(!expanded)}>
                                {expanded ? "Show less" : "Read more"}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-muted-foreground">Applied {fmtDate(app?.appliedAt)}</p>
                        {isPending && !isAssigned && (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                                    onClick={() => onReject(app?.id)}
                                >
                                    <XSquare className="h-3.5 w-3.5" /> Reject
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => onAccept(app)}
                                >
                                    <CheckSquare className="h-3.5 w-3.5" /> Accept
                                </Button>
                            </div>
                        )}
                        {isAccepted && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Assigned to this project
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PaymentDialog({ open, onOpenChange, project, onPay, applications }) {
    const [step, setStep] = useState(1)
    const [method, setMethod] = useState("")
    const [upiId, setUpiId] = useState("")
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")
    const amount = project?.finalPrice || project?.maxBudget

    function handlePay() {
        if (step === 1) { setStep(2); return }
        if (step === 2) { setStep(3); return }
        onPay({ method, upiId, rating, review })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === 3 ? (
                            <><PartyPopper className="h-4 w-4 text-amber-500" /> Project Completed!</>
                        ) : (
                            <><Wallet className="h-4 w-4 text-primary" /> Release Payment</>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {step === 1 && "Review the payment details before proceeding."}
                        {step === 2 && "Choose your payment method to release funds."}
                        {step === 3 && "Payment released! Leave a review for the talent."}
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {["Review", "Payment", "Review & Complete"].map((s, i) => (
                        <div key={s} className="flex items-center gap-1">
                            {i > 0 && <ChevronRight className="h-3 w-3" />}
                            <span className={cn("font-medium", step === i + 1 && "text-primary")}>{s}</span>
                        </div>
                    ))}
                </div>

                <Separator />

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Project</span>
                                <span className="font-medium text-right max-w-[60%] truncate">{project?.title}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Talent</span>
                                <span className="font-medium">{applications?.find(a => a.status === "ACCEPTED")?.applicant.name || "—"}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Project Cost</span>
                                <span>{fmtCurrency(amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Platform Fee (5%)</span>
                                <span className="text-red-500">− {fmtCurrency(amount * 0.05)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total Payable</span>
                                <span className="text-lg text-primary">{fmtCurrency(amount * 1.05)}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400">Funds are held in escrow and released to the talent only after you confirm completion.</p>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <Label className="text-xs font-medium">Payment Method</Label>
                        {[
                            { value: "upi", icon: Wallet, label: "UPI", desc: "Pay via UPI ID or QR" },
                            { value: "card", icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                            { value: "netbanking", icon: Banknote, label: "Net Banking", desc: "All major banks" },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setMethod(opt.value)}
                                className={cn(
                                    "w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all",
                                    method === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                )}
                            >
                                <div className={cn("p-2 rounded-lg", method === opt.value ? "bg-primary/10" : "bg-muted")}>
                                    <opt.icon className={cn("h-4 w-4", method === opt.value ? "text-primary" : "text-muted-foreground")} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{opt.label}</p>
                                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                </div>
                                {method === opt.value && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                            </button>
                        ))}
                        {method === "upi" && (
                            <Input
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                className="h-9 text-sm"
                            />
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="text-center space-y-2 py-2">
                            <div className="text-5xl">🎉</div>
                            <p className="text-sm font-semibold">{fmtCurrency(amount * 1.05)} paid successfully</p>
                            <p className="text-xs text-muted-foreground">Payment has been released to the talent.</p>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <Label className="text-xs font-medium">Rate your experience</Label>
                            <div className="flex items-center gap-2 justify-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <button key={i} type="button" onClick={() => setRating(i + 1)}>
                                        <Star className={cn("h-7 w-7 transition-colors", i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-300")} />
                                    </button>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Share your experience working with this talent..."
                                value={review}
                                onChange={e => setReview(e.target.value)}
                                rows={3}
                                className="text-sm resize-none"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2">
                    {step > 1 && step < 3 && (
                        <Button variant="outline" size="sm" onClick={() => setStep(s => s - 1)}>Back</Button>
                    )}
                    <Button
                        size="sm"
                        onClick={handlePay}
                        disabled={step === 2 && !method}
                        className={cn("gap-1.5", step === 3 && "bg-emerald-600 hover:bg-emerald-700")}
                    >
                        {step === 1 && <><ChevronRight className="h-3.5 w-3.5" /> Continue</>}
                        {step === 2 && <><Wallet className="h-3.5 w-3.5" /> Pay {fmtCurrency(amount * 1.05)}</>}
                        {step === 3 && <><CheckCircle2 className="h-3.5 w-3.5" /> Complete Project</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AcceptDialog({ open, onOpenChange, app, onConfirm }) {
    if (!app) return null
    let displayName = ""
    let displayTitle = ""
    if (app?.applicantType === "FREELANCER") {
        displayName = (app?.applicant?.freelancer?.first_name || "") + " " + (app?.applicant?.freelancer?.last_name || "")
        displayTitle = app?.applicant?.freelancer?.title || ""
    } else if (app?.applicantType === "ORGANIZATION") {
        displayName = app?.applicant?.organization?.org_name || ""
        displayTitle = app?.applicant?.organization?.industry || ""
    } else {
        displayName = app?.applicant?.name || ""
        displayTitle = app?.applicant?.title || ""
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <UserCheck className="h-4 w-4 text-emerald-500" /> Confirm Assignment
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        This will assign the project to the selected applicant and reject all others.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-bold bg-emerald-100 text-emerald-700">
                            {app?.applicantType === "FREELANCER"
                                ? (app?.applicant?.freelancer?.first_name?.[0] || "") + (app?.applicant?.freelancer?.last_name?.[0] || "")
                                : app?.applicantType === "ORGANIZATION"
                                    ? (app?.applicant?.organization?.org_name?.slice(0, 2) || "")
                                    : (app?.applicant?.avatar || "")
                            }
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{displayTitle}</p>
                        <p className="text-sm font-bold text-primary mt-0.5">{fmtCurrency(app?.proposedPrice)}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">The project status will change to <strong>In Progress</strong> and the talent will be notified immediately.</p>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => { onConfirm(app); onOpenChange(false) }}>
                        <UserCheck className="h-3.5 w-3.5" /> Assign Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function CompleteDialog({ open, onOpenChange, onComplete }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" /> Mark as Completed
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Confirm that all deliverables have been received and approved.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    {[
                        "All tasks have been completed",
                        "Deliverables meet the requirements",
                        "You're ready to release payment",
                    ].map(item => (
                        <div key={item} className="flex items-center gap-2.5 p-3 bg-muted/40 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <p className="text-xs font-medium">{item}</p>
                        </div>
                    ))}
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button size="sm" className="gap-1.5" onClick={() => { onComplete(); onOpenChange(false) }}>
                        <Sparkles className="h-3.5 w-3.5" /> Proceed to Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}