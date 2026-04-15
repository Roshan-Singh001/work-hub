"use client"
import { useState, useRef, useEffect } from "react"
import {
    ArrowLeft, MoreHorizontal, CalendarDays, Users, Briefcase, CheckCircle2,
    AlertTriangle, CircleDot, Clock, Plus, X, ChevronDown, GripVertical,
    MessageSquare, Paperclip, Send, Upload, FileText, Image, File,
    DollarSign, Flame, Star, ExternalLink, Edit2, Trash2, UserPlus,
    ClipboardList, Globe, Timer, TrendingUp, BadgeCheck, Filter,
    SquareKanban, List, Search, Tag, Flag, Bot, Zap
} from "lucide-react"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECT = {
    id: "proj_01",
    title: "Revamp E-Commerce Platform",
    client: "TechNova Pvt. Ltd.",
    status: "Active",
    priority: "High",
    progress: 62,
    startDate: "2025-03-01",
    endDate: "2025-05-30",
    description:
        "Full redesign and re-architecture of the client's e-commerce platform. Includes new design system, performance optimization, and integration with third-party payment gateways.",
    budget: 280000,
    spent: 174000,
    tags: ["React", "Node.js", "AWS", "Stripe"],
}

const MOCK_MEMBERS = [
    { id: "m1", name: "Arjun Sharma", role: "Project Lead", avatar: "AS", tasks: 5 },
    { id: "m2", name: "Priya Nair", role: "UI/UX Designer", avatar: "PN", tasks: 3 },
    { id: "m3", name: "Rohan Das", role: "Backend Dev", avatar: "RD", tasks: 4 },
    { id: "m4", name: "Sneha Kulkarni", role: "QA Engineer", avatar: "SK", tasks: 2 },
]

