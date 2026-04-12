"use client";

import { useState, useMemo } from "react";
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
  Building2,
  Users,
  Wrench,
  IndianRupee,
  FolderOpen,
  MessageSquare,
  Lock,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Globe,
  Handshake,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Layers,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const MOCK_AUTH = {
  isLoggedIn: true,
  userType: "organization",
};

// Mock Data
const ORGANIZATIONS = [
  {
    id: 1,
    name: "DevStudio India",
    initials: "DS",
    tagline: "Full Stack Product Agency",
    services: ["React", "Node.js", "AI Integration", "DevOps"],
    industry: ["Fintech", "SaaS", "E-commerce"],
    teamSize: "5–20",
    teamCount: 12,
    rating: 4.9,
    reviews: 64,
    portfolioCount: 120,
    minBudget: 50000,
    maxBudget: 500000,
    location: "Bangalore",
    founded: 2018,
    bio: "We build scalable digital products for startups and enterprises. Specialised in React-Node stacks, AI-powered features, and cloud-native architecture. 120+ successful deliveries.",
    highlights: ["ISO Certified", "Top Agency 2024"],
    responseTime: "< 4 hrs",
    logoColor: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    accentColor: "bg-sky-400",
  },
  {
    id: 2,
    name: "Pixel & Brand Co.",
    initials: "PB",
    tagline: "Brand Identity & Design Agency",
    services: ["Figma", "Branding", "UI/UX", "Motion Design"],
    industry: ["Consumer", "Healthcare", "Education"],
    teamSize: "1–5",
    teamCount: 4,
    rating: 4.8,
    reviews: 38,
    portfolioCount: 75,
    minBudget: 20000,
    maxBudget: 200000,
    location: "Mumbai",
    founded: 2020,
    bio: "A boutique design studio creating brands people remember. From logo systems to full product UI, we deliver design that earns trust — for startups and growth-stage companies.",
    highlights: ["Awwwards Nominee"],
    responseTime: "< 6 hrs",
    logoColor: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    accentColor: "bg-rose-400",
  },
  {
    id: 3,
    name: "CloudArch Solutions",
    initials: "CA",
    tagline: "DevOps & Cloud Infrastructure",
    services: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    industry: ["SaaS", "Fintech", "Logistics"],
    teamSize: "5–20",
    teamCount: 18,
    rating: 4.7,
    reviews: 29,
    portfolioCount: 55,
    minBudget: 100000,
    maxBudget: 1000000,
    location: "Hyderabad",
    founded: 2017,
    bio: "Infrastructure-first engineering team. We design, build, and operate cloud systems that don't break at 3am. Trusted by 30+ SaaS companies for mission-critical infra.",
    highlights: ["AWS Partner", "SOC 2 Compliant"],
    responseTime: "< 8 hrs",
    logoColor: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    accentColor: "bg-violet-400",
  },
  {
    id: 4,
    name: "DataMind Analytics",
    initials: "DM",
    tagline: "Data Engineering & BI Agency",
    services: ["Python", "Power BI", "SQL", "Snowflake", "ETL"],
    industry: ["Retail", "Logistics", "Manufacturing"],
    teamSize: "5–20",
    teamCount: 9,
    rating: 4.6,
    reviews: 22,
    portfolioCount: 41,
    minBudget: 75000,
    maxBudget: 600000,
    location: "Pune",
    founded: 2019,
    bio: "We turn raw data into executive-ready decisions. End-to-end analytics: data pipelines, warehouses, and BI dashboards. 40+ organisations run on our data systems.",
    highlights: ["Snowflake Partner"],
    responseTime: "< 12 hrs",
    logoColor: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    accentColor: "bg-teal-400",
  },
  {
    id: 5,
    name: "GrowthPulse Digital",
    initials: "GP",
    tagline: "Performance Marketing & SEO",
    services: ["SEO", "Paid Ads", "Content Strategy", "Analytics"],
    industry: ["E-commerce", "Consumer", "Education"],
    teamSize: "5–20",
    teamCount: 7,
    rating: 4.5,
    reviews: 47,
    portfolioCount: 95,
    minBudget: 15000,
    maxBudget: 150000,
    location: "Delhi",
    founded: 2019,
    bio: "Revenue-focused digital marketing agency. We handle SEO, paid media, and content — with a clear focus on ROI. Our clients average 4x traffic growth in 6 months.",
    highlights: ["Google Partner", "Meta Partner"],
    responseTime: "< 3 hrs",
    logoColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    accentColor: "bg-amber-400",
  },
  {
    id: 6,
    name: "MobileFirst Studio",
    initials: "MF",
    tagline: "Mobile App Development Agency",
    services: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
    industry: ["Healthcare", "Fintech", "Consumer"],
    teamSize: "1–5",
    teamCount: 5,
    rating: 4.7,
    reviews: 33,
    portfolioCount: 48,
    minBudget: 60000,
    maxBudget: 400000,
    location: "Chennai",
    founded: 2021,
    bio: "App specialists who know mobile deeply. We ship high-quality iOS and Android apps with offline-first support, smooth animations, and proper test coverage. No cowboy code.",
    highlights: ["Featured on Product Hunt"],
    responseTime: "< 5 hrs",
    logoColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    accentColor: "bg-emerald-400",
  },
  {
    id: 7,
    name: "Nexus AI Labs",
    initials: "NX",
    tagline: "AI & Machine Learning Agency",
    services: ["Python", "LLMs", "LangChain", "Computer Vision", "NLP"],
    industry: ["Healthcare", "Fintech", "SaaS", "Logistics"],
    teamSize: "20+",
    teamCount: 26,
    rating: 4.9,
    reviews: 18,
    portfolioCount: 30,
    minBudget: 200000,
    maxBudget: 2000000,
    location: "Bangalore",
    founded: 2022,
    bio: "Deep-tech AI agency for enterprises that need real ML — not chatbot wrappers. RAG pipelines, custom model training, computer vision systems, and AI product development.",
    highlights: ["YC Alumni", "NVIDIA Partner"],
    responseTime: "< 6 hrs",
    logoColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    accentColor: "bg-indigo-400",
  },
  {
    id: 8,
    name: "CraftLegal Tech",
    initials: "CL",
    tagline: "Legal Tech & Compliance SaaS",
    services: ["Legal Automation", "Document AI", "Compliance", "SaaS"],
    industry: ["Legal", "Fintech", "Healthcare"],
    teamSize: "5–20",
    teamCount: 14,
    rating: 4.4,
    reviews: 12,
    portfolioCount: 22,
    minBudget: 150000,
    maxBudget: 800000,
    location: "Delhi",
    founded: 2020,
    bio: "Bridging law and technology. We build compliance tools, contract automation systems, and legal AI for law firms and regulated industries.",
    highlights: ["Bar Council Empanelled"],
    responseTime: "< 24 hrs",
    logoColor: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
    accentColor: "bg-zinc-400",
  },
];

