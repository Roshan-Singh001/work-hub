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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  CheckCircle2,
  Send,
  FileText,
  Globe,
  ArrowLeft,
  ChevronRight,
  BadgeCheck,
  Hash,
  MessageCircle,
  Download,
  ExternalLink,
  Award,
  Layers,
  Clock,
  IndianRupee,
  TrendingUp,
  User,
  Building2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const FREELANCER = {
  // User fields
  first_name: "Arjun",
  last_name: "Mehta",
  email: "arjun.mehta@gmail.com",
  phone: "+91 98765 43210",

  // Freelancer fields
  title: "Full-Stack Engineer & AI Integration Specialist",
  about: `I'm a full-stack engineer with 6+ years of experience building scalable web applications and integrating AI/ML systems into production environments. I specialize in Python backends, React frontends, and LLM-powered workflows using LangChain and OpenAI APIs.

I've worked with early-stage startups and large enterprises across Fintech, HealthTech, and SaaS verticals. My code is clean, well-tested, and production-ready — I take documentation and handovers seriously.

Currently open to fixed-price projects and long-term retainers. NDA-friendly. Let's build something great.`,
  country: "India",
  skills_category: "Full-Stack Development",
  resume_url: "https://arjunmehta.dev/resume.pdf",

  // Extended profile (add-ons beyond schema, still realistic)
  skills: ["Python", "React", "LangChain", "Node.js", "PostgreSQL", "AWS", "TypeScript", "FastAPI"],
  hourlyRate: 2500,
  availability: "Available Now",
  completedProjects: 47,
  rating: 4.9,
  totalReviews: 38,
  memberSince: "Mar 2022",
  responseTime: "< 2 hours",
  languages: ["English (Fluent)", "Hindi (Native)"],
  portfolioLinks: [
    { label: "GitHub", url: "https://github.com/arjunmehta" },
    { label: "Portfolio", url: "https://arjunmehta.dev" },
  ],
  recentReviews: [
    {
      id: "r1",
      reviewer: "Vikram Anand",
      company: "TechVentures Pvt. Ltd.",
      initials: "VA",
      rating: 5,
      text: "Arjun delivered the entire chatbot backend ahead of schedule. Exceptional code quality and communication throughout.",
      project: "AI Customer Support Bot",
      date: "Mar 2025",
    },
    {
      id: "r2",
      reviewer: "Priya Sharma",
      company: "FinEdge Analytics",
      initials: "PS",
      rating: 5,
      text: "Outstanding work on our data pipeline. He understood the requirements instantly and executed flawlessly.",
      project: "Real-time Analytics Dashboard",
      date: "Jan 2025",
    },
    {
      id: "r3",
      reviewer: "Rohit Kapoor",
      company: "MedSync Health",
      initials: "RK",
      rating: 4,
      text: "Very professional, good turnaround. Minor revision requests were handled quickly.",
      project: "EHR Integration API",
      date: "Nov 2024",
    },
  ],
};

// ─── Message Dialog ─────────────────────────────────────────────────────────────
function MessageDialog({ open, onClose, freelancer }) {
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
        <div className="h-0.75 bg-zinc-900 dark:bg-zinc-100 w-full" />
        <div className="p-8">
          {step === 1 ? (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                    {freelancer.first_name[0]}{freelancer.last_name[0]}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                      Message {freelancer.first_name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                      {freelancer.title}
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
                    placeholder="e.g. AI Chatbot Project — #PROJ-001"
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
                    placeholder="e.g. Interested in your availability"
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
                    placeholder="Describe your project, timeline, and what you're looking for..."
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
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{freelancer.first_name}</span> typically responds in{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{freelancer.responseTime}</span>.
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

// ─── Star Rating ────────────────────────────────────────────────────────────────
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

// ─── Main Profile Page ──────────────────────────────────────────────────────────
export default function FreelancerProfilePage() {
  const p = FREELANCER;
  const [messageOpen, setMessageOpen] = useState(false);

  const fullName = `${p.first_name} ${p.last_name}`;
  const initials = `${p.first_name[0]}${p.last_name[0]}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar/>

        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="max-w-6xl mt-24 mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Hero Card ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="h-0.75 w-full bg-zinc-900 dark:bg-zinc-100" />
              <div className="p-7">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-sm bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-2xl font-black text-white dark:text-zinc-900 shrink-0 tracking-tight">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + verification */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
                        {fullName}
                      </h1>
                      <BadgeCheck className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
                    </div>

                    {/* Title */}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 leading-snug">
                      {p.title}
                    </p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <MapPin className="w-3 h-3" /> {p.country}
                      </span>
                      <span className="mx-1 text-zinc-200 dark:text-zinc-700">|</span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <Layers className="w-3 h-3" /> {p.skills_category}
                      </span>
                      <span className="mx-1 text-zinc-200 dark:text-zinc-700">|</span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <Clock className="w-3 h-3" /> Responds in {p.responseTime}
                      </span>
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={Math.round(p.rating)} size="sm" />
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.rating}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">({p.totalReviews} reviews)</span>
                      <span className="text-zinc-200 dark:text-zinc-700 mx-1">·</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">{p.completedProjects} projects completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── About ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                About
              </p>
              <div>
                {p.about.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                <Layers className="w-3 h-3" /> Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-mono px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Reviews ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Star className="w-3 h-3" /> Reviews
                </p>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(p.rating)} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.rating}</span>
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">/ 5.0</span>
                </div>
              </div>

              <div className="flex flex-col gap-px bg-zinc-100 dark:bg-zinc-800">
                {p.recentReviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-zinc-900 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors">
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
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{rev.company}</p>
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
                {/* Hourly rate */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Hourly Rate
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-0.5">
                      <IndianRupee className="w-5 h-5" />
                      {p.hourlyRate.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">/ hr</span>
                  </div>
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Availability */}
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Availability
                  </p>
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {p.availability}
                  </p>
                </div>

                <Separator className="mb-5 bg-zinc-100 dark:bg-zinc-800" />

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setMessageOpen(true)}
                    className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Send a Message
                  </Button>
                  <a
                    href={p.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-none border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold gap-2"
                    >
                      <FileText className="w-4 h-4" /> View Resume
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Contact Details ── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Contact
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Email</p>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 break-all">{p.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Phone</p>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{p.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Languages</p>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {p.languages.join(" · ")}
                    </p>
                  </div>
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
                  { icon: TrendingUp, label: "Projects Done", value: p.completedProjects },
                  { icon: Star, label: "Avg Rating", value: `${p.rating} / 5` },
                  { icon: Award, label: "Member Since", value: p.memberSince },
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

            {/* ── Portfolio Links ── */}
            {/* <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                Portfolio & Links
              </p>
              <div className="flex flex-col gap-2">
                {p.portfolioLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 px-3 py-2 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
                  >
                    <span className="font-mono font-medium">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                  </a>
                ))}
              </div>
            </div> */}

          </div>
        </div>
      </div>

      <Footer/>

      {/* ── Message Dialog ── */}
      <MessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        freelancer={FREELANCER}
      />
    </div>
  );
}