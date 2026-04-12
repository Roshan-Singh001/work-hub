"use client";

import { useState, useMemo } from "react";
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
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import {
  Search,
  Star,
  Briefcase,
  Wrench,
  IndianRupee,
  Circle,
  Clock,
  Lock,
  MessageSquare,
  UserPlus,
  SlidersHorizontal,
  X,
  MapPin,
  Award,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";

const MOCK_AUTH = {
  isLoggedIn: true,
  userType: "client",
};

// Mock Data
const FREELANCERS = [
  {
    id: 1,
    name: "Arjun Mehta",
    initials: "AM",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    rate: 1200,
    rating: 4.9,
    reviews: 47,
    availability: "available",
    experience: "expert",
    location: "Bangalore",
    bio: "8+ years building scalable web apps. Ex-Flipkart engineer. I specialize in React-Node architectures and have delivered 30+ production systems.",
    completedJobs: 63,
    responseTime: "< 2 hrs",
    badges: ["Top Rated", "Fast Responder"],
    avatarColor: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    role: "UI/UX Designer",
    skills: ["Figma", "Framer", "Design Systems", "Prototyping"],
    rate: 900,
    rating: 4.8,
    reviews: 31,
    availability: "available",
    experience: "expert",
    location: "Mumbai",
    bio: "Product designer with 6 years at startups and agencies. Obsessed with clean interfaces, accessible design, and design-dev handoff.",
    completedJobs: 44,
    responseTime: "< 4 hrs",
    badges: ["Top Rated"],
    avatarColor: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  },
  {
    id: 3,
    name: "Rahul Verma",
    initials: "RV",
    role: "AI/ML Engineer",
    skills: ["Python", "LangChain", "NLP", "TensorFlow"],
    rate: 1800,
    rating: 4.7,
    reviews: 19,
    availability: "busy",
    experience: "expert",
    location: "Hyderabad",
    bio: "ML researcher turned freelancer. Specialise in LLM integration, RAG pipelines, and custom model fine-tuning for production deployments.",
    completedJobs: 22,
    responseTime: "< 8 hrs",
    badges: ["Specialist"],
    avatarColor: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    initials: "SI",
    role: "Mobile Developer",
    skills: ["React Native", "Flutter", "Firebase", "iOS"],
    rate: 1000,
    rating: 4.6,
    reviews: 28,
    availability: "available",
    experience: "intermediate",
    location: "Chennai",
    bio: "Cross-platform mobile dev with 4 years of experience. Shipped 12+ apps on both stores. Strong on animations and offline-first architecture.",
    completedJobs: 35,
    responseTime: "< 3 hrs",
    badges: ["Fast Responder"],
    avatarColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    id: 5,
    name: "Karan Joshi",
    initials: "KJ",
    role: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    rate: 1400,
    rating: 4.5,
    reviews: 14,
    availability: "available",
    experience: "intermediate",
    location: "Pune",
    bio: "Cloud and infrastructure specialist. I help startups go from manual deployments to automated, observable, production-ready systems.",
    completedJobs: 18,
    responseTime: "< 6 hrs",
    badges: [],
    avatarColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    id: 6,
    name: "Divya Nair",
    initials: "DN",
    role: "Content & SEO Strategist",
    skills: ["SEO", "Content Writing", "Copywriting", "Analytics"],
    rate: 500,
    rating: 4.8,
    reviews: 52,
    availability: "busy",
    experience: "intermediate",
    location: "Kochi",
    bio: "Helped 20+ B2B SaaS brands grow organic traffic by 3x. I write content that ranks and converts — not just fills pages.",
    completedJobs: 71,
    responseTime: "< 12 hrs",
    badges: ["Top Rated"],
    avatarColor: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
  {
    id: 7,
    name: "Aditya Kulkarni",
    initials: "AK",
    role: "Backend Developer",
    skills: ["Go", "PostgreSQL", "Redis", "gRPC"],
    rate: 1600,
    rating: 4.9,
    reviews: 23,
    availability: "available",
    experience: "expert",
    location: "Bangalore",
    bio: "Backend systems engineer focused on performance and reliability. Built distributed systems handling 1M+ requests/day.",
    completedJobs: 29,
    responseTime: "< 2 hrs",
    badges: ["Top Rated", "Fast Responder"],
    avatarColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    id: 8,
    name: "Meera Pillai",
    initials: "MP",
    role: "Data Analyst",
    skills: ["Power BI", "SQL", "Python", "Tableau"],
    rate: 750,
    rating: 4.4,
    reviews: 11,
    availability: "available",
    experience: "beginner",
    location: "Delhi",
    bio: "Fresh but sharp — 2 years of analytics experience across e-commerce and logistics. Strong storytelling with data, BI dashboards, and SQL.",
    completedJobs: 14,
    responseTime: "< 6 hrs",
    badges: [],
    avatarColor: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
];

const ALL_SKILLS = [
  "React", "Node.js", "Python", "Figma", "Flutter", "AWS",
  "AI/ML", "TypeScript", "Go", "SQL", "SEO", "React Native",
];

const EXPERIENCE_LABELS = {
  beginner: { label: "Beginner", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" },
  intermediate: { label: "Intermediate", color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800" },
  expert: { label: "Expert", color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800" },
};

export default function HireFreelancer() {
  const auth = MOCK_AUTH;

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    skills: [],
    experience: "all",
    maxRate: 2000,
    minRating: 0,
    availability: "all",
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authAction, setAuthAction] = useState("hire");
  const [hireConfirmOpen, setHireConfirmOpen] = useState(false);
  const [hireTarget, setHireTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = FREELANCERS.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q));

      const matchSkills =
        filters.skills.length === 0 ||
        filters.skills.some((sk) => f.skills.some((fs) => fs.toLowerCase().includes(sk.toLowerCase())));

      const matchExp = filters.experience === "all" || f.experience === filters.experience;
      const matchRate = f.rate <= filters.maxRate;
      const matchRating = f.rating >= filters.minRating;
      const matchAvail = filters.availability === "all" || f.availability === filters.availability;

      return matchSearch && matchSkills && matchExp && matchRate && matchRating && matchAvail;
    });

    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "rate_low") list = [...list].sort((a, b) => a.rate - b.rate);
    else if (sortBy === "rate_high") list = [...list].sort((a, b) => b.rate - a.rate);
    else if (sortBy === "jobs") list = [...list].sort((a, b) => b.completedJobs - a.completedJobs);

    return list;
  }, [search, filters, sortBy]);

  function handleHire(freelancer) {
    if (!freelancer) {
      setAuthAction("hire");
      setAuthModalOpen(true);
      return;
    }
    setHireTarget(freelancer);
    setHireConfirmOpen(true);
  }

  function handleMessage(freelancer) {
    if (!freelancer) {
      setAuthAction("message");
      setAuthModalOpen(true);
    }
  }

  function handleViewProfile(freelancer) {
    setSelectedFreelancer(freelancer);
    setProfileOpen(true);
  }

  const activeFilterCount =
    filters.skills.length +
    (filters.experience !== "all" ? 1 : 0) +
    (filters.maxRate < 2000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.availability !== "all" ? 1 : 0);

  const ctaState = getCTAState(auth);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />

        <Navbar />

      {auth.isLoggedIn && ctaState === "hidden" && (
        <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Briefcase className="w-3.5 h-3.5 shrink-0" />
          You&apos;re logged in as a <span className="font-semibold text-zinc-700 dark:text-zinc-300 mx-1">{auth.userType}</span>. Hiring is only available for Client accounts.
        </div>
      )}

      {/* Top Section */}
      <div className="mt-24 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-6">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight">
              Hire Freelancers
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm font-light max-w-lg">
              Find skilled professionals verified on WorkHub. Filter by skill, rate, and availability.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <Input
                placeholder="Search by name, skill, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500 h-10 text-sm"
              />
            </div>

            {/* Mobile filter trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="sm:hidden rounded-none border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 gap-2 h-10"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none w-72 p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-black tracking-tight text-zinc-900 dark:text-zinc-100">Filters</SheetTitle>
                </SheetHeader>
                <FilterPanel filters={filters} setFilters={setFilters} />
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-10 text-sm focus:ring-1 focus:ring-zinc-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <SelectItem value="rating" className="text-sm">Top Rated</SelectItem>
                <SelectItem value="rate_low" className="text-sm">Rate: Low to High</SelectItem>
                <SelectItem value="rate_high" className="text-sm">Rate: High to Low</SelectItem>
                <SelectItem value="jobs" className="text-sm">Most Jobs Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Result count */}
          <div className="mt-4">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              {filtered.length} freelancer{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex gap-8">

        {/* ── Sidebar Filters (desktop) ── */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </p>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-mono bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-1.5 py-0.5">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {/* ── Card Grid ── */}
        <main className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
              </div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight">No freelancers found</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs">Try adjusting your search or clearing some filters.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none border-zinc-200 dark:border-zinc-700 text-xs"
                onClick={() => {
                  setSearch("");
                  setFilters({ skills: [], experience: "all", maxRate: 2000, minRating: 0, availability: "all" });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((f, i) => (
                <FreelancerCard
                  key={f.id}
                  freelancer={f}
                  auth={auth}
                  index={i}
                  onViewProfile={handleViewProfile}
                  onHire={handleHire}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ── */}

      {/* Profile Dialog */}
      <FreelancerProfileDialog
        freelancer={selectedFreelancer}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        auth={auth}
        onHire={handleHire}
        onMessage={handleMessage}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        action={authAction}
      />

      {/* Hire Confirm Dialog */}
      <Dialog open={hireConfirmOpen} onOpenChange={setHireConfirmOpen}>
        <DialogContent className="max-w-sm rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
          <div className="h-0.75 bg-emerald-400 w-full" />
          <div className="p-8">
            <div className="w-14 h-14 rounded-sm bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                Hire {hireTarget?.name.split(" ")[0]}?
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                You&apos;re about to send a hire request to{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{hireTarget?.name}</span> — {hireTarget?.role}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                onClick={() => setHireConfirmOpen(false)}
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & Send Request
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-none text-zinc-500 dark:text-zinc-400 text-sm"
                onClick={() => setHireConfirmOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Star
function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{rating}</span>
    </span>
  );
}

function getCTAState(auth) {
  if (!auth.isLoggedIn) return "locked";
  if (auth.userType === "client") return "allowed";
  return "hidden";
}

function AuthModal({ open, onClose, action }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className="h-0.75 bg-amber-400 w-full" />
        <div className="p-8 text-center">
          <div className="w-14 h-14 rounded-sm bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              You need to be logged in as a <span className="font-semibold text-zinc-700 dark:text-zinc-300">Client</span> to {action} a freelancer.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold">
              Log In
            </Button>
            <Button variant="ghost" className="w-full rounded-none text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm">
              Create Client Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function FreelancerProfileDialog({ freelancer, open, onClose, auth, onHire, onMessage }) {
  if (!freelancer) return null;
  const ctaState = getCTAState(auth);
  const exp = EXPERIENCE_LABELS[freelancer.experience];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="h-0.75 bg-zinc-900 dark:bg-zinc-100 w-full" />
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-xl font-black shrink-0 ${freelancer.avatarColor}`}>
              {freelancer.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{freelancer.name}</h2>
                {freelancer.badges.map((b) => (
                  <span key={b} className="text-[10px] font-mono uppercase tracking-widest bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5">
                    {b}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{freelancer.role}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StarRating rating={freelancer.rating} />
                <span className="text-xs text-zinc-400 dark:text-zinc-500">({freelancer.reviews} reviews)</span>
                <span className={`flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-sm ${freelancer.availability === "available" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" : "text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}>
                  <Circle className={`w-2 h-2 ${freelancer.availability === "available" ? "fill-emerald-500 text-emerald-500" : "fill-zinc-400 text-zinc-400"}`} />
                  {freelancer.availability === "available" ? "Available" : "Busy"}
                </span>
              </div>
            </div>
          </div>

          <Separator className="mb-6 bg-zinc-100 dark:bg-zinc-800" />

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Rate", value: `₹${freelancer.rate.toLocaleString()}/hr`, icon: IndianRupee },
              { label: "Jobs Done", value: freelancer.completedJobs, icon: CheckCircle2 },
              { label: "Response", value: freelancer.responseTime, icon: Zap },
              { label: "Location", value: freelancer.location, icon: MapPin },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/60 p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Experience Level</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-sm ${exp.color}`}>
              <Award className="w-3 h-3" />
              {exp.label}
            </span>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {freelancer.skills.map((s) => (
                <span key={s} className="text-xs font-mono px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">About</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{freelancer.bio}</p>
          </div>

          {/* CTA */}
          {ctaState === "allowed" && (
            <div className="flex gap-2">
              <Button
                onClick={() => { onHire(freelancer); onClose(); }}
                className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
              >
                <UserPlus className="w-4 h-4" /> Hire {freelancer.name.split(" ")[0]}
              </Button>
              <Button
                variant="outline"
                onClick={() => { onMessage(freelancer); onClose(); }}
                className="flex-1 rounded-none border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </Button>
            </div>
          )}
          {ctaState === "locked" && (
            <div className="flex gap-2">
              <Button
                onClick={() => { onHire(null); onClose(); }}
                className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold gap-2"
              >
                <Lock className="w-4 h-4" /> Login to Hire
              </Button>
              <Button
                variant="outline"
                onClick={() => { onMessage(null); onClose(); }}
                className="flex-1 rounded-none border-zinc-200 dark:border-zinc-700 gap-2"
              >
                <Lock className="w-4 h-4" /> Login to Message
              </Button>
            </div>
          )}
          {ctaState === "hidden" && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
              Hiring is only available for Client accounts.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


function FreelancerCard({ freelancer, auth, onViewProfile, onHire, onMessage, index }) {
  const ctaState = getCTAState(auth);
  const exp = EXPERIENCE_LABELS[freelancer.experience];

  return (
    <article
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 hover:shadow-lg dark:hover:shadow-zinc-950/50 rounded-none overflow-hidden"
    >
      {/* Top bar — availability color */}
      <div className={`h-0.75 w-full ${freelancer.availability === "available" ? "bg-emerald-400 dark:bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Profile row */}
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-sm font-black shrink-0 ${freelancer.avatarColor}`}>
            {freelancer.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base tracking-tight leading-tight">
                {freelancer.name}
              </h3>
              {freelancer.badges.slice(0, 1).map((b) => (
                <span key={b} className="text-[9px] font-mono uppercase tracking-widest bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5">
                  {b}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {freelancer.role}
            </p>
          </div>
          {/* Rating */}
          <div className="shrink-0">
            <StarRating rating={freelancer.rating} />
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-right mt-0.5">{freelancer.reviews} reviews</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{freelancer.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {freelancer.skills.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-sm">
              {s}
            </span>
          ))}
          {freelancer.skills.length > 3 && (
            <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-sm">
              +{freelancer.skills.length - 3}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100">
            <IndianRupee className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            {freelancer.rate.toLocaleString()}/hr
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className={`flex items-center gap-1 font-medium border px-2 py-0.5 rounded-sm text-[11px] ${freelancer.availability === "available" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" : "text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}>
            <Circle className={`w-2 h-2 ${freelancer.availability === "available" ? "fill-emerald-500 text-emerald-500" : "fill-zinc-400 text-zinc-400"}`} />
            {freelancer.availability === "available" ? "Available" : "Busy"}
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className={`text-[11px] font-medium border px-2 py-0.5 rounded-sm ${exp.color}`}>
            {exp.label}
          </span>
        </div>

        {/* Completed jobs */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" />
          {freelancer.completedJobs} jobs completed
          <span className="mx-1 text-zinc-200 dark:text-zinc-700">·</span>
          <Clock className="w-3 h-3" />
          Responds {freelancer.responseTime}
        </p>
      </div>

      {/* Footer CTAs */}
      <div className="px-6 pb-6 pt-0 flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(freelancer)}
          className="rounded-none text-xs font-medium border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all"
        >
          View Profile
        </Button>

        {ctaState === "allowed" && (
          <>
            <Button
              size="sm"
              onClick={() => onHire(freelancer)}
              className="flex-1 rounded-none text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 gap-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" /> Hire
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMessage(freelancer)}
              className="rounded-none text-xs font-medium border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all px-3"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </Button>
          </>
        )}

        {ctaState === "locked" && (
          <>
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => onHire(null)}
                    className="flex-1 rounded-none text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white gap-1.5 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" /> Hire
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-none border-0 text-xs">
                  Login required
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMessage(null)}
                    className="rounded-none text-xs border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 px-3"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-none border-0 text-xs">
                  Login to message
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {ctaState === "hidden" && (
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-1">
                  <Button
                    size="sm"
                    disabled
                    className="w-full rounded-none text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
                  >
                    Hire
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-none border-0 text-xs max-w-45 text-center">
                Only Client accounts can hire freelancers
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </article>
  );
}


function FilterPanel({ filters, setFilters }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Skills */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  skills: f.skills.includes(skill)
                    ? f.skills.filter((s) => s !== skill)
                    : [...f.skills, skill],
                }))
              }
              className={`text-xs font-mono px-2.5 py-1 rounded-sm border transition-all ${
                filters.skills.includes(skill)
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Experience */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Experience Level</p>
        <div className="flex flex-col gap-1.5">
          {["all", "beginner", "intermediate", "expert"].map((level) => (
            <button
              key={level}
              onClick={() => setFilters((f) => ({ ...f, experience: level }))}
              className={`text-xs text-left px-3 py-2 rounded-sm transition-all ${
                filters.experience === level
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {level === "all" ? "All Levels" : EXPERIENCE_LABELS[level].label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Rate Range */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Max Rate: ₹{filters.maxRate.toLocaleString()}/hr
        </p>
        <Slider
          min={200}
          max={2000}
          step={100}
          value={[filters.maxRate]}
          onValueChange={([val]) => setFilters((f) => ({ ...f, maxRate: val }))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-mono">
          <span>₹200</span><span>₹2,000</span>
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Min Rating */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Min Rating: {filters.minRating === 0 ? "Any" : `${filters.minRating}+`}
        </p>
        <div className="flex gap-1.5">
          {[0, 4.0, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
              className={`flex-1 text-xs py-1.5 rounded-sm border transition-all ${
                filters.minRating === r
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Availability */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Availability</p>
        <div className="flex gap-1.5">
          {["all", "available", "busy"].map((a) => (
            <button
              key={a}
              onClick={() => setFilters((f) => ({ ...f, availability: a }))}
              className={`flex-1 text-xs py-1.5 rounded-sm border transition-all capitalize ${
                filters.availability === a
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {a === "all" ? "All" : a}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          setFilters({ skills: [], experience: "all", maxRate: 2000, minRating: 0, availability: "all" })
        }
        className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors text-left"
      >
        Reset all filters
      </button>
    </div>
  );
}

