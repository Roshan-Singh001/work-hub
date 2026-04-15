"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import { 
  UserRound,
  Building2,
  CheckCheck,
  Search,
  Lock,

} from "lucide-react";

const MOCK_AUTH = {
  isLoggedIn: true,
  userType: "freelancer", 
};

// Mock Data
const JOBS = [
  {
    id: 1,
    title: "Build AI Chatbot",
    budget: "₹50,000",
    budgetType: "Fixed",
    skills: ["Python", "NLP", "LangChain"],
    targetType: "freelancer",
    deadline: "Jun 15, 2025",
    postedBy: "TechVentures Pvt. Ltd.",
    postedDaysAgo: 2,
    shortDesc:
      "Need an intelligent customer support chatbot integrated with our existing helpdesk. Should handle FAQs and escalate edge cases.",
    fullDesc:
      "We are looking for an experienced AI/ML developer to build a customer support chatbot using LangChain and a fine-tuned LLM. The bot must integrate with Freshdesk API, handle multi-turn conversations, support Hindi + English, and include an admin dashboard to review conversation logs. Deliverables include source code, deployment on AWS, and 30-day post-launch support. NDA required.",
    category: "AI / ML",
    applicants: 8,
    orgLogo: "TC",
  },
  {
    id: 2,
    title: "E-commerce Platform Revamp",
    budget: "₹2,00,000",
    budgetType: "Fixed",
    skills: ["Next.js", "Tailwind CSS", "PostgreSQL"],
    targetType: "organization",
    deadline: "Jul 1, 2025",
    postedBy: "RetailMax India",
    postedDaysAgo: 1,
    shortDesc:
      "Full redesign and rebuild of our B2B e-commerce portal. Current system is legacy PHP — we want a modern stack with better performance.",
    fullDesc:
      "RetailMax is India's leading B2B distribution company. We need a complete platform overhaul: new Next.js frontend, PostgreSQL database migration, custom inventory management, role-based dealer access, real-time pricing engine, and GST-compliant invoicing. Project includes 3 months of post-launch SLA. Only registered agencies or development firms should apply — individual freelancers will not be considered for this scope.",
    category: "Web Development",
    applicants: 3,
    orgLogo: "RM",
  },
  {
    id: 3,
    title: "Mobile App for Field Sales Team",
    budget: "₹80,000",
    budgetType: "Fixed",
    skills: ["React Native", "Firebase", "Maps API"],
    targetType: "both",
    deadline: "Jun 28, 2025",
    postedBy: "Bharat FMCG Ltd.",
    postedDaysAgo: 4,
    shortDesc:
      "Offline-capable Android app for tracking field sales reps, route planning, and daily report submission.",
    fullDesc:
      "Bharat FMCG requires a React Native app for 200+ field sales representatives. Key features: GPS-based check-in/out, offline data sync, daily sales report forms, manager dashboard (web), real-time location tracking on map, push notifications, and integration with our existing SAP backend via REST API. Both solo developers and small agencies may apply. We will shortlist 3 candidates for a paid trial task.",
    category: "Mobile",
    applicants: 14,
    orgLogo: "BF",
  },
  {
    id: 4,
    title: "Brand Identity & UI Kit",
    budget: "₹35,000",
    budgetType: "Fixed",
    skills: ["Figma", "Branding", "Design Systems"],
    targetType: "freelancer",
    deadline: "May 30, 2025",
    postedBy: "FinEase Startup",
    postedDaysAgo: 6,
    shortDesc:
      "We're a fintech startup that needs a complete brand identity: logo, color system, typography, and a Figma UI component library.",
    fullDesc:
      "FinEase is building India's first micro-insurance platform for gig workers. We need a designer to craft our brand from scratch — logo design (3 concepts), brand guidelines doc, primary + secondary color system, typography scale, iconography set, and a Figma design system with 40+ components following atomic design principles. We value clean, trustworthy aesthetics. Portfolio of fintech or B2C design work strongly preferred.",
    category: "Design",
    applicants: 21,
    orgLogo: "FE",
  },
  {
    id: 5,
    title: "Data Analytics Dashboard",
    budget: "₹1,20,000",
    budgetType: "Fixed",
    skills: ["Python", "Power BI", "SQL", "ETL"],
    targetType: "both",
    deadline: "Jul 10, 2025",
    postedBy: "LogiTrak Solutions",
    postedDaysAgo: 3,
    shortDesc:
      "End-to-end analytics pipeline for our logistics operations — from raw data ingestion to Power BI executive dashboard.",
    fullDesc:
      "LogiTrak manages last-mile delivery for 15 cities. We need an analytics solution: automated ETL pipeline (Python + Airflow), clean data warehouse on Snowflake, and 5 Power BI dashboards covering operational KPIs, delivery performance, vehicle utilization, cost per delivery, and customer satisfaction trends. Historical data: 3 years, ~50M rows. We require weekly status calls and full handover documentation.",
    category: "Data & Analytics",
    applicants: 7,
    orgLogo: "LT",
  },
  {
    id: 6,
    title: "DevOps & CI/CD Setup",
    budget: "₹60,000",
    budgetType: "Fixed",
    skills: ["Docker", "Kubernetes", "GitHub Actions", "AWS"],
    targetType: "organization",
    deadline: "Jun 20, 2025",
    postedBy: "CloudNative Co.",
    postedDaysAgo: 5,
    shortDesc:
      "Set up production-ready CI/CD pipeline, container orchestration, and monitoring stack for our SaaS product on AWS.",
    fullDesc:
      "CloudNative Co. is a 40-person SaaS company. Our infrastructure is manual and fragile. We need: GitHub Actions pipelines (test → build → deploy), Docker + Kubernetes on AWS EKS, Terraform for IaC, staging + production environment separation, Prometheus + Grafana monitoring, and alerting via PagerDuty. Only agencies or firms with proven DevOps/cloud infrastructure portfolio should apply. References from prior clients required.",
    category: "DevOps",
    applicants: 5,
    orgLogo: "CN",
  },
];

