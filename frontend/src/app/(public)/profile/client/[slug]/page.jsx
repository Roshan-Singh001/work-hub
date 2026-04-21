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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  Send,
  Globe,
  ArrowLeft,
  ChevronRight,
  BadgeCheck,
  MessageCircle,
  Award,
  Clock,
  TrendingUp,
  Building2,
  Briefcase,
  Calendar,
  IndianRupee,
  CircleDot,
  RefreshCw,
  Circle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  UserCircle2,
  FolderOpen,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const CLIENT = {
  // User fields
  first_name: "Vikram",
  last_name: "Anand",
  createdAt: "2023-01-14T08:00:00Z",

  // Client fields
  client_dp_url: null,           // null → show initials avatar
  org_name: "TechVentures Pvt. Ltd.",
  country: "India",
  rating: 4.7,

  // Extended display (realistic, beyond schema)
  email: "vikram@techventures.in",
  phone: "+91 98001 55678",
  location: "Mumbai, India",
  responseTime: "< 3 hours",
  totalSpent: 2850000,           // ₹28.5L
  activeProjects: 3,
  completedProjects: 11,
  totalProjects: 14,
  totalReviews: 9,
  preferredType: "Fixed Price",
  industries: ["SaaS", "Fintech", "AI Infrastructure"],

  // clientProjects (sample from ProjectApplication relation)
  clientProjects: [
    {
      id: "p1",
      title: "AI-Powered Customer Support Chatbot",
      status: "IN_PROGRESS",
      budget: 150000,
      deadline: "2025-07-15",
      postedAt: "2025-04-10",
    },
    {
      id: "p2",
      title: "Real-time Analytics Dashboard",
      status: "COMPLETED",
      budget: 95000,
      deadline: "2025-01-20",
      postedAt: "2024-11-05",
    },
    {
      id: "p3",
      title: "Fraud Detection ML Pipeline",
      status: "COMPLETED",
      budget: 220000,
      deadline: "2024-09-01",
      postedAt: "2024-06-12",
    },
    {
      id: "p4",
      title: "Mobile App — Fintech Wallet",
      status: "OPEN",
      budget: 180000,
      deadline: "2025-09-30",
      postedAt: "2025-04-01",
    },
  ],

  recentReviews: [
    {
      id: "r1",
      reviewer: "Arjun Mehta",
      role: "Freelancer",
      initials: "AM",
      rating: 5,
      text: "Vikram is an excellent client — clear requirements, prompt feedback, and pays on time without any friction. Would work with him again in a heartbeat.",
      project: "AI Customer Support Bot",
      date: "Mar 2025",
    },
    {
      id: "r2",
      reviewer: "NexaLabs Technologies",
      role: "Organization",
      initials: "NL",
      rating: 5,
      text: "Very professional. Scope was well defined, milestones were reasonable, and communication was crisp throughout the engagement.",
      project: "Real-time Analytics Dashboard",
      date: "Jan 2025",
    },
    {
      id: "r3",
      reviewer: "Priya Sharma",
      role: "Freelancer",
      initials: "PS",
      rating: 4,
      text: "Good client overall. A few last-minute scope changes but always reasonable about timelines. Would recommend.",
      project: "Fraud Detection ML Pipeline",
      date: "Sep 2024",
    },
  ],
};

// ─── Config ─────────────────────────────────────────────────────────────────────
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

