"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import {
  Calendar,
  Clock,
  IndianRupee,
  User,
  Building2,
  Users,
  ArrowRepeat,
  Briefcase,
  Layers,
  Star,
  CheckCircle2,
  Circle,
  Tag,
  Wrench,
  Globe,
  Lock,
  Send,
  FileText,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  MapPin,
  Award,
  BadgeCheck,
  BarChart2,
  ListChecks,
  Timer,
  Zap,
  Eye,
  Flag,
  Hash,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const MOCK_AUTH = {
  isLoggedIn: true,
  userType: "freelancer", // null | "freelancer" | "organization" | "client"
};

// ─── Mock Project Data (maps to Prisma model) ─────────────────────────────────
const PROJECT = {
  project_id: "proj_9f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  title: "AI-Powered Customer Support Chatbot",
  description: `We are building an intelligent, multi-turn customer support chatbot for our B2B SaaS helpdesk platform. The system must handle thousands of concurrent sessions, support both Hindi and English, integrate deeply with our Freshdesk and Zendesk APIs, and escalate edge cases to human agents with full context handoff.

The deliverable includes a production-ready backend with LangChain orchestration, a fine-tuned LLM layer (GPT-4o or equivalent), a React-based admin dashboard for monitoring conversations, full API documentation, deployment on AWS EKS, and 60 days of post-launch support.

We expect clean, well-tested code with >80% test coverage, CI/CD pipelines already set up, and comprehensive handover documentation. NDA will be required before project kick-off.`,

  // Client
  client: {
    id: "usr_client_001",
    name: "Vikram Anand",
    company: "TechVentures Pvt. Ltd.",
    initials: "VA",
    rating: 4.7,
    projectsPosted: 14,
    memberSince: "Jan 2023",
  },

  // Assignment (null if not yet assigned)
  assignedToId: null,
  assignedAt: null,
  assignedType: null, // "FREELANCER" | "ORGANIZATION"

  // Visibility
  visibility: "BOTH", // "FREELANCER" | "ORGANIZATION" | "BOTH"

  // Status
  status: "OPEN", // "OPEN" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED" | "CANCELLED"

  // Budget
  minBudget: 75000,
  maxBudget: 150000,
  finalPrice: null,

  // Dates
  deadline: "2025-07-15",
  startDate: null,
  completionDate: null,
  createdAt: "2025-04-10T09:30:00Z",
  updatedAt: "2025-04-12T14:15:00Z",

  // Project specifics
  experienceLevel: "EXPERT", // "BEGINNER" | "INTERMEDIATE" | "EXPERT"
  projectType: "FIXED", // "FIXED" | "HOURLY"

  // Relations
  industry: ["SaaS", "Fintech", "Healthcare"],
  skills: ["Python", "LangChain", "NLP", "React", "AWS", "Node.js", "PostgreSQL"],

  // Tasks
  tasks: [
    { id: "t1", title: "Requirements & Architecture Design", status: "COMPLETED", priority: "HIGH" },
    { id: "t2", title: "LLM Integration & Fine-tuning", status: "OPEN", priority: "HIGH" },
    { id: "t3", title: "Freshdesk & Zendesk API Integration", status: "OPEN", priority: "HIGH" },
    { id: "t4", title: "Admin Dashboard (React)", status: "OPEN", priority: "MEDIUM" },
    { id: "t5", title: "AWS EKS Deployment & CI/CD", status: "OPEN", priority: "MEDIUM" },
    { id: "t6", title: "Testing & Documentation", status: "OPEN", priority: "LOW" },
  ],
};

const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
};

