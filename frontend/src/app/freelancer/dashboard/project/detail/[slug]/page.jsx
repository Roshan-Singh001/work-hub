"use client"
import { useState, useRef, useEffect, use } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  CalendarDays, Briefcase, CheckCircle2, CircleDot, Clock, MessageSquare,
  Paperclip, Send, FileText, Image as ImageIcon, File, DollarSign, Star,
  ExternalLink, Globe, Timer, BadgeCheck, Tag, Zap, Building2, User,
  Activity, AlertTriangle, Ban, Layers, Award, ChevronRight, Lock,
  Eye, Flag, AlignLeft, Download, Inbox, CheckSquare, XSquare,
  SquareKanban, Users, ClipboardList, MoreHorizontal, ArrowLeft,
  TrendingUp, Milestone, UserCheck, Shield, Info, RefreshCw,
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ══════════════════════════════════════════════════════════════
// ─── MOCK DATA  (mirrors Prisma schema)
// ══════════════════════════════════════════════════════════════

const MOCK_FREELANCER_ME = {
  freelancer_id: "fl_kiran",
  user: { id: "u_kiran", first_name: "Kiran", last_name: "Bose", email: "kiran@dev.io" },
  title: "Frontend Specialist",
  rating: 4.7,
}

const MOCK_PROJECT = {
  project_id: "proj_01",
  title: "Revamp E-Commerce Platform",
  shortDesc: "Full redesign and re-architecture of the client's e-commerce platform.",
  description:
    "Complete overhaul of the existing e-commerce platform including new design system, performance optimization, Razorpay/Stripe payment gateway integration, real-time inventory management, and admin dashboard with analytics. Stack: Next.js 14 + Express + PostgreSQL + AWS.",
  assignedToId: "org_techwave",
  assignedAt: "2025-04-01T10:00:00Z",
  assignedType: "ORGANIZATION",
  clientId: "client_01",
  client: {
    client_id: "client_01",
    org_name: "TechNova Pvt. Ltd.",
    country: "India",
    rating: 4.8,
    user: { first_name: "Rahul", last_name: "Kapoor", email: "rahul@technova.in" },
  },
  visibility: "BOTH",
  status: "IN_PROGRESS",
  minBudget: 200000, maxBudget: 300000, finalPrice: 260000,
  deadline: "2025-05-30T00:00:00Z",
  experienceLevel: "EXPERT",
  projectType: "FIXED",
  industry: [{ id: "i1", name: "Technology" }, { id: "i2", name: "E-Commerce" }],
  skills: [
    { id: "s1", name: "React" }, { id: "s2", name: "Node.js" },
    { id: "s3", name: "AWS" }, { id: "s4", name: "Stripe" }, { id: "s5", name: "PostgreSQL" },
  ],
  startDate: "2025-04-01T00:00:00Z",
  completionDate: null,
  progress: 62,
  files: [
    { id: "f1", name: "Design_System_v2.fig", size: "4.2 MB", type: "figma", uploadedBy: "Priya Nair", date: "2025-04-28" },
    { id: "f2", name: "API_Documentation.pdf", size: "1.1 MB", type: "pdf", uploadedBy: "Rohan Das", date: "2025-04-25" },
    { id: "f3", name: "Sprint_1_Report.docx", size: "320 KB", type: "doc", uploadedBy: "Arjun Sharma", date: "2025-04-20" },
    { id: "f4", name: "DB_Schema.png", size: "780 KB", type: "image", uploadedBy: "Rohan Das", date: "2025-04-18" },
  ],
  review: null,
  createdAt: "2025-03-01T10:00:00Z",
  updatedAt: "2025-04-28T15:30:00Z",
}