// Target Badge Config 
const TARGET_CONFIG = {
  freelancer: {
    label: "Freelancers",
    icon: UserRound,
    classes:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  organization: {
    label: "Organizations",
    icon: Building2,
    classes:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  both: {
    label: "Both",
    icon: CheckCheck,
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
};

const CATEGORY_COLORS = {
  "AI / ML": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "Web Development": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Mobile: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Design: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  "Data & Analytics": "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  DevOps: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const ORG_LOGO_COLORS = [
  "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
];

export default function FindWork() {
  const { userData, isLoggedIn } = useAuth();
  const auth = MOCK_AUTH;

  const [search, setSearch] = useState("");
  const [targetFilter, setTargetFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibleJobs = useMemo(() => {
    return JOBS.filter((job) => {
      if (userData?.role === "Freelancer") {
        return job.targetType === "freelancer" || job.targetType === "both";
      }
      if (userData?.role === "ORG_Owner") {
        return job.targetType === "organization" || job.targetType === "both";
      }
      return true;
    });
  }, [isLoggedIn, userData]);

  const Ic = TARGET_CONFIG[targetFilter]?.icon;

  const filteredJobs = useMemo(() => {
    return visibleJobs.filter((job) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q)) ||
        job.postedBy.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q);

      const matchesTarget =
        targetFilter === "all" || job.targetType === targetFilter;

      const matchesCategory =
        categoryFilter === "all" || job.category === categoryFilter;

      return matchesSearch && matchesTarget && matchesCategory;
    });
  }, [visibleJobs, search, targetFilter, categoryFilter]);

  const allCategories = [...new Set(JOBS.map((j) => j.category))];

  function handleViewDetails(job) {
    setSelectedJob(job);
    setDialogOpen(true);
  }


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* ── Top Section ── */}
      <div className="mt-24 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 pb-8">

          {/* Heading */}
          <div className="mb-8">
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight">
              Find Work
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm font-light max-w-lg">
              Browse projects from verified organizations.
              {isLoggedIn && userData?.role && (
                <span className="ml-1">
                  Showing jobs open for{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {userData?.role === "Freelancer" ? "Freelancers" : "Organizations"}
                  </span>
                  .
                </span>
              )}
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Search by title, skill, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500 h-10 text-sm"
              />
            </div>

            {/* Target Type Filter */}
            <Select value={targetFilter} onValueChange={setTargetFilter}>
              <SelectTrigger className="w-full sm:w-48 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-10 text-sm focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500">
                <SelectValue placeholder="Target Type" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <SelectItem value="all" className="text-sm">All Types</SelectItem>
                {( !isLoggedIn || userData?.role === "Freelancer") && <SelectItem value="freelancer" className="text-sm">Freelancers</SelectItem>}
                {( !isLoggedIn || userData?.role === "ORG_Owner") && <SelectItem value="organization" className="text-sm">Organizations</SelectItem>}
                {(!isLoggedIn || (userData?.role === "Freelancer" || userData?.role === "ORG_Owner")) && <SelectItem value="both" className="text-sm">Both</SelectItem>}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-10 text-sm focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <SelectItem value="all" className="text-sm">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filter chips */}
          {(targetFilter !== "all" || categoryFilter !== "all" || search) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest">
                Active:
              </span>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  "{search}" <span className="text-zinc-400">×</span>
                </button>
              )}
              {targetFilter !== "all" && (
                <button
                  onClick={() => setTargetFilter("all")}
                  className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {<Ic />} {TARGET_CONFIG[targetFilter]?.label}{" "}
                  <span className="text-zinc-400">×</span>
                </button>
              )}
              {categoryFilter !== "all" && (
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {categoryFilter} <span className="text-zinc-400">×</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSearch("");
                  setTargetFilter("all");
                  setCategoryFilter("all");
                }}
                className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count bar */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 pb-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
            {filteredJobs.length !== visibleJobs.length &&
              ` · ${visibleJobs.length} visible to you`}
          </p>
        </div>
      </div>

      {/* ── Job Grid ── */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <EmptyState query={search} />
          ) : (
            filteredJobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                index={i}
                auth={userData}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      
      </main>

      {/* ── Detail Dialog ── */}
      <JobDetailDialog
        job={selectedJob}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        auth={userData}
      />
    </div>
  );
}