export default function ClientProfilePage() {
  const c = CLIENT;
  const [messageOpen, setMessageOpen] = useState(false);

  const fullName = `${c.first_name} ${c.last_name}`;
  const initials = `${c.first_name[0]}${c.last_name[0]}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

        <Navbar />

      <div className="mt-24 max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Hero Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
              <div className="p-7">
                <div className="flex flex-col sm:flex-row gap-5 items-start">

                  {/* Avatar */}
                  {c.client_dp_url ? (
                    <img
                      src={c.client_dp_url}
                      alt={fullName}
                      className="w-20 h-20 rounded-sm object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-sm bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-2xl font-black text-white dark:text-zinc-900 shrink-0 tracking-tight">
                      {initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
                        {fullName}
                      </h1>
                      <BadgeCheck className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
                    </div>

                    {c.org_name && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> {c.org_name}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-3">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {c.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Member since {memberSince(c.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Responds in {c.responseTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating rating={c.rating} size="sm" />
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.rating}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">({c.totalReviews} reviews from freelancers)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Industry Interests ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Industry Focus
              </p>
              <div className="flex flex-wrap gap-2">
                {c.industries.map((ind) => (
                  <span
                    key={ind}
                    className="text-xs font-mono px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-default"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Projects ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Posted Projects
                </p>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-800/50">
                  {c.totalProjects} total
                </span>
              </div>

              <div className="flex flex-col gap-px bg-zinc-100 dark:bg-zinc-800">
                {c.clientProjects.map((proj) => {
                  const st = STATUS_CONFIG[proj.status];
                  return (
                    <div
                      key={proj.id}
                      className="bg-white dark:bg-zinc-900 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug mb-1.5">
                            {proj.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`flex items-center gap-1.5 text-[11px] font-medium border px-2 py-0.5 rounded-sm ${st.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" /> Posted {formatDate(proj.postedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {formatBudget(proj.budget)}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                            Deadline {formatDate(proj.deadline)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Reviews from Freelancers ── */}
            {/* <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Star className="w-3 h-3" /> Freelancer Reviews
                </p>
                <div className="flex items-center gap-2">
                  <StarRating rating={c.rating} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.rating}</span>
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">/ 5.0</span>
                </div>
              </div>

              <div className="flex flex-col gap-px bg-zinc-100 dark:bg-zinc-800">
                {c.recentReviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-zinc-900 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                        {rev.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{rev.reviewer}</p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{rev.role}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StarRating rating={rev.rating} size="sm" />
                            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{rev.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">"{rev.text}"</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-800/50">
                      <Briefcase className="w-2.5 h-2.5" /> {rev.project}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}

          </div>

          
          <div className="flex flex-col gap-5">

            {/* ── CTA Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
              <div className="p-6">

                {/* Total spent */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Total Spent
                  </p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {formatBudget(c.totalSpent)}
                  </p>
                  <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                    across {c.completedProjects} completed projects
                  </p>
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Project counts */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: "Open", value: c.clientProjects.filter(p => p.status === "OPEN").length, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Active", value: c.activeProjects, color: "text-sky-600 dark:text-sky-400" },
                    { label: "Done", value: c.completedProjects, color: "text-zinc-500 dark:text-zinc-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-2.5 text-center">
                      <p className={`text-lg font-black leading-none ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                <Button
                  onClick={() => setMessageOpen(true)}
                  className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Send a Message
                </Button>
              </div>
            </div>

            {/* ── Client Details ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Details
              </p>
              <div className="flex flex-col gap-3.5">
                {[
                  { icon: Mail, label: "Email", value: c.email },
                  { icon: Phone, label: "Phone", value: c.phone },
                  { icon: MapPin, label: "Location", value: c.location },
                  { icon: Building2, label: "Company", value: c.org_name || "—" },
                  { icon: Briefcase, label: "Prefers", value: c.preferredType },
                  { icon: Calendar, label: "Joined", value: memberSince(c.createdAt) },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{item.label}</p>
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 break-all">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: TrendingUp, label: "Total Projects", value: c.totalProjects },
                  { icon: Star, label: "Avg Rating", value: `${c.rating} / 5` },
                  { icon: IndianRupee, label: "Total Spent", value: formatBudget(c.totalSpent) },
                  { icon: Clock, label: "Response", value: c.responseTime },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3">
                      <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mb-1.5" />
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">{stat.value}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Verification Flags ── */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-5">
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: BadgeCheck, text: "Identity verified", ok: true },
                  { icon: ShieldCheck, text: "Payment method verified", ok: true },
                  { icon: Mail, text: "Email verified", ok: true },
                  { icon: UserCircle2, text: "Profile complete", ok: true },
                ].map((flag, i) => {
                  const Icon = flag.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${flag.ok ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-600"}`} />
                      {flag.text}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      <MessageDialog open={messageOpen} onClose={() => setMessageOpen(false)} client={CLIENT} />
    </div>
  );
}

function formatBudget(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function memberSince(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short", year: "numeric",
  });
}

// ─── Star Rating ─────────────────────────────────────────────────────────────────
function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
        />
      ))}
    </div>
  );
}

function MessageDialog({ open, onClose, client }) {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;
    setStep(2);
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setStep(1); setSubject(""); setMessage(""); }, 300);
  }

  const fullName = `${client.first_name} ${client.last_name}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
        <div className="p-8">
          {step === 1 ? (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-sm bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xs font-black text-white dark:text-zinc-900 shrink-0">
                    {client.first_name[0]}{client.last_name[0]}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                      Message {fullName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                      {client.org_name} · {client.country}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Proposal for your AI Chatbot project"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    placeholder="Introduce yourself and explain how you can help with their project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 text-sm rounded-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                  />
                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1">{message.length}/1000</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                  <Button variant="ghost" onClick={handleClose} className="rounded-none text-zinc-500 dark:text-zinc-400">
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-sm flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Message Sent!</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fullName}</span> typically responds in{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{client.responseTime}</span>.
              </p>
              <Button onClick={handleClose} className="mt-6 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