// The task this freelancer applied to / was accepted for
const MOCK_MY_TASK_APPLICATION = {
  id: "ta1",
  taskId: "tk4",
  task: {
    task_id: "tk4",
    title: "Component library setup",
    description: "Storybook + shadcn base tokens, design system documentation.",
    status: "in_progress",
    progress: 55,
    outsource: {
      budget: 20000,
      paymentType: "Fixed",
      deadline: "2025-05-10",
      description: "Looking for freelancer to set up Storybook with shadcn tokens.",
      postedAt: "2025-04-15T09:00:00Z",
    },
  },
  coverLetter: "I specialize in Storybook and design systems with 4+ years building component libraries.",
  proposedPrice: 15000,
  status: "ACCEPTED", // PENDING | ACCEPTED | REJECTED
  appliedAt: "2025-04-20T09:00:00Z",
}

// All outsourced tasks on this project (visible to freelancers)
const MOCK_OUTSOURCED_TASKS = [
  {
    task_id: "tk4",
    title: "Component library setup",
    description: "Storybook + shadcn base tokens, design system documentation.",
    status: "in_progress",
    progress: 55,
    outsource: {
      budget: 20000,
      paymentType: "Fixed",
      deadline: "2025-05-10",
      description: "Looking for freelancer to set up Storybook with shadcn tokens. Must have Storybook 7+ experience.",
      postedAt: "2025-04-15T09:00:00Z",
    },
    myApplication: {
      id: "ta1",
      status: "ACCEPTED",
      proposedPrice: 15000,
      appliedAt: "2025-04-20T09:00:00Z",
    },
  },
  {
    task_id: "tk7",
    title: "Mobile responsiveness audit",
    description: "Audit all pages for mobile breakpoints and fix layout issues across devices.",
    status: "open",
    progress: 0,
    outsource: {
      budget: 8000,
      paymentType: "Fixed",
      deadline: "2025-05-20",
      description: "We need a thorough mobile responsiveness review and fix for all 12 pages. Deliverable: fix PRs + audit report.",
      postedAt: "2025-04-26T09:00:00Z",
    },
    myApplication: null,
  },
]

const MOCK_CHAT_MSGS = [
  { id: "cm1", senderId: "org_lead", sender: { first_name: "Arjun", last_name: "Sharma" }, avatar: "AS", time: "10:32 AM", content: "Hey Kiran, welcome aboard! We're excited to work with you on the component library.", createdAt: "2025-04-21T10:32:00Z" },
  { id: "cm2", senderId: "u_kiran", sender: { first_name: "Kiran", last_name: "Bose" }, avatar: "KB", time: "10:45 AM", content: "Thanks Arjun! Reviewing the Figma design system now. I'll have a first draft of Storybook tokens by Wednesday.", isMe: true, createdAt: "2025-04-21T10:45:00Z" },
  { id: "cm3", senderId: "org_lead", sender: { first_name: "Arjun", last_name: "Sharma" }, avatar: "AS", time: "11:00 AM", content: "Perfect. Please align with shadcn theming conventions. The team uses tailwind + dark mode support.", createdAt: "2025-04-21T11:00:00Z" },
]