// Apply Button Logic 
function getApplyState(job, auth) {
  if (!auth?.role) return { state: "login_required", label: "Login to Apply" };

  const canApply =
    job.targetType === "both" ||
    job.targetType === auth?.role.toLowerCase() === "freelancer" ? "freelancer" : auth?.role.toLowerCase() === "org_owner" ? "organization" : null;

  if (canApply) return { state: "can_apply", label: "Apply Now" };
  return { state: "wrong_type", label: "Apply Now" };
}

// Job Card 
function JobCard({ job, onViewDetails, auth, index }) {
  const applyState = getApplyState(job, auth);
  const target = TARGET_CONFIG[job.targetType];
  const logoColor = ORG_LOGO_COLORS[index % ORG_LOGO_COLORS.length];
  const router = useRouter();

  return (
    <article
      className="
        group relative flex flex-col
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        hover:border-zinc-400 dark:hover:border-zinc-600
        transition-all duration-200
        hover:shadow-lg dark:hover:shadow-zinc-950
        rounded-none
        overflow-hidden
      "
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`h-0.75 w-full ${
          job.targetType === "freelancer"
            ? "bg-sky-400 dark:bg-sky-500"
            : job.targetType === "organization"
            ? "bg-amber-400 dark:bg-amber-500"
            : "bg-emerald-400 dark:bg-emerald-500"
        }`}
      />

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center text-xs font-black shrink-0 ${logoColor}`}
          >
            {job.orgLogo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight tracking-tight truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
              {job.postedBy} · {job.postedDaysAgo}d ago
            </p>
          </div>
          <Badge
            className={`text-[10px] font-mono shrink-0 border rounded-none px-2 py-0.5 ${
              CATEGORY_COLORS[job.category]
            } border-transparent`}
          >
            {job.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {job.shortDesc}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="text-zinc-400 dark:text-zinc-500 font-normal">Budget</span>
            {job.budget}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal">· {job.budgetType}</span>
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {job.deadline}
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-zinc-400 dark:text-zinc-500">
            {job.applicants} applied
          </span>
        </div>

        {/* Target badge */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 border rounded-sm ${target.classes}`}
          >
            <span>{<target.icon />}</span>
            Open for {target.label}
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-6 pb-6 pt-0 flex items-center gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/project/${job?.id}`)}
          className="rounded-none text-xs font-medium border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all"
        >
          View Details
        </Button>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex-1">
                <Button
                  size="sm"
                  disabled={applyState.state !== "can_apply"}
                  className={`w-full rounded-none text-xs font-semibold transition-all ${
                    applyState.state === "can_apply"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                      : applyState.state === "wrong_type"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-70"
                      : "bg-amber-500 dark:bg-amber-500 text-white hover:bg-amber-600 dark:hover:bg-amber-400"
                  }`}
                  onClick={() => {
                    if (applyState.state === "login_required") {
                      alert("Please login to apply for jobs.");
                    }
                  }}
                >
                  {applyState.state === "login_required" ? <Lock/> : ""}
                  {applyState.label}
                </Button>
              </span>
            </TooltipTrigger>
            {applyState.state === "wrong_type" && (
              <TooltipContent
                side="top"
                className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-none border-0 max-w-50 text-center"
              >
                This job is not open for your account type
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </article>
  );
}

// Detail Dialog 
function JobDetailDialog({ job, open, onClose, auth }) {
  if (!job) return null;
  const applyState = getApplyState(job, auth);
  const target = TARGET_CONFIG[job.targetType];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        {/* Accent line */}
        <div
          className={`h-0.75 w-full ${
            job.targetType === "freelancer"
              ? "bg-sky-400"
              : job.targetType === "organization"
              ? "bg-amber-400"
              : "bg-emerald-400"
          }`}
        />

        <div className="p-8">
          <DialogHeader className="mb-0">
            {/* Category + target */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                className={`text-[10px] font-mono rounded-none border-transparent px-2 py-0.5 ${CATEGORY_COLORS[job.category]}`}
              >
                {job.category}
              </Badge>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 border rounded-sm ${target.classes}`}
              >
                {<target.icon />} {target.label}
              </span>
            </div>

            <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight text-left">
              {job.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 text-left">
              Posted by <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.postedBy}</span> · {job.postedDaysAgo} days ago
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-6 bg-zinc-100 dark:bg-zinc-800" />

          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Budget", value: job.budget },
              { label: "Type", value: job.budgetType },
              { label: "Deadline", value: job.deadline },
              { label: "Applicants", value: `${job.applicants} applied` },
            ].map((d) => (
              <div key={d.label} className="bg-zinc-50 dark:bg-zinc-800/60 p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                  {d.label}
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Required Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Full description */}
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
              Project Description
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {job.fullDesc}
            </p>
          </div>

          {/* Apply section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      size="default"
                      disabled={applyState.state !== "can_apply"}
                      className={`rounded-none font-semibold px-8 transition-all ${
                        applyState.state === "can_apply"
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                          : applyState.state === "wrong_type"
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {applyState.state === "login_required" ? "🔒 " : ""}
                      {applyState.label}
                    </Button>
                  </span>
                </TooltipTrigger>
                {applyState.state === "wrong_type" && (
                  <TooltipContent
                    side="top"
                    className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-none border-0"
                  >
                    This job is not open for your account type
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {applyState.state === "wrong_type" && (
              <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
                <span>⚠</span>
                This job is not open for your account type
              </p>
            )}
            {applyState.state === "login_required" && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>🔒</span>
                Please log in to apply for this job
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Empty State 
function EmptyState({ query }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl mb-4">
        <Search />
      </div>
      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight">
        No jobs found
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs">
        {query
          ? `No results for "${query}". Try adjusting your filters.`
          : "No jobs match the selected filters."}
      </p>
    </div>
  );
}