const INITIAL_TASKS = {
    todo: [
        { id: "t1", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for auto-deploy", priority: "High", deadline: "2025-05-10", assignee: "m3", tags: ["DevOps"] },
        { id: "t2", title: "Design checkout flow", description: "Wireframes + hi-fi mockups for checkout", priority: "Medium", deadline: "2025-05-08", assignee: "m2", tags: ["Design"] },
    ],
    inprogress: [
        { id: "t3", title: "Product listing API", description: "REST endpoints for catalog with filters", priority: "High", deadline: "2025-05-05", assignee: "m3", tags: ["Backend"] },
        { id: "t4", title: "Component library setup", description: "Storybook + shadcn base tokens", priority: "Medium", deadline: "2025-05-06", assignee: "m2", tags: ["Frontend"] },
    ],
    done: [
        { id: "t5", title: "Project kickoff meeting", description: "Align on scope, timeline, deliverables", priority: "Low", deadline: "2025-03-05", assignee: "m1", tags: ["Management"] },
        { id: "t6", title: "Tech stack finalization", description: "Chose React 18 + Next.js + Express", priority: "Medium", deadline: "2025-03-10", assignee: "m1", tags: ["Architecture"] },
    ],
}

const MOCK_FREELANCERS = [
    { id: "f1", title: "Build Payment Gateway Integration", description: "Integrate Razorpay & Stripe with webhook handlers", amount: 25000, type: "Fixed", deadline: "2025-05-15", status: "Open", bids: 4 },
    { id: "f2", title: "Mobile App UI Design", description: "Design Figma screens for iOS/Android", amount: 800, type: "Hourly", deadline: "2025-05-20", status: "In Review", bids: 7 },
]

const MOCK_FILES = [
    { id: "fi1", name: "Design_System_v2.fig", size: "4.2 MB", type: "figma", uploadedBy: "Priya Nair", date: "2025-04-28" },
    { id: "fi2", name: "API_Documentation.pdf", size: "1.1 MB", type: "pdf", uploadedBy: "Rohan Das", date: "2025-04-25" },
    { id: "fi3", name: "Sprint_1_Report.docx", size: "320 KB", type: "doc", uploadedBy: "Arjun Sharma", date: "2025-04-20" },
    { id: "fi4", name: "DB_Schema.png", size: "780 KB", type: "image", uploadedBy: "Rohan Das", date: "2025-04-18" },
]

const MOCK_MESSAGES = [
    { id: "msg1", sender: "Arjun Sharma", avatar: "AS", time: "10:32 AM", text: "CI/CD pipeline draft is ready for review. Please check the GitHub Actions config." },
    { id: "msg2", sender: "Priya Nair", avatar: "PN", time: "10:45 AM", text: "Checkout flow wireframes uploaded to Figma. Link in Files tab." },
    { id: "msg3", sender: "Rohan Das", avatar: "RD", time: "11:02 AM", text: "Product listing API is about 70% done. Should be ready by EOD tomorrow." },
    { id: "msg4", sender: "Me", avatar: "ME", time: "11:10 AM", text: "Great progress everyone! Let's sync at 3 PM today for a quick standup.", isMe: true },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
    High: { color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", dot: "bg-red-500" },
    Medium: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300", dot: "bg-yellow-500" },
    Low: { color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", dot: "bg-green-500" },
}

const FILE_ICONS = {
    figma: { icon: <Zap className="h-4 w-4 text-purple-500" />, bg: "bg-purple-50 dark:bg-purple-900/20" },
    pdf: { icon: <FileText className="h-4 w-4 text-red-500" />, bg: "bg-red-50 dark:bg-red-900/20" },
    doc: { icon: <FileText className="h-4 w-4 text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-900/20" },
    image: { icon: <Image className="h-4 w-4 text-green-500" />, bg: "bg-green-50 dark:bg-green-900/20" },
}

function getMember(id) {
    return MOCK_MEMBERS.find(m => m.id === id)
}

function daysLeft(dateStr) {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
    return diff
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const [tasks, setTasks] = useState(INITIAL_TASKS)
    const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS)
    const [messages, setMessages] = useState(MOCK_MESSAGES)
    const [chatInput, setChatInput] = useState("")

    // Dialogs
    const [taskDialog, setTaskDialog] = useState(false)
    const [editTask, setEditTask] = useState(null)
    const [freelancerDialog, setFreelancerDialog] = useState(false)
    const [outsourceTask, setOutsourceTask] = useState(null)

    // New task form
    const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "", priority: "Medium", assignee: "", tags: "", column: "todo" })

    // New freelancer gig form
    const [newGig, setNewGig] = useState({ title: "", description: "", amount: "", type: "Fixed", deadline: "" })

    // Kanban drag
    const dragItem = useRef(null)
    const dragOverColumn = useRef(null)

    function openTaskDialog(column = "todo", task = null) {
        if (task) {
            setEditTask(task)
            setNewTask({ ...task, column })
        } else {
            setEditTask(null)
            setNewTask({ title: "", description: "", deadline: "", priority: "Medium", assignee: "", tags: "", column })
        }
        setTaskDialog(true)
    }

    function saveTask() {
        if (!newTask.title.trim()) return
        const taskObj = {
            id: editTask ? editTask.id : `t${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            deadline: newTask.deadline,
            priority: newTask.priority,
            assignee: newTask.assignee,
            tags: newTask.tags ? (typeof newTask.tags === "string" ? newTask.tags.split(",").map(t => t.trim()).filter(Boolean) : newTask.tags) : [],
        }
        setTasks(prev => {
            const next = { ...prev }
            if (editTask) {
                // remove from old column
                Object.keys(next).forEach(col => {
                    next[col] = next[col].filter(t => t.id !== editTask.id)
                })
            }
            next[newTask.column] = [...(next[newTask.column] || []), taskObj]
            return next
        })
        setTaskDialog(false)
    }

    function deleteTask(col, id) {
        setTasks(prev => ({ ...prev, [col]: prev[col].filter(t => t.id !== id) }))
    }

    function openOutsource(task) {
        setOutsourceTask(task)
        setNewGig({ title: task.title, description: task.description, amount: "", type: "Fixed", deadline: task.deadline })
        setFreelancerDialog(true)
    }

    function saveGig() {
        if (!newGig.title.trim()) return
        setFreelancers(prev => [...prev, {
            id: `f${Date.now()}`,
            title: newGig.title,
            description: newGig.description,
            amount: Number(newGig.amount) || 0,
            type: newGig.type,
            deadline: newGig.deadline,
            status: "Open",
            bids: 0,
        }])
        setFreelancerDialog(false)
        setOutsourceTask(null)
        setActiveTab("freelancers")
    }

    function sendMessage() {
        if (!chatInput.trim()) return
        setMessages(prev => [...prev, {
            id: `msg${Date.now()}`,
            sender: "Me",
            avatar: "ME",
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            text: chatInput,
            isMe: true,
        }])
        setChatInput("")
    }

    const totalTasks = Object.values(tasks).flat().length
    const doneTasks = tasks.done.length

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Project Header ── */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 -ml-2">
                            <ArrowLeft className="h-3.5 w-3.5" /> All Projects
                        </Button>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate">{MOCK_PROJECT.title}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold tracking-tight truncate">{MOCK_PROJECT.title}</h1>
                                <ProjectStatusBadge status={MOCK_PROJECT.status} />
                                <PriorityBadge priority={MOCK_PROJECT.priority} />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{MOCK_PROJECT.client}</span>
                                <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />
                                    {new Date(MOCK_PROJECT.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                                    {new Date(MOCK_PROJECT.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{MOCK_MEMBERS.length} members</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {MOCK_PROJECT.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="px-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Duplicate Project</DropdownMenuItem>
                                    <DropdownMenuItem>Export Report</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Archive Project</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Overall Progress</span>
                            <span className="font-medium text-foreground">{MOCK_PROJECT.progress}%</span>
                        </div>
                        <Progress value={MOCK_PROJECT.progress} className="h-2" />
                    </div>
                </div>

                {/* ── Tabs ── */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="h-9 bg-muted/60">
                        {[
                            { value: "overview", icon: <CircleDot className="h-3.5 w-3.5" />, label: "Overview" },
                            { value: "tasks", icon: <ClipboardList className="h-3.5 w-3.5" />, label: "Tasks" },
                            { value: "team", icon: <Users className="h-3.5 w-3.5" />, label: "Team" },
                            { value: "freelancers", icon: <Globe className="h-3.5 w-3.5" />, label: "Freelancers" },
                            { value: "files", icon: <Paperclip className="h-3.5 w-3.5" />, label: "Files" },
                            { value: "chat", icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Chat" },
                        ].map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs h-7 px-3">
                                {tab.icon}{tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* ══ OVERVIEW ══ */}
                    <TabsContent value="overview" className="mt-4 space-y-4">
                        {/* Quick stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: ClipboardList, label: "Total Tasks", value: totalTasks, sub: `${doneTasks} done` },
                                { icon: Users, label: "Team Members", value: MOCK_MEMBERS.length, sub: "Active" },
                                { icon: DollarSign, label: "Budget Used", value: `₹${(MOCK_PROJECT.spent / 1000).toFixed(0)}K`, sub: `of ₹${(MOCK_PROJECT.budget / 1000).toFixed(0)}K` },
                                { icon: Timer, label: "Days Left", value: daysLeft(MOCK_PROJECT.endDate), sub: "until deadline", highlight: daysLeft(MOCK_PROJECT.endDate) < 10 },
                            ].map(s => (
                                <Card key={s.label} className="py-3">
                                    <CardContent className="py-3 px-4 flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                            <p className={cn("text-2xl font-bold mt-0.5", s.highlight && "text-red-500")}>{s.value}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                                        </div>
                                        <div className="p-2 bg-muted rounded-md">
                                            <s.icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Description */}
                            <Card className="lg:col-span-2">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Project Description</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{MOCK_PROJECT.description}</p>
                                </CardContent>
                            </Card>

                            {/* Budget */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" />Budget Overview</CardTitle>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Spent</span>
                                            <span className="font-medium">₹{MOCK_PROJECT.spent.toLocaleString("en-IN")}</span>
                                        </div>
                                        <Progress value={(MOCK_PROJECT.spent / MOCK_PROJECT.budget) * 100} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Remaining: ₹{(MOCK_PROJECT.budget - MOCK_PROJECT.spent).toLocaleString("en-IN")}</span>
                                            <span>{Math.round((MOCK_PROJECT.spent / MOCK_PROJECT.budget) * 100)}%</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Budget</span>
                                            <span className="font-semibold">₹{MOCK_PROJECT.budget.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Spent</span>
                                            <span className="text-orange-600 font-medium">₹{MOCK_PROJECT.spent.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Available</span>
                                            <span className="text-green-600 font-medium">₹{(MOCK_PROJECT.budget - MOCK_PROJECT.spent).toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Task status summary */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2"><SquareKanban className="h-4 w-4" />Task Summary</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { key: "todo", label: "To Do", color: "bg-muted text-muted-foreground", bar: "bg-slate-400" },
                                        { key: "inprogress", label: "In Progress", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300", bar: "bg-blue-500" },
                                        { key: "done", label: "Done", color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300", bar: "bg-green-500" },
                                    ].map(col => (
                                        <div key={col.key} className="text-center space-y-2">
                                            <div className={cn("rounded-lg py-3 px-2", col.color)}>
                                                <p className="text-2xl font-bold">{tasks[col.key].length}</p>
                                                <p className="text-xs mt-0.5">{col.label}</p>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                <div className={cn("h-full rounded-full", col.bar)} style={{ width: totalTasks ? `${(tasks[col.key].length / totalTasks) * 100}%` : "0%" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ══ TASKS (KANBAN) ══ */}
                    <TabsContent value="tasks" className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-sm">Kanban Board</h2>
                                <Badge variant="outline" className="text-xs">{totalTasks} tasks</Badge>
                            </div>
                            <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => openTaskDialog("todo")}>
                                <Plus className="h-3.5 w-3.5" /> Add Task
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { key: "todo", label: "To Do", accent: "border-t-slate-400", badge: "bg-muted text-muted-foreground" },
                                { key: "inprogress", label: "In Progress", accent: "border-t-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
                                { key: "done", label: "Done", accent: "border-t-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
                            ].map(col => (
                                <KanbanColumn
                                    key={col.key}
                                    col={col}
                                    tasks={tasks[col.key]}
                                    members={MOCK_MEMBERS}
                                    onAdd={() => openTaskDialog(col.key)}
                                    onEdit={(task) => openTaskDialog(col.key, task)}
                                    onDelete={(id) => deleteTask(col.key, id)}
                                    onOutsource={(task) => openOutsource(task)}
                                    dragItem={dragItem}
                                    dragOverColumn={dragOverColumn}
                                    onDrop={() => {
                                        if (!dragItem.current) return
                                        const { task, fromCol } = dragItem.current
                                        if (fromCol === col.key) return
                                        setTasks(prev => ({
                                            ...prev,
                                            [fromCol]: prev[fromCol].filter(t => t.id !== task.id),
                                            [col.key]: [...prev[col.key], task],
                                        }))
                                        dragItem.current = null
                                    }}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {/* ══ TEAM ══ */}
                    <TabsContent value="team" className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-sm">Team Members</h2>
                            <Button size="sm" className="gap-1.5 text-xs h-8">
                                <UserPlus className="h-3.5 w-3.5" /> Add Member
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {MOCK_MEMBERS.map(member => (
                                <Card key={member.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-5 pb-4 px-4">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <Avatar className="h-14 w-14">
                                                <AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">{member.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-sm">{member.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
                                            </div>
                                            <div className="flex gap-2 w-full">
                                                <div className="flex-1 rounded-md bg-muted py-2 text-center">
                                                    <p className="text-lg font-bold">{member.tasks}</p>
                                                    <p className="text-xs text-muted-foreground">Tasks</p>
                                                </div>
                                                <div className="flex-1 rounded-md bg-muted py-2 text-center">
                                                    <p className="text-lg font-bold">{Math.round((member.tasks / totalTasks) * 100)}%</p>
                                                    <p className="text-xs text-muted-foreground">Load</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 w-full">
                                                <Button variant="outline" size="sm" className="flex-1 text-xs h-7">Message</Button>
                                                <Button variant="outline" size="sm" className="flex-1 text-xs h-7">Assign</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* ══ FREELANCERS ══ */}
                    <TabsContent value="freelancers" className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-semibold text-sm">Freelancer Gigs</h2>
                                <p className="text-xs text-muted-foreground">Tasks outsourced to external freelancers</p>
                            </div>
                            <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => { setOutsourceTask(null); setNewGig({ title: "", description: "", amount: "", type: "Fixed", deadline: "" }); setFreelancerDialog(true) }}>
                                <Plus className="h-3.5 w-3.5" /> Post Gig
                            </Button>
                        </div>

                        {freelancers.length === 0 ? (
                            <EmptyState icon={Globe} title="No gigs posted" subtitle="Outsource tasks to freelancers by clicking Post Gig or using the Outsource button on a task." />
                        ) : (
                            <div className="space-y-3">
                                {freelancers.map(gig => (
                                    <Card key={gig.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="py-4 px-5">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-semibold text-sm">{gig.title}</p>
                                                        <GigStatusBadge status={gig.status} />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{gig.description}</p>
                                                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="h-3 w-3" />
                                                            {gig.type === "Fixed" ? `₹${Number(gig.amount).toLocaleString("en-IN")} Fixed` : `₹${gig.amount}/hr`}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Timer className="h-3 w-3" />
                                                            {new Date(gig.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {gig.bids} bids
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                                                        <ExternalLink className="h-3 w-3" /> View Bids
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* ══ FILES ══ */}
                    <TabsContent value="files" className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-sm">Project Files</h2>
                            <Button size="sm" className="gap-1.5 text-xs h-8">
                                <Upload className="h-3.5 w-3.5" /> Upload File
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {MOCK_FILES.map(file => {
                                const fi = FILE_ICONS[file.type] || { icon: <File className="h-4 w-4" />, bg: "bg-muted" }
                                return (
                                    <Card key={file.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2.5 rounded-lg", fi.bg)}>
                                                    {fi.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.size} &middot; {file.uploadedBy} &middot; {new Date(file.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0">
                                                    <ExternalLink className="h-3 w-3" /> Open
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* ══ CHAT ══ */}
                    <TabsContent value="chat" className="mt-4">
                        <Card className="flex flex-col" style={{ height: "calc(100vh - 320px)", minHeight: 480 }}>
                            <CardHeader className="py-3 px-4 border-b">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-sm">Project Chat</CardTitle>
                                    <Badge variant="outline" className="text-xs ml-auto">{MOCK_MEMBERS.length} members</Badge>
                                </div>
                            </CardHeader>
                            <ScrollArea className="flex-1 px-4">
                                <div className="py-4 space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={cn("flex gap-3", msg.isMe && "flex-row-reverse")}>
                                            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                                <AvatarFallback className="text-xs bg-primary/10 text-primary">{msg.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className={cn("space-y-1 max-w-xs sm:max-w-md", msg.isMe && "items-end flex flex-col")}>
                                                <div className="flex items-center gap-2">
                                                    {!msg.isMe && <span className="text-xs font-medium">{msg.sender}</span>}
                                                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                                                </div>
                                                <div className={cn("rounded-2xl px-3.5 py-2.5 text-sm", msg.isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm")}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="p-3 border-t">
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        className="flex-1 h-9 text-sm"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    />
                                    <Button size="sm" className="h-9 px-3 gap-1.5 text-xs" onClick={sendMessage}>
                                        <Send className="h-3.5 w-3.5" /> Send
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ── Task Dialog ── */}
            <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input placeholder="Task title" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea placeholder="Describe the task..." rows={3} value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Deadline</Label>
                                <Input type="date" value={newTask.deadline} onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Priority</Label>
                                <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v }))}>
                                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">🔴 High</SelectItem>
                                        <SelectItem value="Medium">🟡 Medium</SelectItem>
                                        <SelectItem value="Low">🟢 Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Assign To</Label>
                                <Select value={newTask.assignee} onValueChange={v => setNewTask(p => ({ ...p, assignee: v }))}>
                                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select member" /></SelectTrigger>
                                    <SelectContent>
                                        {MOCK_MEMBERS.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Column</Label>
                                <Select value={newTask.column} onValueChange={v => setNewTask(p => ({ ...p, column: v }))}>
                                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="inprogress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Tags (comma separated)</Label>
                            <Input placeholder="Frontend, Backend, Design..." value={typeof newTask.tags === "string" ? newTask.tags : newTask.tags?.join(", ")} onChange={e => setNewTask(p => ({ ...p, tags: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTaskDialog(false)}>Cancel</Button>
                        <Button size="sm" onClick={saveTask}>{editTask ? "Save Changes" : "Create Task"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Freelancer/Outsource Dialog ── */}
            <Dialog open={freelancerDialog} onOpenChange={setFreelancerDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            {outsourceTask ? "Outsource Task to Freelancer" : "Post Freelancer Gig"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Gig Title *</Label>
                            <Input placeholder="What needs to be done?" value={newGig.title} onChange={e => setNewGig(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea placeholder="Detailed requirements for the freelancer..." rows={3} value={newGig.description} onChange={e => setNewGig(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Amount (₹)</Label>
                                <Input type="number" placeholder="0" value={newGig.amount} onChange={e => setNewGig(p => ({ ...p, amount: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Payment Type</Label>
                                <Select value={newGig.type} onValueChange={v => setNewGig(p => ({ ...p, type: v }))}>
                                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed Price</SelectItem>
                                        <SelectItem value="Hourly">Hourly Rate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Deadline</Label>
                            <Input type="date" value={newGig.deadline} onChange={e => setNewGig(p => ({ ...p, deadline: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setFreelancerDialog(false); setOutsourceTask(null) }}>Cancel</Button>
                        <Button size="sm" onClick={saveGig} className="gap-1.5">
                            <Globe className="h-3.5 w-3.5" /> Post Gig
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ─── Kanban Column ─────────────────────────────────────────────────────────────
function KanbanColumn({ col, tasks, members, onAdd, onEdit, onDelete, onOutsource, dragItem, dragOverColumn, onDrop }) {
    return (
        <div
            className="flex flex-col gap-3"
            onDragOver={e => { e.preventDefault(); dragOverColumn.current = col.key }}
            onDrop={onDrop}
        >
            {/* Column Header */}
            <div className={cn("rounded-lg border-t-2 bg-muted/40 px-3 py-2.5 flex items-center justify-between", col.accent)}>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{col.label}</span>
                    <Badge className={cn("text-xs h-5 px-1.5", col.badge)}>{tasks.length}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={onAdd}>
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Task Cards */}
            <div className="space-y-2 min-h-24">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        colKey={col.key}
                        members={members}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id)}
                        onOutsource={() => onOutsource(task)}
                        dragItem={dragItem}
                    />
                ))}
                {tasks.length === 0 && (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center text-xs text-muted-foreground">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, colKey, members, onEdit, onDelete, onOutsource, dragItem }) {
    const member = members.find(m => m.id === task.assignee)
    const days = task.deadline ? daysLeft(task.deadline) : null
    const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium

    return (
        <Card
            className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border bg-card"
            draggable
            onDragStart={() => { dragItem.current = { task, fromCol: colKey } }}
        >
            <CardContent className="py-3 px-3.5 space-y-2.5">
                {/* Title + menu */}
                <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-medium leading-snug flex-1">{task.title}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0 -mr-1 -mt-0.5">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={onEdit}><Edit2 className="h-3 w-3 mr-1.5" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={onOutsource} className="text-blue-600">
                                <Globe className="h-3 w-3 mr-1.5" />Outsource
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="text-red-600"><Trash2 className="h-3 w-3 mr-1.5" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}

                {/* Tags */}
                {task.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                            <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-md font-medium", pc.color)}>{task.priority}</span>
                        {days !== null && (
                            <span className={cn("text-xs flex items-center gap-0.5", days < 0 ? "text-red-500" : days <= 2 ? "text-orange-500" : "text-muted-foreground")}>
                                <Timer className="h-2.5 w-2.5" />
                                {days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                            </span>
                        )}
                    </div>
                    {member ? (
                        <Avatar className="h-5 w-5" title={member.name}>
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">{member.avatar}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground/40" title="Unassigned" />
                    )}
                </div>

                {/* Outsource quick button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-1 -mb-1"
                    onClick={onOutsource}
                >
                    <Zap className="h-3 w-3" /> Outsource to Freelancer
                </Button>
            </CardContent>
        </Card>
    )
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
function ProjectStatusBadge({ status }) {
    if (status === "Active") return <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">Active</Badge>
    if (status === "Completed") return <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">Completed</Badge>
    if (status === "Delayed") return <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0">Delayed</Badge>
    return <Badge variant="outline" className="text-xs">{status}</Badge>
}

function PriorityBadge({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium
    return <Badge className={cn("text-xs border-0", cfg.color)}>{priority} Priority</Badge>
}

function GigStatusBadge({ status }) {
    if (status === "Open") return <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">Open</Badge>
    if (status === "In Review") return <Badge className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0">In Review</Badge>
    if (status === "Closed") return <Badge className="text-xs bg-muted text-muted-foreground border-0">Closed</Badge>
    return <Badge variant="outline" className="text-xs">{status}</Badge>
}

function EmptyState({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Icon className="h-10 w-10 opacity-40" />
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-center max-w-xs">{subtitle}</p>
        </div>
    )
}