const ALL_SERVICES = [
  "React", "Node.js", "AI/ML", "Figma", "AWS", "Flutter",
  "SEO", "Python", "DevOps", "Branding", "SQL", "LLMs",
];

const ALL_INDUSTRIES = [
  "Fintech", "E-commerce", "SaaS", "Healthcare", "Education",
  "Logistics", "Retail", "Consumer", "Legal", "Manufacturing",
];

const TEAM_SIZE_OPTIONS = ["1–5", "5–20", "20+"];

export default function HireOrganization() {
  const auth = MOCK_AUTH;
  const ctaState = getCTAState(auth);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    services: [],
    teamSize: "all",
    maxBudget: 2000000,
    industry: "all",
    minRating: 0,
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = ORGANIZATIONS.filter((org) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        org.tagline.toLowerCase().includes(q) ||
        org.services.some((s) => s.toLowerCase().includes(q)) ||
        org.industry.some((i) => i.toLowerCase().includes(q));

      const matchServices =
        filters.services.length === 0 ||
        filters.services.some((fs) =>
          org.services.some((s) => s.toLowerCase().includes(fs.toLowerCase()))
        );

      const matchTeam = filters.teamSize === "all" || org.teamSize === filters.teamSize;
      const matchBudget = org.minBudget <= filters.maxBudget;
      const matchIndustry = filters.industry === "all" || org.industry.includes(filters.industry);
      const matchRating = org.rating >= filters.minRating;

      return matchSearch && matchServices && matchTeam && matchBudget && matchIndustry && matchRating;
    });

    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "portfolio") list = [...list].sort((a, b) => b.portfolioCount - a.portfolioCount);
    else if (sortBy === "team_size") list = [...list].sort((a, b) => b.teamCount - a.teamCount);
    else if (sortBy === "budget_low") list = [...list].sort((a, b) => a.minBudget - b.minBudget);

    return list;
  }, [search, filters, sortBy]);

  function handleContact(org) {
    if (!org) { setAuthModalOpen(true); return; }
    setContactTarget(org);
    setContactOpen(true);
  }

  function handleViewProfile(org) {
    setSelectedOrg(org);
    setProfileOpen(true);
  }

  const activeFilterCount =
    filters.services.length +
    (filters.teamSize !== "all" ? 1 : 0) +
    (filters.maxBudget < 2000000 ? 1 : 0) +
    (filters.industry !== "all" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* ── Role banner ── */}
      {auth.isLoggedIn && ctaState === "hidden" && (
        <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          You&apos;re logged in as a <span className="font-semibold text-zinc-700 dark:text-zinc-300 mx-1">Freelancer</span>. Contacting agencies requires a Client or Organization account.
        </div>
      )}

      {/* ── Top Section ── */}
      <div className="mt-24 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-6">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight">
              Hire Organizations
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm font-light max-w-lg">
              Browse verified agencies and development studios. Filter by services, team size, and project budget.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <Input
                placeholder="Search by agency name, service, or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500 h-10 text-sm"
              />
            </div>

            {/* Mobile filter sheet */}
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
              <SelectTrigger className="w-full sm:w-52 rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-10 text-sm focus:ring-1 focus:ring-zinc-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <SelectItem value="rating" className="text-sm">Top Rated</SelectItem>
                <SelectItem value="portfolio" className="text-sm">Most Projects Done</SelectItem>
                <SelectItem value="team_size" className="text-sm">Largest Team</SelectItem>
                <SelectItem value="budget_low" className="text-sm">Budget: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active chips */}
          {(filters.services.length > 0 || filters.teamSize !== "all" || filters.maxBudget < 2000000 || filters.industry !== "all" || filters.minRating > 0 || search) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest">Active:</span>
              {search && (
                <button onClick={() => setSearch("")} className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  "{search}" <X className="w-3 h-3 text-zinc-400" />
                </button>
              )}
              {filters.services.map((s) => (
                <button key={s} onClick={() => setFilters((f) => ({ ...f, services: f.services.filter((x) => x !== s) }))} className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  {s} <X className="w-3 h-3 text-zinc-400" />
                </button>
              ))}
              {filters.teamSize !== "all" && (
                <button onClick={() => setFilters((f) => ({ ...f, teamSize: "all" }))} className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  Team: {filters.teamSize} <X className="w-3 h-3 text-zinc-400" />
                </button>
              )}
              {filters.industry !== "all" && (
                <button onClick={() => setFilters((f) => ({ ...f, industry: "all" }))} className="flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  {filters.industry} <X className="w-3 h-3 text-zinc-400" />
                </button>
              )}
              <button onClick={() => { setSearch(""); setFilters({ services: [], teamSize: "all", maxBudget: 2000000, industry: "all", minRating: 0 }); }} className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Count */}
          <div className="mt-4">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              {filtered.length} agenc{filtered.length !== 1 ? "ies" : "y"} found
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex gap-8">

        {/* Sidebar (desktop) */}
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

        {/* Grid */}
        <main className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
              </div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight">No agencies found</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs">Adjust your filters or search terms.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none border-zinc-200 dark:border-zinc-700 text-xs"
                onClick={() => { setSearch(""); setFilters({ services: [], teamSize: "all", maxBudget: 2000000, industry: "all", minRating: 0 }); }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((org, i) => (
                <OrgCard
                  key={org.id}
                  org={org}
                  auth={auth}
                  index={i}
                  onViewProfile={handleViewProfile}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}

          {/* USP callout for org-to-org */}
          {ctaState === "allowed_org" && (
            <div className="mt-12 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                <Handshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm tracking-tight">Org-to-Org Collaboration</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed max-w-lg">
                  As an organization, you can partner with other agencies on WorkHub — share project overflow, co-bid on large contracts, or sub-contract specialized work. This is a unique capability not found on Fiverr or Upwork.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Dialogs ── */}
      <OrgProfileDialog
        org={selectedOrg}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        auth={auth}
        onContact={handleContact}
      />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ContactConfirmDialog
        org={contactTarget}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        auth={auth}
      />
    </div>
  );
}

function getCTAState(auth) {
  if (!auth.isLoggedIn) return "locked";
  if (auth.userType === "client") return "allowed_client";
  if (auth.userType === "organization") return "allowed_org";
  return "hidden"; // freelancer
}

// Stars
function StarRating({ rating, reviews }) {
  return (
    <span className="flex items-center gap-1.5">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{rating}</span>
      {reviews && <span className="text-xs text-zinc-400 dark:text-zinc-500">({reviews})</span>}
    </span>
  );
}

// Budget display 
function formatBudget(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

// Auth Modal 
function AuthModal({ open, onClose }) {
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
              You need to log in as a <span className="font-semibold text-zinc-700 dark:text-zinc-300">Client</span> or{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Organization</span> to contact agencies on WorkHub.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold">
              Log In
            </Button>
            <Button variant="ghost" className="w-full rounded-none text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm">
              Create Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

//  Organization Profile Dialog 
function OrgProfileDialog({ org, open, onClose, auth, onContact }) {
  if (!org) return null;
  const ctaState = getCTAState(auth);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className={`h-0.75 w-full ${org.accentColor}`} />
        <div className="p-8">

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-16 h-16 rounded-sm flex items-center justify-center text-lg font-black shrink-0 ${org.logoColor}`}>
              {org.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                    {org.name}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{org.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StarRating rating={org.rating} reviews={org.reviews} />
                <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                  <MapPin className="w-3 h-3" /> {org.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                  <Globe className="w-3 h-3" /> Est. {org.founded}
                </span>
              </div>
              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {org.highlights.map((h) => (
                  <span key={h} className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5">
                    <BadgeCheck className="w-2.5 h-2.5" /> {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-6 bg-zinc-100 dark:bg-zinc-800" />

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Team Size", value: `${org.teamCount} members`, icon: Users },
              { label: "Portfolio", value: `${org.portfolioCount}+ projects`, icon: FolderOpen },
              { label: "Budget Range", value: `${formatBudget(org.minBudget)}–${formatBudget(org.maxBudget)}`, icon: IndianRupee },
              { label: "Response", value: org.responseTime, icon: CheckCircle2 },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/60 p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">{s.label}</p>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Industries */}
          <div className="mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Industries</p>
            <div className="flex flex-wrap gap-1.5">
              {org.industry.map((ind) => (
                <span key={ind} className="text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-sm">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Services & Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {org.services.map((s) => (
                <span key={s} className="text-xs font-mono px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">About</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{org.bio}</p>
          </div>

          {/* CTAs */}
          {(ctaState === "allowed_client" || ctaState === "allowed_org") && (
            <div className="space-y-3">
              {ctaState === "allowed_org" && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                  <Handshake className="w-3.5 h-3.5 shrink-0" />
                  Org-to-org collaboration — partner with {org.name} on a project.
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => { onContact(org); onClose(); }}
                  className="flex-1 rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 font-semibold gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {ctaState === "allowed_org" ? "Propose Collaboration" : "Contact Agency"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 gap-2 px-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </Button>
              </div>
            </div>
          )}

          {ctaState === "locked" && (
            <Button
              onClick={() => { onContact(null); onClose(); }}
              className="w-full rounded-none bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-2"
            >
              <Lock className="w-4 h-4" /> Login to Contact
            </Button>
          )}

          {ctaState === "hidden" && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
              Contacting agencies is only available for Client and Organization accounts.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

//  Organization Card 
function OrgCard({ org, auth, onViewProfile, onContact, index }) {
  const ctaState = getCTAState(auth);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 hover:shadow-lg dark:hover:shadow-zinc-950/50 rounded-none overflow-hidden">
      {/* Accent top bar */}
      <div className={`h-0.75 w-full ${org.accentColor}`} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Logo + Name */}
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-sm font-black shrink-0 ${org.logoColor}`}>
            {org.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base tracking-tight leading-tight truncate">
              {org.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{org.tagline}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <StarRating rating={org.rating} />
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{org.reviews} reviews</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{org.bio}</p>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5">
          {org.services.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-sm">
              {s}
            </span>
          ))}
          {org.services.length > 3 && (
            <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-sm">
              +{org.services.length - 3}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
            <Users className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            {org.teamCount} members
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <FolderOpen className="w-3 h-3" />
            {org.portfolioCount}+ projects
          </span>
          <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-3 h-3" />
            {org.location}
          </span>
        </div>

        {/* Budget range */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <IndianRupee className="w-3 h-3" />
            <span>
              {formatBudget(org.minBudget)}
              <span className="text-zinc-300 dark:text-zinc-700 mx-1">–</span>
              {formatBudget(org.maxBudget)} projects
            </span>
          </span>
          {/* Highlight badges */}
          {org.highlights.slice(0, 1).map((h) => (
            <span key={h} className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5">
              <BadgeCheck className="w-2.5 h-2.5" /> {h}
            </span>
          ))}
        </div>

        {/* Industries */}
        <div className="flex flex-wrap gap-1">
          {org.industry.slice(0, 3).map((ind) => (
            <span key={ind} className="text-[10px] px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 rounded-sm">
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="px-6 pb-6 pt-0 flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(org)}
          className="rounded-none text-xs font-medium border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all"
        >
          View Profile
        </Button>

        {/* Client: Contact */}
        {ctaState === "allowed_client" && (
          <Button
            size="sm"
            onClick={() => onContact(org)}
            className="flex-1 rounded-none text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Contact
          </Button>
        )}

        {/* Org: Collaborate */}
        {ctaState === "allowed_org" && (
          <Button
            size="sm"
            onClick={() => onContact(org)}
            className="flex-1 rounded-none text-xs font-semibold bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white gap-1.5 transition-all"
          >
            <Handshake className="w-3.5 h-3.5" /> Collaborate
          </Button>
        )}

        {/* Locked */}
        {ctaState === "locked" && (
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => onContact(null)}
                  className="flex-1 rounded-none text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Contact
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-none border-0 text-xs">
                Login required
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Freelancer: Hidden */}
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
                    Contact
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-none border-0 text-xs max-w-50 text-center">
                Only Clients and Organizations can contact agencies
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </article>
  );
}

//  Filter Panel 
function FilterPanel({ filters, setFilters }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Services */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Services</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SERVICES.map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  services: f.services.includes(s)
                    ? f.services.filter((x) => x !== s)
                    : [...f.services, s],
                }))
              }
              className={`text-xs font-mono px-2.5 py-1 rounded-sm border transition-all ${
                filters.services.includes(s)
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Team Size */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Team Size</p>
        <div className="flex gap-1.5">
          {["all", ...TEAM_SIZE_OPTIONS].map((sz) => (
            <button
              key={sz}
              onClick={() => setFilters((f) => ({ ...f, teamSize: sz }))}
              className={`flex-1 text-xs py-1.5 rounded-sm border transition-all ${
                filters.teamSize === sz
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {sz === "all" ? "Any" : sz}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Budget */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Max Budget: {formatBudget(filters.maxBudget)}
        </p>
        <Slider
          min={10000}
          max={2000000}
          step={10000}
          value={[filters.maxBudget]}
          onValueChange={([val]) => setFilters((f) => ({ ...f, maxBudget: val }))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-mono">
          <span>₹10K</span><span>₹20L+</span>
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Industry */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Industry</p>
        <div className="flex flex-col gap-1">
          {["all", ...ALL_INDUSTRIES.slice(0, 6)].map((ind) => (
            <button
              key={ind}
              onClick={() => setFilters((f) => ({ ...f, industry: ind }))}
              className={`text-xs text-left px-3 py-1.5 rounded-sm transition-all ${
                filters.industry === ind
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {ind === "all" ? "All Industries" : ind}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100 dark:bg-zinc-800" />

      {/* Rating */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Min Rating: {filters.minRating === 0 ? "Any" : `${filters.minRating}+`}
        </p>
        <div className="flex gap-1.5">
          {[0, 4.0, 4.5, 4.7].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
              className={`flex-1 text-xs py-1.5 rounded-sm border transition-all ${
                filters.minRating === r
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          setFilters({ services: [], teamSize: "all", maxBudget: 2000000, industry: "all", minRating: 0 })
        }
        className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors text-left"
      >
        Reset all filters
      </button>
    </div>
  );
}

// Contact/Collab Confirm Dialog
function ContactConfirmDialog({ org, open, onClose, auth }) {
  if (!org) return null;
  const isOrg = auth.userType === "organization";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 gap-0 overflow-hidden">
        <div className={`h-0.75 w-full ${isOrg ? "bg-emerald-400" : "bg-sky-400"}`} />
        <div className="p-8">
          <div className={`w-14 h-14 rounded-sm flex items-center justify-center mx-auto mb-4 ${isOrg ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800" : "bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800"}`}>
            {isOrg
              ? <Handshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              : <MessageSquare className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            }
          </div>
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {isOrg ? "Propose Collaboration?" : "Contact Agency?"}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {isOrg
                ? `You're about to send a collaboration proposal to `
                : `You're about to send a contact request to `}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{org.name}</span>.
              {isOrg && " Org-to-org partnerships are a WorkHub USP."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              onClick={onClose}
              className={`w-full rounded-none font-semibold gap-2 ${isOrg ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white" : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isOrg ? "Send Proposal" : "Send Message"}
            </Button>
            <Button variant="ghost" className="w-full rounded-none text-zinc-500 dark:text-zinc-400 text-sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