const TASK_STATUS_META = {
  open: { label: "Open", dot: "bg-slate-400", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  in_progress: { label: "In Progress", dot: "bg-blue-500", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  completed: { label: "Completed", dot: "bg-emerald-500", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
}

const PROJECT_STATUS_META = {
  OPEN: { label: "Open", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  DELAYED: { label: "Delayed", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  COMPLETED: { label: "Completed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  CANCELLED: { label: "Cancelled", color: "bg-muted text-muted-foreground" },
}

const APP_STATUS_META = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  ACCEPTED: { label: "Accepted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
}

const FILE_CFG = {
  figma: { icon: Zap, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  doc: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  image: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
}

// ══════════════════════════════════════════════════════════════
// ─── HELPERS
// ══════════════════════════════════════════════════════════════
const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000)
const fmtDate = (d, opts = {}) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts }) : "—"
const fmtCur = (n) => `₹${Number(n).toLocaleString("en-IN")}`
const fullName = (u) => `${u?.first_name || ""} ${u?.last_name || ""}`.trim()

// ══════════════════════════════════════════════════════════════
// ─── MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function FreelancerProjectPage({ params }) {
  const { slug } = use(params)
  const { userData, loading } = useAuth()

  const [project, setProject] = useState(MOCK_PROJECT)
  const [myApplication, setMyApplication] = useState(MOCK_MY_TASK_APPLICATION)
  const [outsourcedTasks, setOutsourcedTasks] = useState(MOCK_OUTSOURCED_TASKS)
  const [chatMsgs, setChatMsgs] = useState(MOCK_CHAT_MSGS)
  const [chatInput, setChatInput] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [applyDialog, setApplyDialog] = useState(false)
  const [applyTarget, setApplyTarget] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const chatBottomRef = useRef(null)

  useEffect(() => {
    if (loading || !userData) return
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/freelancer/project/detail/${slug}`,
          { method: "GET", credentials: "include" }
        )
        if (!res.ok) { setNotFound(true); return }
        const data = await res.json()
        // setProject(data.project)
        // setMyApplication(data.myApplication)
        // setOutsourcedTasks(data.outsourcedTasks)
      } catch {
        setNotFound(true)
      }
    }
    fetchData()
  }, [loading, userData])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMsgs])

  function sendMessage() {
    if (!chatInput.trim()) return
    setChatMsgs(prev => [...prev, {
      id: `cm${Date.now()}`,
      senderId: "u_kiran",
      sender: { first_name: "Kiran", last_name: "Bose" },
      avatar: "KB",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      content: chatInput.trim(),
      isMe: true,
      createdAt: new Date().toISOString(),
    }])
    setChatInput("")
  }

  function handleApply(task, form) {
    setOutsourcedTasks(prev => prev.map(t =>
      t.task_id === task.task_id
        ? { ...t, myApplication: { id: `ta${Date.now()}`, status: "PENDING", proposedPrice: Number(form.price), appliedAt: new Date().toISOString() } }
        : t
    ))
    toast.success("Application submitted!")
  }

  const daysRemaining = daysLeft(project.deadline)
  const isCompleted = project.status === "COMPLETED"
  const isCancelled = project.status === "CANCELLED"
  const isActive = ["OPEN", "IN_PROGRESS", "DELAYED"].includes(project.status)
  const appliedCount = outsourcedTasks.filter(t => t.myApplication).length
  const acceptedCount = outsourcedTasks.filter(t => t.myApplication?.status === "ACCEPTED").length

  const statusBanner = {
    OPEN: { bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", icon: CircleDot, iconColor: "text-emerald-600", title: "Project is Open", desc: "This project is actively accepting freelancer applications on outsourced tasks." },
    IN_PROGRESS: { bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", icon: Activity, iconColor: "text-blue-600", title: "Project In Progress", desc: `Assigned to ${project.client.org_name}. Outsourced tasks are available below.` },
    DELAYED: { bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", icon: AlertTriangle, iconColor: "text-red-600", title: "Project Delayed", desc: "The project deadline has been exceeded. Communicate with the team if you're affected." },
    COMPLETED: { bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", icon: BadgeCheck, iconColor: "text-purple-600", title: "Project Completed", desc: `Completed on ${fmtDate(project.completionDate)}.` },
    CANCELLED: { bg: "bg-muted border-border", icon: Ban, iconColor: "text-muted-foreground", title: "Project Cancelled", desc: "This project has been cancelled." },
  }[project.status]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ── Header ── */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
                  <ProjectStatusBadge status={project.status} />
                  <Badge variant="outline" className="text-xs gap-1">
                    {project.projectType === "FIXED" ? <Briefcase className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {project.projectType}
                  </Badge>
                  <Badge variant="outline" className="text-xs gap-1"><Eye className="h-3 w-3" />{project.visibility}</Badge>
                </div>
                {project.shortDesc && <p className="text-sm text-muted-foreground">{project.shortDesc}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{project.client.org_name}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{fmtDate(project.startDate)} – {fmtDate(project.deadline)}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{fmtCur(project.minBudget)} – {fmtCur(project.maxBudget)}</span>
                  {project.experienceLevel && <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" />{project.experienceLevel}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map(s => (
                    <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                  ))}
                  {project.industry.map(i => (
                    <Badge key={i.id} variant="outline" className="text-xs gap-1">
                      <Building2 className="h-2.5 w-2.5" />{i.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* My status pills */}
              <div className="flex items-center gap-2 flex-wrap shrink-0 justify-end">
                {acceptedCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{acceptedCount} Task{acceptedCount > 1 ? "s" : ""} Accepted</span>
                  </div>
                )}
                {appliedCount > 0 && (
                  <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" onClick={() => setActiveTab("tasks")}>
                    <Inbox className="h-3.5 w-3.5" />{appliedCount} Applied
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-8 px-3 gap-1.5 text-xs" onClick={() => setActiveTab("chat")}>
                  <MessageSquare className="h-3.5 w-3.5" /> Chat
                </Button>
              </div>
            </div>

            {/* Status banner */}
            {statusBanner && (
              <div className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border", statusBanner.bg)}>
                <statusBanner.icon className={cn("h-4 w-4 shrink-0 mt-0.5", statusBanner.iconColor)} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{statusBanner.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{statusBanner.desc}</p>
                </div>
                {isActive && (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Overall</p>
                    <p className="text-lg font-bold text-blue-600">{project.progress}%</p>
                  </div>
                )}
              </div>
            )}

            {/* My task acceptance banner */}
            {myApplication?.status === "ACCEPTED" && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-900/10">
                <UserCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You're working on this project!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your application for <span className="font-medium text-foreground">"{myApplication.task.title}"</span> was accepted.
                    Deliver by <span className="font-medium text-foreground">{fmtDate(myApplication.task.outsource?.deadline)}</span>.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Your rate</p>
                  <p className="text-base font-bold text-emerald-600">{fmtCur(myApplication.proposedPrice)}</p>
                </div>
              </div>
            )}

            {isActive && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Project Progress</span>
                  <span className="font-semibold text-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            )}
          </div>

          {/* ── Tabs ── */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9 bg-muted/60 flex-wrap gap-0.5">
              {[
                { value: "overview", icon: CircleDot, label: "Overview" },
                { value: "tasks", icon: SquareKanban, label: "Outsourced Tasks", count: outsourcedTasks.filter(t => !t.myApplication).length },
                { value: "files", icon: Paperclip, label: "Files" },
                { value: "chat", icon: MessageSquare, label: "Team Chat" },
                { value: "details", icon: Layers, label: "Details" },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs h-7 px-3">
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none">
                      {tab.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ══ OVERVIEW ══ */}
            <TabsContent value="overview" className="mt-5 space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Globe} label="Outsourced Tasks" value={outsourcedTasks.length} sub="Available to apply" accent="bg-blue-500" />
                <StatCard icon={ClipboardList} label="My Applications" value={appliedCount} sub={`${acceptedCount} accepted`} accent="bg-violet-500" />
                <StatCard icon={DollarSign} label="Earnings (potential)" value={acceptedCount > 0 ? fmtCur(myApplication?.proposedPrice || 0) : "—"} sub="From accepted tasks" accent="bg-emerald-500" />
                <StatCard
                  icon={Timer}
                  label="Days Left"
                  value={daysRemaining < 0 ? "Overdue" : daysRemaining}
                  sub={daysRemaining < 0 ? `${Math.abs(daysRemaining)}d past deadline` : "until deadline"}
                  accent="bg-orange-500"
                  highlight={daysRemaining < 5 && !isCompleted}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Description */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlignLeft className="h-4 w-4 text-muted-foreground" />Project Description
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>

                {/* My involvement */}
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />My Involvement
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4 space-y-3">
                    {outsourcedTasks.filter(t => t.myApplication).length === 0 ? (
                      <div className="py-6 text-center">
                        <Inbox className="h-8 w-8 opacity-20 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No applications yet. Browse outsourced tasks to apply.</p>
                        <Button size="sm" variant="outline" className="mt-3 text-xs h-7 gap-1.5" onClick={() => setActiveTab("tasks")}>
                          <Globe className="h-3 w-3" /> View Tasks
                        </Button>
                      </div>
                    ) : (
                      outsourcedTasks.filter(t => t.myApplication).map(t => (
                        <div key={t.task_id} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold truncate">{t.title}</p>
                            <AppStatusBadge status={t.myApplication.status} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{fmtCur(t.myApplication.proposedPrice)} proposed</span>
                            <span>Applied {fmtDate(t.myApplication.appliedAt, { month: "short", day: "numeric" })}</span>
                          </div>
                          {t.myApplication.status === "ACCEPTED" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Task Progress</span><span>{t.progress}%</span>
                              </div>
                              <Progress value={t.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Outsourced tasks quick view */}
              <Card>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />Available Outsourced Tasks
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => setActiveTab("tasks")}>
                      View All <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  {outsourcedTasks.length === 0 ? (
                    <EmptyState icon={Globe} title="No outsourced tasks" sub="Check back later for tasks posted to freelancers." />
                  ) : (
                    <div className="space-y-2">
                      {outsourcedTasks.slice(0, 3).map(task => (
                        <OutsourcedTaskRow
                          key={task.task_id}
                          task={task}
                          onApply={() => { setApplyTarget(task); setApplyDialog(true) }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══ OUTSOURCED TASKS ══ */}
            <TabsContent value="tasks" className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm">Outsourced Tasks</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{outsourcedTasks.length} tasks posted · {outsourcedTasks.filter(t => !t.myApplication).length} open to apply</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Payments secured via WorkHub Escrow</span>
                </div>
              </div>

              {outsourcedTasks.length === 0 ? (
                <EmptyState icon={Globe} title="No outsourced tasks" sub="The organization hasn't posted any tasks for freelancers yet." />
              ) : (
                <div className="space-y-4">
                  {outsourcedTasks.map(task => (
                    <OutsourcedTaskCard
                      key={task.task_id}
                      task={task}
                      onApply={() => { setApplyTarget(task); setApplyDialog(true) }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ══ FILES ══ */}
            <TabsContent value="files" className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm">Project Files</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Shared documents and assets from the team</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>View only</span>
                </div>
              </div>
              {project.files?.length > 0 ? (
                <div className="space-y-2">
                  {project.files.map(file => {
                    const fc = FILE_CFG[file.type] || { icon: File, color: "text-muted-foreground", bg: "bg-muted" }
                    return (
                      <Card key={file.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2.5 rounded-lg shrink-0", fc.bg)}>
                              <fc.icon className={cn("h-4 w-4", fc.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size} · {file.uploadedBy} · {fmtDate(file.date, { month: "short", day: "numeric" })}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0">
                              <Download className="h-3 w-3" /> Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <EmptyState icon={Paperclip} title="No files shared yet" sub="Project files shared by the team will appear here." />
              )}
            </TabsContent>

            {/* ══ CHAT ══ */}
            <TabsContent value="chat" className="mt-5">
              <Card
                className="overflow-hidden"
                style={{ height: "calc(100vh - 340px)", minHeight: "480px", display: "flex", flexDirection: "column" }}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">Project Chat</p>
                  <p className="text-xs text-muted-foreground ml-1">with {project.client.org_name} team</p>
                  {myApplication?.status !== "ACCEPTED" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 cursor-default">
                          <Info className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Limited access</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs max-w-500">
                        Full chat access is granted once your task application is accepted.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-4">
                  {chatMsgs.map(msg => (
                    <div key={msg.id} className={cn("flex gap-3", msg.isMe && "flex-row-reverse")}>
                      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div className={cn("space-y-1 max-w-xs sm:max-w-md", msg.isMe && "items-end flex flex-col")}>
                        <div className="flex items-center gap-2">
                          {!msg.isMe && <span className="text-xs font-medium">{fullName(msg.sender)}</span>}
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                <div className="px-3 py-3 border-t shrink-0">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1 h-9 text-sm"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    />
                    <Button size="sm" className="h-9 px-3 gap-1.5 text-xs" onClick={sendMessage} disabled={!chatInput.trim()}>
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* ══ DETAILS ══ */}
            <TabsContent value="details" className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />Project Info
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4 space-y-2.5">
                    {[
                      { label: "Project ID", value: project.project_id },
                      { label: "Type", value: project.projectType },
                      { label: "Visibility", value: project.visibility },
                      { label: "Experience Required", value: project.experienceLevel || "—" },
                      { label: "Budget Range", value: `${fmtCur(project.minBudget)} – ${fmtCur(project.maxBudget)}` },
                      { label: "Start Date", value: fmtDate(project.startDate) },
                      { label: "Deadline", value: fmtDate(project.deadline) },
                      { label: "Last Updated", value: fmtDate(project.updatedAt) },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{row.label}</span>
                        <span className="text-xs font-medium text-right max-w-[60%] truncate">{row.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />Client Info
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">
                          {project.client.user?.first_name?.[0]}{project.client.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{fullName(project.client.user)}</p>
                        <p className="text-xs text-muted-foreground">{project.client.org_name}</p>
                        <StarRating rating={project.client.rating} />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: "Country", value: project.client.country },
                        { label: "Rating", value: `${project.client.rating} / 5` },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between">
                          <span className="text-xs text-muted-foreground">{row.label}</span>
                          <span className="text-xs font-medium">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review section */}
              {isCompleted && (
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />Client Review
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    {project.review
                      ? <p className="text-sm text-muted-foreground leading-relaxed">{project.review}</p>
                      : <EmptyState icon={Star} title="No review yet" sub="The client hasn't left a review for this project." />
                    }
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Apply Dialog ── */}
        <ApplyDialog
          open={applyDialog}
          onOpenChange={setApplyDialog}
          task={applyTarget}
          onApply={handleApply}
        />
      </div>
    </TooltipProvider>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── OUTSOURCED TASK ROW  (compact, for overview)
// ══════════════════════════════════════════════════════════════
function OutsourcedTaskRow({ task, onApply }) {
  const sm = TASK_STATUS_META[task.status] || TASK_STATUS_META.open
  const app = task.myApplication

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className={cn("h-2 w-2 rounded-full shrink-0", sm.dot)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{task.title}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{fmtCur(task.outsource?.budget)}</span>
          <span className="flex items-center gap-1"><Timer className="h-3 w-3" />Due {fmtDate(task.outsource?.deadline, { month: "short", day: "numeric" })}</span>
        </div>
      </div>
      {app ? (
        <AppStatusBadge status={app.status} />
      ) : (
        <Button size="sm" className="h-7 text-xs gap-1.5 shrink-0" onClick={onApply}>
          Apply
        </Button>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── OUTSOURCED TASK CARD  (full, for tasks tab)
// ══════════════════════════════════════════════════════════════
function OutsourcedTaskCard({ task, onApply }) {
  const sm = TASK_STATUS_META[task.status] || TASK_STATUS_META.open
  const app = task.myApplication
  const isApplied = !!app
  const isAccepted = app?.status === "ACCEPTED"
  const isPending = app?.status === "PENDING"

  return (
    <Card className={cn(
      "transition-all",
      isAccepted && "border-emerald-200 bg-emerald-50/20 dark:border-emerald-800/40",
      isPending && "border-amber-200 bg-amber-50/20 dark:border-amber-800/40"
    )}>
      <CardContent className="py-4 px-5 space-y-3.5">
        {/* Top row */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 shrink-0">
            <Globe className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">{task.title}</p>
              <Badge className={cn("text-xs h-5 px-1.5 border-0", sm.color)}>{sm.label}</Badge>
              {isApplied && <AppStatusBadge status={app.status} />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{task.description}</p>
          </div>
        </div>

        {/* Outsource details */}
        {task.outsource && (
          <div className="bg-muted/40 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-foreground">Task Brief</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{task.outsource.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {[
                { icon: DollarSign, label: "Budget", value: fmtCur(task.outsource.budget) },
                { icon: Briefcase, label: "Payment", value: task.outsource.paymentType },
                { icon: Timer, label: "Deadline", value: fmtDate(task.outsource.deadline, { month: "short", day: "numeric" }) },
                { icon: CalendarDays, label: "Posted", value: fmtDate(task.outsource.postedAt, { month: "short", day: "numeric" }) },
              ].map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <d.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    <p className="text-xs font-semibold">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My application details if applied */}
        {isApplied && (
          <div className={cn(
            "rounded-lg border p-3 space-y-1.5",
            isAccepted ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-800/30 dark:bg-emerald-900/10" :
            isPending ? "border-amber-200 bg-amber-50/40 dark:border-amber-800/30 dark:bg-amber-900/10" :
            "border-border bg-muted/30"
          )}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">My Application</p>
              <AppStatusBadge status={app.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Proposed: <span className="font-semibold text-foreground">{fmtCur(app.proposedPrice)}</span></span>
              <span>Applied {fmtDate(app.appliedAt, { month: "short", day: "numeric" })}</span>
            </div>
            {isAccepted && task.progress > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Task Progress</span><span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-1.5" />
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Payment secured via escrow</span>
          </div>
          {!isApplied ? (
            <Button size="sm" className="h-8 text-xs gap-1.5" onClick={onApply}>
              Apply for this Task
            </Button>
          ) : isAccepted ? (
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <MessageSquare className="h-3.5 w-3.5" /> Contact Team
            </Button>
          ) : isPending ? (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Awaiting review
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Application rejected</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── APPLY DIALOG
// ══════════════════════════════════════════════════════════════
function ApplyDialog({ open, onOpenChange, task, onApply }) {
  const [form, setForm] = useState({ price: "", coverLetter: "" })
  useEffect(() => { if (open) setForm({ price: "", coverLetter: "" }) }, [open])
  if (!task) return null
  const valid = form.price && form.coverLetter.trim().length > 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-blue-500" /> Apply for Task
          </DialogTitle>
          <DialogDescription className="text-xs">Submit your proposal for this outsourced task.</DialogDescription>
        </DialogHeader>

        {/* Task preview */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
            <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{task.title}</p>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{fmtCur(task.outsource?.budget)} {task.outsource?.paymentType}</span>
              <span className="flex items-center gap-1"><Timer className="h-3 w-3" />Due {fmtDate(task.outsource?.deadline, { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Your Proposed Price (₹) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
              <Input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="h-9 pl-7 text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">Budget is {fmtCur(task.outsource?.budget)}. You can propose a different amount.</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Cover Letter <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Describe your experience, approach, and why you're the right fit for this task..."
              rows={4}
              value={form.coverLetter}
              onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))}
              className="text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{form.coverLetter.length} chars · min 20</p>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Payment is secured in <strong>WorkHub Escrow</strong> and released once the task is approved by the organisation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!valid}
            onClick={() => { onApply(task, form); onOpenChange(false) }}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── SHARED ATOMS
// ══════════════════════════════════════════════════════════════
function ProjectStatusBadge({ status }) {
  const m = PROJECT_STATUS_META[status] || { label: status, color: "" }
  return <Badge className={cn("border-0 font-semibold text-xs", m.color)}>{m.label}</Badge>
}

function AppStatusBadge({ status }) {
  const m = APP_STATUS_META[status] || { label: status, color: "" }
  return <Badge className={cn("text-xs border-0 font-semibold", m.color)}>{m.label}</Badge>
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn("h-3 w-3", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, accent = "bg-primary", highlight }) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-0.5 w-full", accent)} />
      <CardContent className="py-4 px-4 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={cn("text-2xl font-bold tracking-tight mt-0.5", highlight && "text-red-500")}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className="p-2 rounded-lg bg-muted"><Icon className="h-4 w-4 text-muted-foreground" /></div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center py-12 gap-2.5 text-muted-foreground">
      <Icon className="h-9 w-9 opacity-30" />
      <p className="text-sm font-medium">{title}</p>
      {sub && <p className="text-xs text-center max-w-xs">{sub}</p>}
    </div>
  )
}