const VISIBILITY_CONFIG = {
  FREELANCER: { icon: User, label: "Freelancers Only", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800" },
  ORGANIZATION: { icon: Building2, label: "Organizations Only", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" },
  BOTH: { icon: RefreshCw, label: "Open to Both", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" },
};

const EXP_CONFIG = {
  BEGINNER: { label: "Beginner", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" },
  INTERMEDIATE: { label: "Intermediate", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800" },
  EXPERT: { label: "Expert", color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatBudget(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ open, onClose, project, auth }) {
  const [step, setStep] = useState(1);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  function handleSubmit() {
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onClose(); setStep(1); }}>
      <DialogContent className="max-w-lg rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className="h-0.75 bg-zinc-900 dark:bg-zinc-100 w-full" />
        <div className="p-8">
          {step === 1 ? (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  Submit Proposal
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Applying for: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{project.title}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Bid Amount */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Your Bid ({project.projectType === "FIXED" ? "Fixed Price" : "Hourly Rate"})
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                    <Input
                      type="number"
                      placeholder={project.projectType === "FIXED" ? "e.g. 90000" : "e.g. 1200"}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="pl-8 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus-visible:ring-1 focus-visible:ring-zinc-400"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                    Budget range: {formatBudget(project.minBudget)} – {formatBudget(project.maxBudget)}
                  </p>
                </div>

                {/* Proposal */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Cover Letter / Proposal
                  </label>
                  <Textarea
                    placeholder="Describe your approach, relevant experience, and why you're the best fit..."
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    rows={5}
                    className="rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm resize-none focus-visible:ring-1 focus-visible:ring-zinc-400 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                    {proposal.length}/1000 characters
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!bidAmount || !proposal.trim()}
                    className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Submit Proposal
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-none text-zinc-500 dark:text-zinc-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-sm flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Proposal Sent!</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Your proposal has been submitted to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{project.client.name}</span>. You'll be notified when they respond.
              </p>
              <Button
                onClick={() => { onClose(); setStep(1); }}
                className="mt-6 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Auth Gate Modal ───────────────────────────────────────────────────────────
function AuthGateModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className="h-0.75 bg-amber-400 w-full" />
        <div className="p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              You need to log in to apply for projects on WorkHub.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold">
              Log In
            </Button>
            <Button variant="ghost" className="w-full rounded-none text-zinc-500 dark:text-zinc-400 text-sm">
              Create Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectDetailPage({ params }) {
  const auth = MOCK_AUTH;
  const project = PROJECT;
  const [applyOpen, setApplyOpen] = useState(false);
  const [authGateOpen, setAuthGateOpen] = useState(false);

  const status = STATUS_CONFIG[project.status];
  const visibility = VISIBILITY_CONFIG[project.visibility];
  const exp = project.experienceLevel ? EXP_CONFIG[project.experienceLevel] : null;
  const VisibilityIcon = visibility.icon;

  const daysLeft = daysUntil(project.deadline);
  const deadlineUrgent = daysLeft <= 7;
  const deadlinePassed = daysLeft < 0;

  const completedTasks = project.tasks.filter((t) => t.status === "COMPLETED").length;
  const taskProgress = Math.round((completedTasks / project.tasks.length) * 100);

  // Can this user apply?
  function canApply() {
    if (!auth.isLoggedIn) return "login";
    if (auth.userType === "client") return "client_no";
    if (project.visibility === "FREELANCER" && auth.userType === "organization") return "wrong_type";
    if (project.visibility === "ORGANIZATION" && auth.userType === "freelancer") return "wrong_type";
    return "apply";
  }

  const applyState = canApply();

  function handleApplyClick() {
    if (applyState === "login") { setAuthGateOpen(true); return; }
    if (applyState === "apply") { setApplyOpen(true); }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Header Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {/* Status accent */}
              <div className={`h-0.75 w-full ${
                project.status === "OPEN" ? "bg-emerald-400" :
                project.status === "IN_PROGRESS" ? "bg-sky-400" :
                project.status === "UNDER_REVIEW" ? "bg-amber-400" :
                project.status === "COMPLETED" ? "bg-zinc-300 dark:bg-zinc-600" : "bg-red-400"
              }`} />

              <div className="p-7">
                {/* Status + type row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-sm ${status.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-sm ${visibility.color}`}>
                    <VisibilityIcon className="w-3 h-3" />
                    {visibility.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700">
                    {project.projectType === "FIXED" ? (
                      <><FileText className="w-3 h-3" /> Fixed Price</>
                    ) : (
                      <><Timer className="w-3 h-3" /> Hourly</>
                    )}
                  </span>
                  {exp && (
                    <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-sm ${exp.color}`}>
                      <Award className="w-3 h-3" /> {exp.label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-3">
                  {project.title}
                </h1>

                {/* Meta line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Posted {formatDate(project.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Updated {formatDate(project.updatedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {project.project_id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Project Description
              </p>
              <div className="prose-sm max-w-none">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                <Wrench className="w-3 h-3" /> Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-mono px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Industry ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Industries
              </p>
              <div className="flex flex-wrap gap-2">
                {project.industry.map((ind) => (
                  <span
                    key={ind}
                    className="text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 rounded-sm"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            

          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">

            {/* ── Apply / CTA Box ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className={`h-0.75 w-full ${
                applyState === "apply" ? "bg-zinc-900 dark:bg-zinc-100" :
                applyState === "login" ? "bg-amber-400" : "bg-zinc-200 dark:bg-zinc-700"
              }`} />
              <div className="p-6">
                {/* Budget */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                    {project.projectType === "FIXED" ? "Project Budget" : "Hourly Rate"}
                  </p>
                  {project.finalPrice ? (
                    <div>
                      <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {formatBudget(project.finalPrice)}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">Final agreed price</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {formatBudget(project.minBudget)}
                        <span className="text-zinc-300 dark:text-zinc-700 mx-1.5 font-light">–</span>
                        {formatBudget(project.maxBudget)}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">Estimated range</p>
                    </div>
                  )}
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Deadline */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">Deadline</p>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${deadlinePassed ? "text-red-600 dark:text-red-400" : deadlineUrgent ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(project.deadline)}
                  </p>
                  <p className={`text-xs mt-1 font-mono ${deadlinePassed ? "text-red-500 dark:text-red-400" : deadlineUrgent ? "text-amber-500 dark:text-amber-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                    {deadlinePassed
                      ? `Deadline passed ${Math.abs(daysLeft)} days ago`
                      : daysLeft === 0
                      ? "Due today"
                      : `${daysLeft} days remaining`}
                  </p>
                  {deadlineUrgent && !deadlinePassed && (
                    <p className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1.5">
                      <AlertCircle className="w-3 h-3" /> Deadline approaching
                    </p>
                  )}
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Apply CTA */}
                {applyState === "apply" && (
                  <Button
                    onClick={handleApplyClick}
                    className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Proposal
                  </Button>
                )}
                {applyState === "login" && (
                  <Button
                    onClick={handleApplyClick}
                    className="w-full rounded-none bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-2"
                  >
                    <Lock className="w-4 h-4" /> Login to Apply
                  </Button>
                )}
                {applyState === "wrong_type" && (
                  <div className="text-center">
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center justify-center gap-1.5 mb-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Not open for your account type
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      This project is open for{" "}
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">{visibility.label}</span>
                    </p>
                  </div>
                )}
                {applyState === "client" && (
                  <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">
                    You posted this project. You can manage it from your dashboard.
                  </p>
                )}
              </div>
            </div>

            {/* ── Project Details ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Project Details
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Briefcase,
                    label: "Project Type",
                    value: project.projectType === "FIXED" ? "Fixed Price" : "Hourly Rate",
                  },
                  {
                    icon: Eye,
                    label: "Visibility",
                    value: visibility.label,
                  },
                  exp && {
                    icon: Award,
                    label: "Experience",
                    value: exp.label,
                  },
                  {
                    icon: BarChart2,
                    label: "Status",
                    value: status.label,
                  },
                  project.startDate && {
                    icon: Zap,
                    label: "Start Date",
                    value: formatDate(project.startDate),
                  },
                  project.completionDate && {
                    icon: CheckCircle2,
                    label: "Completed",
                    value: formatDate(project.completionDate),
                  },
                ]
                  .filter(Boolean)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            {item.label}
                          </p>
                          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ── About the Client ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                About the Client
              </p>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                  {project.client.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {project.client.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{project.client.company}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Rating
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{project.client.rating} / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <FolderOpen className="w-3 h-3" /> Projects Posted
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{project.client.projectsPosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <BadgeCheck className="w-3 h-3" /> Member Since
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{project.client.memberSince}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />

      {/* ── Modals ── */}
      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        project={project}
        auth={auth}
      />
      <AuthGateModal
        open={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
      />
    </div>
  );
}

// needed for client card
function FolderOpen({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  );
}
