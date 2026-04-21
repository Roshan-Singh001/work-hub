"use client"
import { useState, useRef, useEffect, use } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft, MoreHorizontal, CalendarDays, Users, Briefcase, CheckCircle2,
  CircleDot, Clock, Plus, X, MessageSquare, Paperclip,
  Send, Upload, FileText, Image as ImageIcon, File, DollarSign, Star,
  ExternalLink, Edit2, Trash2, UserPlus, ClipboardList, Globe, Timer,
  BadgeCheck, SquareKanban, Tag, Zap, Building2, User, Activity,
  AlertTriangle, Ban, RefreshCw, Layers, Award,
  CheckSquare, ChevronRight, Sparkles, Lock, Milestone,
  UserCheck, Eye, Flag, Inbox, AlignLeft, Download, XSquare,
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
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

const API_BASE = "/api"
export const projectAPI = {
  getTasks: (id) => fetch(`${API_BASE}/projects/${id}/tasks`).then(r => r.json()),
  createTask: (id, body) => fetch(`${API_BASE}/projects/${id}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  updateTask: (id, body) => fetch(`${API_BASE}/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" }),
  getApplications: (id) => fetch(`${API_BASE}/projects/${id}/applications`).then(r => r.json()),
  updateApplicationStatus: (id, status) => fetch(`${API_BASE}/applications/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).then(r => r.json()),
  getTaskApplications: (id) => fetch(`${API_BASE}/tasks/${id}/applications`).then(r => r.json()),
  updateTaskApplicationStatus: (id, status) => fetch(`${API_BASE}/task-applications/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).then(r => r.json()),
  // Marks a task as OUTSOURCED and posts it publicly for freelancers
  outsourceTask: (taskId, body) => fetch(`${API_BASE}/tasks/${taskId}/outsource`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  updateProjectStatus: (id, status) => fetch(`${API_BASE}/projects/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).then(r => r.json()),
  sendMessage: (convId, content) => fetch(`${API_BASE}/conversations/${convId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) }).then(r => r.json()),
}

// ══════════════════════════════════════════════════════════════
// ─── MOCK DATA
// ══════════════════════════════════════════════════════════════
const MOCK_PROJECT = {
  project_id: "proj_01",
  title: "Revamp E-Commerce Platform",
  shortDesc: "Full redesign and re-architecture of the client's e-commerce platform.",
  description: "Complete overhaul of the existing e-commerce platform including new design system, performance optimization, Razorpay/Stripe payment gateway integration, real-time inventory management, and admin dashboard with analytics. Stack: Next.js 14 + Express + PostgreSQL + AWS.",
  assignedToId: "org_techwave",
  assignedAt: "2025-04-01T10:00:00Z",
  assignedType: "ORGANIZATION",
  clientId: "client_01",
  client: {
    client_id: "client_01",
    org_name: "TechNova Pvt. Ltd.",
    country: "India",
    rating: 4.8,
    user: { first_name: "Rahul", last_name: "Kapoor", email: "rahul@technova.in", phone: "+91 98765 43210" },
  },
  visibility: "ORGANIZATION",
  status: "IN_PROGRESS",
  minBudget: 200000, maxBudget: 300000, finalPrice: 260000,
  deadline: "2025-05-30T00:00:00Z",
  experienceLevel: "EXPERT",
  projectType: "FIXED",
  industry: [{ id: "i1", name: "Technology" }, { id: "i2", name: "E-Commerce" }],
  skills: [{ id: "s1", name: "React" }, { id: "s2", name: "Node.js" }, { id: "s3", name: "AWS" }, { id: "s4", name: "Stripe" }, { id: "s5", name: "PostgreSQL" }],
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

const MOCK_ORG_MEMBERS = [
  { id: "m1", name: "Arjun Sharma", role: "Project Lead", avatar: "AS", jobTitle: "Senior Full-Stack Dev", status: "active" },
  { id: "m2", name: "Priya Nair", role: "UI/UX Designer", avatar: "PN", jobTitle: "Product Designer", status: "active" },
  { id: "m3", name: "Rohan Das", role: "Backend Dev", avatar: "RD", jobTitle: "Backend Engineer", status: "active" },
  { id: "m4", name: "Sneha Kulkarni", role: "QA Engineer", avatar: "SK", jobTitle: "Quality Assurance", status: "active" },
]

const MOCK_TASKS_INITIAL = {
  open: [
    { task_id: "tk1", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for auto-deploy to AWS EC2. Include staging + prod environments.", projectId: "proj_01", status: "open", taskType: "INTERNAL", progress: 0, createdAt: "2025-04-10T10:00:00Z", assignments: [{ id: "a1", userId: "m3", role: "Developer", status: "assigned" }], applications: [], outsource: null },
    { task_id: "tk2", title: "Design checkout flow", description: "Wireframes + hi-fi mockups for checkout with Figma. Mobile-first design required.", projectId: "proj_01", status: "open", taskType: "INTERNAL", progress: 20, createdAt: "2025-04-11T10:00:00Z", assignments: [{ id: "a2", userId: "m2", role: "Designer", status: "assigned" }], applications: [], outsource: null },
  ],
  in_progress: [
    { task_id: "tk3", title: "Product listing API", description: "REST endpoints for catalog with filters, pagination, and search. OpenAPI spec required.", projectId: "proj_01", status: "in_progress", taskType: "INTERNAL", progress: 70, createdAt: "2025-04-05T10:00:00Z", assignments: [{ id: "a3", userId: "m3", role: "Developer", status: "assigned" }], applications: [], outsource: null },
    {
      task_id: "tk4", title: "Component library setup", description: "Storybook + shadcn base tokens, design system documentation.", projectId: "proj_01", status: "in_progress", taskType: "OUTSOURCED", progress: 55,
      createdAt: "2025-04-06T10:00:00Z",
      assignments: [{ id: "a4", userId: "m2", role: "Designer", status: "assigned" }],
      applications: [
        { id: "ta1", freelancerId: "fl_1", freelancer: { first_name: "Kiran", last_name: "Bose", email: "kiran@dev.io", title: "Frontend Specialist" }, coverLetter: "I specialize in Storybook and design systems with 4+ years building component libraries.", proposedPrice: 15000, status: "PENDING", appliedAt: "2025-04-20T09:00:00Z" },
        { id: "ta2", freelancerId: "fl_2", freelancer: { first_name: "Meera", last_name: "Shah", email: "meera@freelance.io", title: "UI Engineer" }, coverLetter: "Delivered 3 Storybook setups for funded startups. Can complete this in 5 days.", proposedPrice: 18000, status: "PENDING", appliedAt: "2025-04-21T10:00:00Z" },
      ],
      outsource: { budget: 20000, paymentType: "Fixed", deadline: "2025-05-10", description: "Looking for freelancer to set up Storybook with shadcn tokens.", postedAt: "2025-04-15T09:00:00Z" },
    },
  ],
  completed: [
    { task_id: "tk5", title: "Project kickoff meeting", description: "Align on scope, timeline, deliverables with client.", projectId: "proj_01", status: "completed", taskType: "INTERNAL", progress: 100, review: "Done perfectly.", createdAt: "2025-03-05T10:00:00Z", assignments: [{ id: "a5", userId: "m1", role: "Lead", status: "assigned" }], applications: [], outsource: null },
    { task_id: "tk6", title: "Tech stack finalization", description: "Chose React 18 + Next.js + Express. Document decision.", projectId: "proj_01", status: "completed", taskType: "INTERNAL", progress: 100, review: "Good research on alternatives.", createdAt: "2025-03-10T10:00:00Z", assignments: [{ id: "a6", userId: "m1", role: "Lead", status: "assigned" }], applications: [], outsource: null },
  ],
}

const MOCK_PROJ_APPS = [
  { id: "app_01", projectId: "proj_01", applicantType: "ORGANIZATION", applicantId: "org_techwave", applicant: { id: "org_techwave", first_name: "TechWave", last_name: "Solutions", email: "hello@techwave.in" }, orgProfile: { org_name: "TechWave Solutions", industry: "Technology", size: "20-50", country: "India", rating: 4.8, website: "techwave.in" }, coverLetter: "TechWave has a dedicated team for e-commerce platforms. We've delivered 12+ large-scale platforms with post-launch support.", proposedPrice: 260000, status: "ACCEPTED", appliedAt: "2025-03-07T09:00:00Z" },
  { id: "app_02", projectId: "proj_01", applicantType: "ORGANIZATION", applicantId: "org_nexus", applicant: { id: "org_nexus", first_name: "Nexus", last_name: "Digital", email: "info@nexusdigital.in" }, orgProfile: { org_name: "Nexus Digital", industry: "Technology", size: "10-20", country: "India", rating: 4.5, website: "nexusdigital.in" }, coverLetter: "Nexus Digital brings 8 years of e-commerce expertise with scalable microservice architectures.", proposedPrice: 245000, status: "REJECTED", appliedAt: "2025-03-08T11:00:00Z" },
]

const MOCK_CHAT_MSGS = [
  { id: "msg1", senderId: "m1", sender: { first_name: "Arjun", last_name: "Sharma" }, avatar: "AS", time: "10:32 AM", content: "CI/CD pipeline draft is ready for review. Check the GitHub Actions config.", createdAt: "2025-04-28T10:32:00Z" },
  { id: "msg2", senderId: "m2", sender: { first_name: "Priya", last_name: "Nair" }, avatar: "PN", time: "10:45 AM", content: "Checkout flow wireframes uploaded to Figma. Link in Files tab.", createdAt: "2025-04-28T10:45:00Z" },
  { id: "msg3", senderId: "m3", sender: { first_name: "Rohan", last_name: "Das" }, avatar: "RD", time: "11:02 AM", content: "Product listing API is about 70% done. Ready by EOD tomorrow.", createdAt: "2025-04-28T11:02:00Z" },
  { id: "msg4", senderId: "ME", sender: { first_name: "Me", last_name: "" }, avatar: "ME", time: "11:10 AM", content: "Great progress! Let's sync at 3 PM for a quick standup.", isMe: true, createdAt: "2025-04-28T11:10:00Z" },
]

const MOCK_CLIENT_MSGS = [
  { id: "cm1", senderId: "client_01", sender: { first_name: "Rahul", last_name: "Kapoor" }, avatar: "RK", time: "9:00 AM", content: "Hi team, can you share the latest sprint progress report?", createdAt: "2025-04-27T09:00:00Z" },
  { id: "cm2", senderId: "ME", sender: { first_name: "Me", last_name: "" }, avatar: "ME", time: "9:15 AM", content: "Sure! We're at 62% overall. API is 70% done, UI components at 55%. Full report by EOD.", isMe: true, createdAt: "2025-04-27T09:15:00Z" },
]

const STATUS_META = {
  OPEN: { label: "Open", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  DELAYED: { label: "Delayed", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  COMPLETED: { label: "Completed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  CANCELLED: { label: "Cancelled", color: "bg-muted text-muted-foreground" },
}
const TASK_COL_META = {
  open: { label: "Open", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-400", accent: "border-t-slate-400" },
  in_progress: { label: "In Progress", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", dot: "bg-blue-500", accent: "border-t-blue-500" },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", dot: "bg-emerald-500", accent: "border-t-emerald-500" },
}
const FILE_CFG = {
  figma: { icon: Zap, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  doc: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  image: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
}

export default function OrgAdminProjectPage({ params }) {
  const { slug } = use(params);
  const { userData, loading } = useAuth();
  const [project, setProject] = useState(MOCK_PROJECT)
  const [tasks, setTasks] = useState(MOCK_TASKS_INITIAL)
  const [applications, setApplications] = useState(MOCK_PROJ_APPS)
  const [chatMsgs, setChatMsgs] = useState(MOCK_CHAT_MSGS)
  const [clientMsgs, setClientMsgs] = useState(MOCK_CLIENT_MSGS)
  const [activeTab, setActiveTab] = useState("overview")
  const [chatInput, setChatInput] = useState("")

  // Dialogs
  const [taskDialog, setTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [outsourceDialog, setOutsourceDialog] = useState(false)
  const [outsourceTarget, setOutsourceTarget] = useState(null)
  const [taskAppsDialog, setTaskAppsDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [msgClientDialog, setMsgClientDialog] = useState(false)
  const [addMemberDialog, setAddMemberDialog] = useState(false)
  const [notFound, setNotFound] = useState(false);

  // Kanban drag
  const dragItem = useRef(null)
  const dragOverColumn = useRef(null)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    if (loading || !userData) return;
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/admin/project/detail/${slug}`, {
          method: "GET",
          credentials: "include",
          headers: {
            orgId: userData?.orgId,
          },
        })
        const project = await res.json()

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        console.log("Fetched project data:", project);
        // setProject(project)

      } catch (error) {
        console.error("Error fetching project data:", error);
        setNotFound(true);

      }
    }

    fetchData();
  }, [loading, userData])

  // if (notFound) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
  //         <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
  //         <p className="text-zinc-600 dark:text-zinc-400 mb-4">
  //           The project you are looking for does not exist or has been removed.
  //         </p>
  //         <Button variant="outline" onClick={() => window.history.back()}>
  //           Go Back
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }


  const allTasks = [...tasks.open, ...tasks.in_progress, ...tasks.completed]
  const totalTasks = allTasks.length
  const doneTasks = tasks.completed.length
  const daysRemaining = daysLeft(project.deadline)
  const isOpen = project.status === "OPEN"
  const isInProgress = project.status === "IN_PROGRESS"
  const isDelayed = project.status === "DELAYED"
  const isCompleted = project.status === "COMPLETED"
  const isCancelled = project.status === "CANCELLED"
  const isActive = isOpen || isInProgress || isDelayed
  const pendingProjApps = applications.filter(a => a.status === "PENDING")
  const acceptedApp = applications.find(a => a.status === "ACCEPTED")
  const totalPendingTaskApps = allTasks.reduce((s, t) => s + (t.applications || []).filter(a => a.status === "PENDING").length, 0)
  const outsourcedCount = allTasks.filter(t => t.taskType === "OUTSOURCED").length

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatMsgs])

  // ── Task CRUD ──
  function handleSaveTask(form, memberIds, task) {
    const colKey = form.column
    const obj = {
      task_id: task ? task.task_id : `tk${Date.now()}`,
      title: form.title, description: form.description,
      status: colKey, taskType: task?.taskType || "INTERNAL",
      progress: task?.progress || 0, projectId: project.project_id,
      createdAt: task?.createdAt || new Date().toISOString(),
      assignments: memberIds.map((uid, i) => ({ id: `a${Date.now()}${i}`, userId: uid, role: "Member", status: "assigned" })),
      applications: task?.applications || [], outsource: task?.outsource || null,
    }
    setTasks(prev => {
      const next = { open: [...prev.open], in_progress: [...prev.in_progress], completed: [...prev.completed] }
      if (task) Object.keys(next).forEach(k => { next[k] = next[k].filter(t => t.task_id !== task.task_id) })
      next[colKey] = [...(next[colKey] || []), obj]
      return next
    })
    // API: projectAPI.createTask / updateTask
  }

  function handleDeleteTask(taskId, col) {
    setTasks(prev => ({ ...prev, [col]: prev[col].filter(t => t.task_id !== taskId) }))
    // API: projectAPI.deleteTask(taskId)
  }

  function handleDrop(toCol) {
    if (!dragItem.current) return
    const { task, fromCol } = dragItem.current
    if (fromCol === toCol) { dragItem.current = null; return }
    setTasks(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.task_id !== task.task_id),
      [toCol]: [...prev[toCol], { ...task, status: toCol }],
    }))
    dragItem.current = null
    // API: projectAPI.updateTask(task.task_id, { status: toCol })
  }

  // ── Outsource ──
  function handleOutsource(taskId, form) {
    const outsourceData = { budget: Number(form.budget), paymentType: form.paymentType, deadline: form.deadline, description: form.description, postedAt: new Date().toISOString() }
    setTasks(prev => {
      const next = { open: [...prev.open], in_progress: [...prev.in_progress], completed: [...prev.completed] }
      Object.keys(next).forEach(col => {
        next[col] = next[col].map(t => t.task_id === taskId ? { ...t, taskType: "OUTSOURCED", outsource: outsourceData } : t)
      })
      return next
    })
    // API: projectAPI.outsourceTask(taskId, outsourceData)
  }

  // ── Task application ──
  function handleUpdateTaskApp(appId, status, taskId) {
    const update = (col) => col.map(t => t.task_id !== taskId ? t : {
      ...t, applications: t.applications.map(a => a.id === appId ? { ...a, status } : a)
    })
    setTasks(prev => ({ open: update(prev.open), in_progress: update(prev.in_progress), completed: update(prev.completed) }))
    setSelectedTask(prev => prev ? { ...prev, applications: prev.applications.map(a => a.id === appId ? { ...a, status } : a) } : prev)
    // API: projectAPI.updateTaskApplicationStatus(appId, status)
  }

  // ── Team chat ──
  function sendChatMessage() {
    if (!chatInput.trim()) return
    setChatMsgs(prev => [...prev, {
      id: `msg${Date.now()}`, senderId: "ME", sender: { first_name: "Me", last_name: "" }, avatar: "ME",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      content: chatInput.trim(), isMe: true, createdAt: new Date().toISOString(),
    }])
    setChatInput("")
  }

  // Status banner
  const statusBanner = {
    OPEN: { bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", icon: CircleDot, iconColor: "text-emerald-600", title: "Project is Open", desc: "Accepting applications from organisations and freelancers." },
    IN_PROGRESS: { bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", icon: Activity, iconColor: "text-blue-600", title: "Project In Progress", desc: `Assigned to ${acceptedApp?.orgProfile?.org_name || "your team"}. Track tasks below.` },
    DELAYED: { bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", icon: AlertTriangle, iconColor: "text-red-600", title: "Project Delayed", desc: "Deadline has passed. Update timeline or communicate with the client." },
    COMPLETED: { bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", icon: BadgeCheck, iconColor: "text-purple-600", title: "Project Completed", desc: `Completed on ${fmtDate(project.completionDate)}. Payment released.` },
    CANCELLED: { bg: "bg-muted border-border", icon: Ban, iconColor: "text-muted-foreground", title: "Project Cancelled", desc: "This project has been cancelled." },
  }[project.status]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
                <StatusBadge status={project.status} />
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
                {project.skills.map(s => <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>)}
                {project.industry.map(i => <Badge key={i.id} variant="outline" className="text-xs gap-1"><Building2 className="h-2.5 w-2.5" />{i.name}</Badge>)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {pendingProjApps.length > 0 && (
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" onClick={() => setActiveTab("applications")}>
                  <Users className="h-3.5 w-3.5" />{pendingProjApps.length} Pending
                </Button>
              )}
              {totalPendingTaskApps > 0 && (
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400" onClick={() => setActiveTab("tasks")}>
                  <Inbox className="h-3.5 w-3.5" />{totalPendingTaskApps} Task Apps
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs gap-2"><RefreshCw className="h-3.5 w-3.5" />Refresh</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2"><Download className="h-3.5 w-3.5" />Export Report</DropdownMenuItem>
                  {isActive && <><DropdownMenuSeparator /><DropdownMenuItem className="text-xs gap-2 text-red-600"><Ban className="h-3.5 w-3.5" />Cancel Project</DropdownMenuItem></>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {statusBanner && (
            <div className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border", statusBanner.bg)}>
              <statusBanner.icon className={cn("h-4 w-4 shrink-0 mt-0.5", statusBanner.iconColor)} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{statusBanner.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{statusBanner.desc}</p>
              </div>
              {isInProgress && (
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-lg font-bold text-blue-600">{project.progress}%</p>
                </div>
              )}
            </div>
          )}

          {isActive && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Overall Progress</span>
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
              { value: "tasks", icon: SquareKanban, label: "Tasks", count: totalPendingTaskApps },
              { value: "team", icon: Users, label: "Team" },
              ...(isOpen ? [{ value: "applications", icon: Inbox, label: "Applications", count: pendingProjApps.length }] : []),
              { value: "files", icon: Paperclip, label: "Files" },
              { value: "chat", icon: MessageSquare, label: "Chat" },
              { value: "details", icon: Layers, label: "Details" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs h-7 px-3">
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none">{tab.count}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ══ OVERVIEW ══ */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={ClipboardList} label="Total Tasks" value={totalTasks} sub={`${doneTasks} completed`} accent="bg-blue-500" />
              <StatCard icon={Users} label="Team Members" value={MOCK_ORG_MEMBERS.length} sub="Active on project" accent="bg-violet-500" />
              <StatCard icon={DollarSign} label="Budget" value={project.finalPrice ? fmtCur(project.finalPrice) : "—"} sub={`Max: ${fmtCur(project.maxBudget)}`} accent="bg-emerald-500" />
              <StatCard icon={Timer} label="Days Left" value={daysRemaining < 0 ? "Overdue" : daysRemaining} sub={daysRemaining < 0 ? `${Math.abs(daysRemaining)}d past deadline` : "until deadline"} accent="bg-orange-500" highlight={daysRemaining < 5 && !isCompleted} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2"><AlignLeft className="h-4 w-4 text-muted-foreground" />Project Description</CardTitle></CardHeader>
                <Separator />
                <CardContent className="pt-4"><p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" />Financial Snapshot</CardTitle></CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-2.5">
                  {[
                    { label: "Min Budget", val: fmtCur(project.minBudget) },
                    { label: "Max Budget", val: fmtCur(project.maxBudget) },
                    { label: "Final Price", val: project.finalPrice ? fmtCur(project.finalPrice) : "—", highlight: true },
                    { label: "Platform Fee (5%)", val: project.finalPrice ? fmtCur(project.finalPrice * 0.05) : "—" },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                      <span className={cn("text-xs font-semibold", r.highlight && "text-primary")}>{r.val}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Payable</span>
                    <span className="font-bold text-sm text-primary">{project.finalPrice ? fmtCur(project.finalPrice * 1.05) : "—"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><SquareKanban className="h-4 w-4 text-muted-foreground" />Task Summary</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => setActiveTab("tasks")}>View Board <ChevronRight className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "open", label: "Open", color: "bg-muted text-muted-foreground", bar: "bg-slate-400" },
                    { key: "in_progress", label: "In Progress", color: "bg-blue-50 text-blue-700", bar: "bg-blue-500" },
                    { key: "completed", label: "Completed", color: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
                  ].map(col => (
                    <div key={col.key} className="text-center space-y-2">
                      <div className={cn("rounded-xl py-4 px-2", col.color)}>
                        <p className="text-2xl font-bold">{tasks[col.key].length}</p>
                        <p className="text-xs mt-0.5">{col.label}</p>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", col.bar)} style={{ width: totalTasks ? `${(tasks[col.key].length / totalTasks) * 100}%` : "0%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ TASKS KANBAN ══ */}
          <TabsContent value="tasks" className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-sm">Task Board</h2>
                <Badge variant="outline" className="text-xs">{totalTasks} tasks</Badge>
                {outsourcedCount > 0 && (
                  <Badge className="text-xs border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 gap-1">
                    <Globe className="h-3 w-3" />{outsourcedCount} outsourced
                  </Badge>
                )}
                {isCompleted && <Badge className="text-xs bg-muted text-muted-foreground border-0 gap-1"><Lock className="h-3 w-3" />Read-only</Badge>}
              </div>
              {!isCompleted && !isCancelled && (
                <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => { setEditingTask(null); setTaskDialog(true) }}>
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ key: "open", label: "Open" }, { key: "in_progress", label: "In Progress" }, { key: "completed", label: "Completed" }].map(col => (
                <KanbanColumn
                  key={col.key} col={col} tasks={tasks[col.key]} members={MOCK_ORG_MEMBERS}
                  onAdd={() => { setEditingTask(null); setTaskDialog(true) }}
                  onEdit={task => { setEditingTask(task); setTaskDialog(true) }}
                  onDelete={handleDeleteTask}
                  onOutsource={task => { setOutsourceTarget(task); setOutsourceDialog(true) }}
                  onViewApps={task => { setSelectedTask(task); setTaskAppsDialog(true) }}
                  dragItem={dragItem} dragOverColumn={dragOverColumn}
                  onDrop={() => handleDrop(col.key)}
                />
              ))}
            </div>
          </TabsContent>

          {/* ══ TEAM ══ */}
          <TabsContent value="team" className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">Assigned Members</h2>
              {!isCompleted && !isCancelled && (
                <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setAddMemberDialog(true)}>
                  <UserPlus className="h-3.5 w-3.5" /> Add Member
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_ORG_MEMBERS.map(member => {
                const assigned = allTasks.filter(t => t.assignments?.some(a => a.userId === member.id)).length
                const done = tasks.completed.filter(t => t.assignments?.some(a => a.userId === member.id)).length
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    <div className="h-1 bg-linear-to-r from-primary/40 to-primary" />
                    <CardContent className="pt-4 pb-4 px-4">
                      <div className="flex flex-col items-center text-center gap-3">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{member.jobTitle}</p>
                          <Badge variant="outline" className="text-xs mt-1.5">{member.role}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <div className="rounded-lg bg-muted py-2 text-center">
                            <p className="text-lg font-bold">{assigned}</p>
                            <p className="text-xs text-muted-foreground">Assigned</p>
                          </div>
                          <div className="rounded-lg bg-muted py-2 text-center">
                            <p className="text-lg font-bold text-emerald-600">{done}</p>
                            <p className="text-xs text-muted-foreground">Done</p>
                          </div>
                        </div>
                        <div className="w-full space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Completion</span>
                            <span>{assigned > 0 ? Math.round((done / assigned) * 100) : 0}%</span>
                          </div>
                          <Progress value={assigned > 0 ? (done / assigned) * 100 : 0} className="h-1.5" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5">
                          <MessageSquare className="h-3 w-3" /> Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* ══ APPLICATIONS (OPEN only) ══ */}
          {isOpen && (
            <TabsContent value="applications" className="mt-5 space-y-4">
              <div>
                <h2 className="font-semibold text-sm">Project Applications</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{applications.length} total · {pendingProjApps.length} pending</p>
              </div>
              {applications.length === 0 ? (
                <EmptyState icon={Inbox} title="No applications yet" sub="Applications will appear here once talent applies." />
              ) : (
                <div className="space-y-3">
                  {applications.map(app => (
                    <Card key={app.id} className={cn("border transition-all", app.status === "ACCEPTED" && "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/40")}>
                      <CardContent className="py-4 px-5 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className={cn("font-bold text-sm", app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary")}>
                              {app.orgProfile?.org_name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">{app.orgProfile?.org_name}</p>
                              {app.status === "ACCEPTED" && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                              <AppBadge status={app.status} />
                              <Badge variant="outline" className="text-xs ml-auto gap-1"><Building2 className="h-3 w-3" />{app.applicantType}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{app.orgProfile?.industry}</span>
                              <span>{app.orgProfile?.size} employees</span>
                              <Stars rating={app.orgProfile?.rating} />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-base font-bold">{fmtCur(app.proposedPrice)}</p>
                            <p className="text-xs text-muted-foreground">Proposed</p>
                          </div>
                        </div>
                        {app.coverLetter && <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">{app.coverLetter}</p>}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Applied {fmtDate(app.appliedAt)}</p>
                          {app.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 hover:bg-red-50 hover:border-red-200"
                                onClick={() => setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: "REJECTED" } : a))}>
                                <XSquare className="h-3.5 w-3.5" /> Reject
                              </Button>
                              <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                  setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: "ACCEPTED" } : a.status === "PENDING" ? { ...a, status: "REJECTED" } : a))
                                  setProject(p => ({ ...p, status: "IN_PROGRESS", assignedToId: app.applicantId, finalPrice: app.proposedPrice }))
                                }}>
                                <CheckSquare className="h-3.5 w-3.5" /> Accept
                              </Button>
                            </div>
                          )}
                          {app.status === "ACCEPTED" && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5" />Accepted</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* ══ FILES ══ */}
          <TabsContent value="files" className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Project Files</h2>
              {!isCompleted && !isCancelled && <Button size="sm" className="gap-1.5 text-xs h-8"><Upload className="h-3.5 w-3.5" /> Upload File</Button>}
            </div>
            {project.files?.length > 0 ? (
              <div className="space-y-2">
                {project.files.map(file => {
                  const fc = FILE_CFG[file.type] || { icon: File, color: "text-muted-foreground", bg: "bg-muted" }
                  return (
                    <Card key={file.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2.5 rounded-lg shrink-0", fc.bg)}><fc.icon className={cn("h-4 w-4", fc.color)} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} · {file.uploadedBy} · {fmtDate(file.date, { month: "short", day: "numeric" })}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0"><ExternalLink className="h-3 w-3" /> Open</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon={Paperclip} title="No files yet" sub="Upload project files, designs, and documents here." />
            )}
          </TabsContent>

          {/* ══ CHAT ══  ← FIXED: explicit flex column, min-h-0, no ScrollArea */}
          <TabsContent value="chat" className="mt-5">
            <Card
              className="overflow-hidden"
              style={{ height: "calc(100vh - 340px)", minHeight: "480px", display: "flex", flexDirection: "column" }}
            >
              {/* Header — shrink-0 so it never collapses */}
              <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Project Chat</p>
                <Badge variant="outline" className="text-xs ml-auto">{MOCK_ORG_MEMBERS.length + 1} members</Badge>
              </div>

              {/* Messages — flex-1 + overflow-y-auto + min-h-0 (critical!) */}
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
                      <div className={cn("rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", msg.isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm")}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Input — shrink-0 so it always stays at bottom */}
              <div className="px-3 py-3 border-t shrink-0">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 h-9 text-sm"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage() } }}
                  />
                  <Button size="sm" className="h-9 px-3 gap-1.5 text-xs" onClick={sendChatMessage} disabled={!chatInput.trim()}>
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
                <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" />Project Info</CardTitle></CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-2.5">
                  {[
                    { label: "Project ID", value: project.project_id },
                    { label: "Type", value: project.projectType },
                    { label: "Visibility", value: project.visibility },
                    { label: "Assigned To", value: project.assignedType || "—" },
                    { label: "Experience", value: project.experienceLevel || "—" },
                    { label: "Created", value: fmtDate(project.createdAt) },
                    { label: "Last Updated", value: fmtDate(project.updatedAt) },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-medium text-right max-w-[60%] truncate">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Client card — Message Client opens the dialog */}
              <Card>
                <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />Client Info</CardTitle></CardHeader>
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
                      <Stars rating={project.client.rating} />
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    {[
                      { label: "Email", value: project.client.user?.email },
                      { label: "Phone", value: project.client.user?.phone },
                      { label: "Country", value: project.client.country },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{row.label}</span>
                        <span className="text-xs font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mb-3" />
                  {/* ← Opens MessageClientDialog */}
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5" onClick={() => setMsgClientDialog(true)}>
                    <MessageSquare className="h-3.5 w-3.5" /> Message Client
                  </Button>
                </CardContent>
              </Card>
            </div>

            {isCompleted && (
              <Card>
                <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" />Client Review</CardTitle></CardHeader>
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

      {/* ══ ALL DIALOGS ══ */}

      <TaskDialog open={taskDialog} onOpenChange={setTaskDialog} editTask={editingTask} members={MOCK_ORG_MEMBERS} onSave={handleSaveTask} />

      <OutsourceDialog open={outsourceDialog} onOpenChange={setOutsourceDialog} task={outsourceTarget} onConfirm={handleOutsource} />

      <TaskAppsDialog
        open={taskAppsDialog}
        onOpenChange={setTaskAppsDialog}
        task={selectedTask}
        onUpdateApp={handleUpdateTaskApp}
      />

      <MessageClientDialog
        open={msgClientDialog}
        onOpenChange={setMsgClientDialog}
        client={project.client}
        initialMessages={clientMsgs}
      />

      <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Add Member to Project</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Search by name or email..." className="h-9 text-sm" />
            <EmptyState icon={Users} title="Search for a member" sub="Type a name or email to find organisation members." />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddMemberDialog(false)}>Cancel</Button>
            <Button size="sm">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000)
const fmtDate = (d, opts = {}) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts }) : "—"
const fmtCur = (n) => `₹${Number(n).toLocaleString("en-IN")}`
const fullName = (u) => `${u?.first_name || ""} ${u?.last_name || ""}`.trim()

// ══════════════════════════════════════════════════════════════
// ─── SHARED ATOMS
// ══════════════════════════════════════════════════════════════
function StatusBadge({ status }) {
  const m = STATUS_META[status] || { label: status, color: "" }
  return <Badge className={cn("border-0 font-semibold text-xs", m.color)}>{m.label}</Badge>
}
function AppBadge({ status }) {
  const c = { PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" }[status] || ""
  return <Badge className={cn("text-xs border-0 font-semibold", c)}>{status}</Badge>
}
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("h-3 w-3", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />)}
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

// ══════════════════════════════════════════════════════════════
// ─── OUTSOURCE DIALOG  ← new
// ══════════════════════════════════════════════════════════════
function OutsourceDialog({ open, onOpenChange, task, onConfirm }) {
  const [form, setForm] = useState({ budget: "", paymentType: "Fixed", deadline: "", description: "" })
  useEffect(() => {
    if (task) setForm({ budget: "", paymentType: "Fixed", deadline: "", description: task.description || "" })
  }, [task, open])
  if (!task) return null
  const valid = form.budget && form.deadline

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-blue-500" /> Outsource to Freelancers
          </DialogTitle>
          <DialogDescription className="text-xs">Post this task publicly so freelancers can apply with proposals.</DialogDescription>
        </DialogHeader>

        {/* Task preview chip */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
            <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{task.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{task.description}</p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Requirements for Freelancer</Label>
            <Textarea
              placeholder="Describe exactly what you need the freelancer to deliver..."
              rows={3}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Budget (₹) <span className="text-red-500">*</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
                <Input type="number" placeholder="0" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className="h-9 pl-7 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Payment Type</Label>
              <Select value={form.paymentType} onValueChange={v => setForm(p => ({ ...p, paymentType: v }))}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed Price</SelectItem>
                  <SelectItem value="Hourly">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Freelancer Deadline <span className="text-red-500">*</span></Label>
            <Input type="date" value={form.deadline} min={new Date().toISOString().split("T")[0]} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="h-9 text-sm" />
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Globe className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              The task will be marked <strong>Outsourced</strong> and listed publicly for freelancers. You can review incoming applications directly from the task card.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="gap-1.5" disabled={!valid} onClick={() => { onConfirm(task.task_id, form); onOpenChange(false) }}>
            <Globe className="h-3.5 w-3.5" /> Post for Freelancers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── TASK APPLICATIONS DIALOG  ← improved
// ══════════════════════════════════════════════════════════════
function TaskAppsDialog({ open, onOpenChange, task, onUpdateApp }) {
  const [filter, setFilter] = useState("ALL")
  useEffect(() => { if (open) setFilter("ALL") }, [open])
  if (!task) return null

  const apps = task.applications || []
  const filtered = filter === "ALL" ? apps : apps.filter(a => a.status === filter)
  const counts = { ALL: apps.length, PENDING: apps.filter(a => a.status === "PENDING").length, ACCEPTED: apps.filter(a => a.status === "ACCEPTED").length, REJECTED: apps.filter(a => a.status === "REJECTED").length }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Inbox className="h-4 w-4 text-blue-500" /> Freelancer Applications
          </DialogTitle>
          <DialogDescription className="text-xs mt-1">
            <span className="font-semibold text-foreground">"{task.title}"</span>
            {task.outsource && <span className="text-muted-foreground"> · {fmtCur(task.outsource.budget)} {task.outsource.paymentType} · Due {fmtDate(task.outsource.deadline, { month: "short", day: "numeric" })}</span>}
          </DialogDescription>
        </DialogHeader>

        {apps.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("text-xs px-2.5 py-1 rounded-full border font-medium transition-colors",
                  filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40"
                )}>
                {f} ({counts[f]})
              </button>
            ))}
          </div>
        )}

        <ScrollArea className="max-h-[52vh]">
          <div className="space-y-3 pr-1">
            {filtered.length === 0 ? (
              <EmptyState icon={Inbox} title="No applications" sub="Freelancers haven't applied to this task yet." />
            ) : filtered.map(app => (
              <Card key={app.id} className={cn("border", app.status === "ACCEPTED" && "border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/50")}>
                <CardContent className="py-3.5 px-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={cn("text-xs font-bold", app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary")}>
                          {app.freelancer?.first_name?.[0]}{app.freelancer?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold">{fullName(app.freelancer)}</p>
                          {app.status === "ACCEPTED" && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                          <AppBadge status={app.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{app.freelancer?.title || app.freelancer?.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{fmtCur(app.proposedPrice)}</p>
                      <p className="text-xs text-muted-foreground">proposed</p>
                    </div>
                  </div>
                  {app.coverLetter && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 leading-relaxed">{app.coverLetter}</p>
                  )}
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-xs text-muted-foreground">Applied {fmtDate(app.appliedAt, { month: "short", day: "numeric" })}</p>
                    {app.status === "PENDING" && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => onUpdateApp(app.id, "REJECTED", task.task_id)}>
                          <XSquare className="h-3.5 w-3.5" /> Reject
                        </Button>
                        <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onUpdateApp(app.id, "ACCEPTED", task.task_id)}>
                          <CheckSquare className="h-3.5 w-3.5" /> Accept
                        </Button>
                      </div>
                    )}
                    {app.status === "ACCEPTED" && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5" />Assigned</span>}
                    {app.status === "REJECTED" && <span className="text-xs text-muted-foreground">Rejected</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── TASK CARD  ← outsource button + applications pill
// ══════════════════════════════════════════════════════════════
function TaskCard({ task, members, onEdit, onDelete, onOutsource, onViewApps, dragItem, colKey }) {
  const assignees = (task.assignments || []).map(a => members.find(m => m.id === a.userId)).filter(Boolean)
  const apps = task.applications || []
  const pendingApps = apps.filter(a => a.status === "PENDING").length
  const isOut = task.taskType === "OUTSOURCED"
  const sm = TASK_COL_META[task.status] || TASK_COL_META.open

  return (
    <Card
      className={cn("cursor-grab active:cursor-grabbing hover:shadow-md transition-all border bg-card", isOut && "border-blue-200 dark:border-blue-900/40")}
      draggable onDragStart={() => { dragItem.current = { task, fromCol: colKey } }}
    >
      <CardContent className="py-3 px-3.5 space-y-2">
        {/* Title */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={cn("h-2 w-2 rounded-full shrink-0 mt-1.5", sm.dot)} />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">{task.title}</p>
              {isOut && (
                <Badge className="mt-0.5 text-xs border-0 h-4 px-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 gap-1">
                  <Globe className="h-2.5 w-2.5" />Outsourced
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={onEdit} className="gap-2"><Edit2 className="h-3.5 w-3.5" />Edit Task</DropdownMenuItem>
              {!isOut
                ? <DropdownMenuItem onClick={onOutsource} className="gap-2 text-blue-600"><Globe className="h-3.5 w-3.5" />Outsource to Freelancers</DropdownMenuItem>
                : <DropdownMenuItem onClick={onViewApps} className="gap-2 text-blue-600"><Inbox className="h-3.5 w-3.5" />View Applications ({apps.length})</DropdownMenuItem>
              }
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-600"><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && <p className="text-xs text-muted-foreground line-clamp-2 pl-4">{task.description}</p>}

        {/* Outsource meta */}
        {isOut && task.outsource && (
          <div className="pl-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{fmtCur(task.outsource.budget)}</span>
            <span className="flex items-center gap-1"><Timer className="h-3 w-3" />Due {fmtDate(task.outsource.deadline, { month: "short", day: "numeric" })}</span>
          </div>
        )}

        {task.progress > 0 && (
          <div className="pl-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{task.progress}%</span></div>
            <Progress value={task.progress} className="h-1" />
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between pl-4 pt-0.5">
          <div className="flex -space-x-1.5">
            {assignees.slice(0, 3).map(m => (
              <Avatar key={m.id} className="h-5 w-5 border-2 border-background" title={m.name}>
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{m.avatar}</AvatarFallback>
              </Avatar>
            ))}
            {assignees.length === 0 && <div className="h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground/40" title="Unassigned" />}
          </div>
          {isOut && (
            <button
              onClick={onViewApps}
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-colors",
                pendingApps > 0
                  ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Inbox className="h-3 w-3" />{apps.length} {pendingApps > 0 && <span className="font-bold">({pendingApps} new)</span>}
            </button>
          )}
        </div>

        {/* Outsource CTA for internal tasks */}
        {!isOut && (
          <button
            onClick={onOutsource}
            className="w-full mt-1 flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-1.5 rounded-md transition-colors border border-dashed border-blue-200 dark:border-blue-900/40"
          >
            <Globe className="h-3 w-3" /> Outsource to Freelancers
          </button>
        )}

        {task.review && (
          <p className="pl-4 text-xs text-muted-foreground bg-muted/40 rounded-md px-2 py-1.5 italic line-clamp-1">"{task.review}"</p>
        )}
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── KANBAN COLUMN
// ══════════════════════════════════════════════════════════════
function KanbanColumn({ col, tasks, members, onAdd, onEdit, onDelete, onOutsource, onViewApps, dragItem, dragOverColumn, onDrop }) {
  const sm = TASK_COL_META[col.key]
  const outsourcedCount = tasks.filter(t => t.taskType === "OUTSOURCED").length
  return (
    <div className="flex flex-col gap-3 min-w-0" onDragOver={e => { e.preventDefault(); dragOverColumn.current = col.key }} onDrop={onDrop}>
      <div className={cn("rounded-lg border-t-2 bg-muted/40 px-3 py-2.5 flex items-center justify-between", sm.accent)}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold">{col.label}</span>
          <Badge className={cn("text-xs h-5 px-1.5 border-0", sm.color)}>{tasks.length}</Badge>
          {outsourcedCount > 0 && (
            <Badge className="text-xs h-5 px-1.5 border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 gap-0.5">
              <Globe className="h-2.5 w-2.5" />{outsourcedCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-2 min-h-24">
        {tasks.map(task => (
          <TaskCard
            key={task.task_id}
            task={task} colKey={col.key} members={members}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.task_id, col.key)}
            onOutsource={() => onOutsource(task)}
            onViewApps={() => onViewApps(task)}
            dragItem={dragItem}
          />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed rounded-lg p-4 text-center text-xs text-muted-foreground">Drop tasks here</div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── TASK CREATE / EDIT DIALOG
// ══════════════════════════════════════════════════════════════
function TaskDialog({ open, onOpenChange, editTask, members, onSave }) {
  const [form, setForm] = useState({ title: "", description: "", column: "open" })
  const [selMembers, setSelMembers] = useState([])
  useEffect(() => {
    if (editTask) { setForm({ title: editTask.title, description: editTask.description, column: editTask.status }); setSelMembers(editTask.assignments?.map(a => a.userId) || []) }
    else { setForm({ title: "", description: "", column: "open" }); setSelMembers([]) }
  }, [editTask, open])

  const toggleMember = (id) => setSelMembers(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Title *</Label>
            <Input placeholder="Task title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea placeholder="Describe what needs to be done..." rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Column</Label>
            <Select value={form.column} onValueChange={v => setForm(p => ({ ...p, column: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Assign Members</Label>
            <div className="grid grid-cols-2 gap-2">
              {members.map(m => (
                <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
                  className={cn("flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all", selMembers.includes(m.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                  <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="text-xs bg-primary/10 text-primary">{m.avatar}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.jobTitle}</p>
                  </div>
                  {selMembers.includes(m.id) && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" disabled={!form.title.trim()} onClick={() => { onSave(form, selMembers, editTask); onOpenChange(false) }}>
            {editTask ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── MESSAGE CLIENT DIALOG  ← new, proper chat UX
// ══════════════════════════════════════════════════════════════
function MessageClientDialog({ open, onOpenChange, client, initialMessages }) {
  const [msgs, setMsgs] = useState(initialMessages || [])
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => { if (open) setMsgs(initialMessages || []) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  function send() {
    if (!input.trim()) return
    setMsgs(prev => [...prev, {
      id: `cm${Date.now()}`, senderId: "ME", sender: { first_name: "Me", last_name: "" }, avatar: "ME",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      content: input.trim(), isMe: true, createdAt: new Date().toISOString(),
    }])
    setInput("")
  }

  const clientName = client ? fullName(client.user) : "Client"
  const clientInitials = `${client?.user?.first_name?.[0] || ""}${client?.user?.last_name?.[0] || ""}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* No padding on DialogContent — we manage all spacing inside */}
      <DialogContent
        className="sm:max-w-md p-0 gap-0 overflow-hidden"
        style={{ maxHeight: "82vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">{clientInitials || "CL"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{clientName}</p>
            <p className="text-xs text-muted-foreground">{client?.org_name || ""}</p>
          </div>
          <div className="flex items-center gap-1.5 mr-6">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Message area — flex-1 + overflow-y-auto, min-h-0 prevents flex blowout */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-4">
          {msgs.length === 0 && (
            <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
              <MessageSquare className="h-8 w-8 opacity-30" />
              <p className="text-xs">No messages yet. Start the conversation.</p>
            </div>
          )}
          {msgs.map(msg => (
            <div key={msg.id} className={cn("flex gap-2.5", msg.isMe && "flex-row-reverse")}>
              <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{msg.avatar}</AvatarFallback>
              </Avatar>
              <div className={cn("space-y-1 max-w-[75%]", msg.isMe && "items-end flex flex-col")}>
                <div className="flex items-center gap-1.5">
                  {!msg.isMe && <span className="text-xs font-medium">{fullName(msg.sender)}</span>}
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <div className={cn("rounded-2xl px-3 py-2 text-sm leading-relaxed", msg.isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm")}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input — always pinned to bottom */}
        <div className="px-3 py-3 border-t bg-background shrink-0">
          <div className="flex items-center gap-2">
            <Input
              placeholder={`Message ${clientName}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
              className="flex-1 h-9 text-sm"
              autoFocus
            />
            <Button size="sm" className="h-9 w-9 p-0 shrink-0" onClick={send} disabled={!input.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 pl-1">Press Enter to send</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ══════════════════════════════════════════════════════════════
// ─── MAIN PAGE
// ══════════════════════════════════════════════════════════════
