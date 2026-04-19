"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  ExternalLink,
  Award,
  Clock,
  TrendingUp,
  Building2,
  Users,
  Layers,
  Briefcase,
  FileText,
  Factory,
  UserCircle2,
  ShieldCheck,
  Link2,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const ORGANIZATION = {
  // Organization fields (maps to Prisma model)
  org_name: "NexaLabs Technologies",
  size: "51–200",
  country: "India",
  industry: "SaaS / AI Infrastructure",
  website: "https://nexalabs.io",
  org_phone: "+91 80 4567 8900",
  org_email: "hire@nexalabs.io",
  about: `NexaLabs is a product-led engineering consultancy specializing in AI infrastructure, data platforms, and large-scale SaaS development. Founded in 2019, we've shipped over 120 production systems across Fintech, HealthTech, EdTech, and Enterprise SaaS verticals.

Our team of 80+ engineers, designers, and product strategists operates in focused squads — each squad owning a full vertical from architecture to deployment. We don't do body-shopping; we build end-to-end, own outcomes, and hand over systems that last.

We partner exclusively with high-growth startups and mid-market companies that care about engineering quality. Every engagement starts with a discovery sprint, followed by iterative delivery and a structured handover. NDA and IP assignment agreements available from day one.`,

  // Owner (from User relation)
  owner: {
    first_name: "Sneha",
    last_name: "Iyer",
    email: "sneha@nexalabs.io",
    phone: "+91 98100 22334",
  },

  // Extended display data (beyond schema, realistic)
  founded: "2019",
  headquarters: "Bengaluru, India",
  completedProjects: 120,
  activeClients: 34,
  rating: 4.8,
  totalReviews: 62,
  memberSince: "Feb 2021",
  responseTime: "< 4 hours",
  expertise: [
    "AI / ML Systems",
    "Data Engineering",
    "Cloud Architecture",
    "Full-Stack SaaS",
    "DevOps & MLOps",
    "Mobile (React Native)",
  ],
  techStack: [
    "Python", "React", "Node.js", "Go", "AWS", "GCP",
    "Kubernetes", "LangChain", "PostgreSQL", "Kafka",
  ],
  members: [
    { id: "m1", name: "Rohan Das", role: "Lead Engineer — AI", initials: "RD" },
    { id: "m2", name: "Ananya Pillai", role: "Product Architect", initials: "AP" },
    { id: "m3", name: "Karan Sethi", role: "DevOps Lead", initials: "KS" },
    { id: "m4", name: "Meera Joshi", role: "Frontend Engineer", initials: "MJ" },
  ],
  recentReviews: [
    {
      id: "r1",
      reviewer: "Vikram Anand",
      company: "TechVentures Pvt. Ltd.",
      initials: "VA",
      rating: 5,
      text: "NexaLabs delivered our entire data platform on time and well within budget. Their squad model meant zero hand-holding — they just executed.",
      project: "Real-time Analytics Platform",
      date: "Apr 2025",
    },
    {
      id: "r2",
      reviewer: "Priya Nair",
      company: "HealthBridge Systems",
      initials: "PN",
      rating: 5,
      text: "Exceptional engineering quality. The AI triage system they built has been running flawlessly in production for 6 months.",
      project: "AI-Powered Patient Triage",
      date: "Feb 2025",
    },
    {
      id: "r3",
      reviewer: "Aditya Chandra",
      company: "EduStack Inc.",
      initials: "AC",
      rating: 4,
      text: "Great team, very communicative. Minor scope changes were handled gracefully. Would definitely engage again.",
      project: "LMS Backend Rebuild",
      date: "Dec 2024",
    },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
        />
      ))}
    </div>
  );
}

// ─── Message Dialog ─────────────────────────────────────────────────────────────
function MessageDialog({ open, onClose, org }) {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [projectRef, setProjectRef] = useState("");

  function handleSend() {
    if (!message.trim()) return;
    setStep(2);
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setStep(1); setSubject(""); setMessage(""); setProjectRef(""); }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
        <div className="p-8">
          {step === 1 ? (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  {/* Org avatar */}
                  <div className="w-10 h-10 rounded-sm bg-zinc-900 dark:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                      Message {org.org_name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                      {org.industry} · {org.country}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Project Reference (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI Platform Build — #PROJ-042"
                    value={projectRef}
                    onChange={(e) => setProjectRef(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Interested in a discovery sprint"
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
                    placeholder="Describe your project, requirements, timeline, and budget..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 text-sm rounded-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                  />
                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1">
                    {message.length}/1000
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="rounded-none text-zinc-500 dark:text-zinc-400"
                  >
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
              <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                Message Sent!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{org.org_name}</span> typically
                responds within{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{org.responseTime}</span>.
              </p>
              <Button
                onClick={handleClose}
                className="mt-6 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function OrganizationProfilePage() {
  const org = ORGANIZATION;
  const [messageOpen, setMessageOpen] = useState(false);

  const ownerFullName = `${org.owner.first_name} ${org.owner.last_name}`;
  const ownerInitials = `${org.owner.first_name[0]}${org.owner.last_name[0]}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

        <Navbar />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="max-w-6xl mt-24  mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══════════════════════════════════════════════
              LEFT COLUMN
          ══════════════════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Hero Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
              <div className="p-7">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Logo / Avatar */}
                  <div className="w-20 h-20 rounded-sm bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-9 h-9 text-white dark:text-zinc-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Org name + badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
                        {org.org_name}
                      </h1>
                      <BadgeCheck className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
                    </div>

                    {/* Industry */}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 leading-snug">
                      {org.industry}
                    </p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {org.headquarters}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> {org.size} employees
                      </span>
                      {/* <span className="flex items-center gap-1.5">
                        <Award className="w-3 h-3" /> Est. {org.founded}
                      </span> */}
                      {/* <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Responds in {org.responseTime}
                      </span> */}
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={Math.round(org.rating)} size="sm" />
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{org.rating}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">({org.totalReviews} reviews)</span>
                      <span className="text-zinc-200 dark:text-zinc-700 mx-1">·</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">{org.completedProjects} projects delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── About ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                About the Organization
              </p>
              <div>
                {org.about.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* ── Expertise & Tech Stack ── */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Areas of Expertise
                </p>
                <div className="flex flex-col gap-px bg-zinc-100 dark:bg-zinc-800">
                  {org.expertise.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {org.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div> */}

            {/* ── Team Members ── */}
            {/* <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Key Team Members
                </p>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-800/50">
                  {org.size} total
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-800">
                {org.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* ── Reviews ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Star className="w-3 h-3" /> Client Reviews
                </p>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(org.rating)} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{org.rating}</span>
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">/ 5.0</span>
                </div>
              </div>

              <div className="flex flex-col gap-px bg-zinc-100 dark:bg-zinc-800">
                {org.recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white dark:bg-zinc-900 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                        {rev.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                              {rev.reviewer}
                            </p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                              {rev.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StarRating rating={rev.rating} size="sm" />
                            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{rev.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                      "{rev.text}"
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-800/50">
                      <Briefcase className="w-2.5 h-2.5" /> {rev.project}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN — Sidebar
          ══════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* ── CTA Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
              <div className="p-6">
                {/* Projects + clients summary */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3">
                    <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">{org.completedProjects}+</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">Projects</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3">
                    <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">{org.activeClients}</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">Active Clients</p>
                  </div>
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Response time */}
                {/* <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Response Time
                  </p>
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {org.responseTime}
                  </p>
                </div> */}

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setMessageOpen(true)}
                    className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Send a Message
                  </Button>
                  {org.website && (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full rounded-none border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold gap-2"
                      >
                        <Globe className="w-4 h-4" /> Visit Website
                        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── Contact Details ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Contact
              </p>
              <div className="flex flex-col gap-3.5">
                {org.org_email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Email</p>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 break-all">{org.org_email}</p>
                    </div>
                  </div>
                )}
                {org.org_phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Phone</p>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{org.org_phone}</p>
                    </div>
                  </div>
                )}
                {org.website && (
                  <div className="flex items-start gap-3">
                    <Link2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Website</p>
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline mt-0.5 block"
                      >
                        {org.website.replace("https://", "")}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Factory className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Industry</p>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{org.industry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Owner / Point of Contact ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Point of Contact
              </p>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                  {ownerInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                    {ownerFullName}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">Owner · {org.org_name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                  <span className="break-all">{org.owner.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                  <span>{org.owner.phone}</span>
                </div>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: TrendingUp, label: "Delivered", value: `${org.completedProjects}+` },
                  { icon: Star, label: "Avg Rating", value: `${org.rating} / 5` },
                  { icon: Users, label: "Team Size", value: org.size },
                  { icon: Award, label: "On Platform", value: org.memberSince },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mb-1.5" />
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">{stat.value}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* ── Message Dialog ── */}
      <MessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        org={org}
      />
    </div>
  );
}