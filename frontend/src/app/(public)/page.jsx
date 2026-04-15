"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const carouselWords = [
  { word: "Workforce", color: "text-amber-400 dark:text-amber-400" },
  { word: "Projects", color: "text-sky-400 dark:text-sky-400" },
  { word: "Clients", color: "text-emerald-400 dark:text-emerald-400" },
  { word: "Freelancers", color: "text-rose-400 dark:text-rose-400" },
];

const tickerItems = [
  "Multi-Tenant SaaS",
  "Role-Based Access",
  "Client Portal",
  "Freelancer Marketplace",
  "Project Management",
  "Invoice Generation",
  "Task Tracking",
  "Secure Auth",
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % carouselWords.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const current = carouselWords[index];

  return (
    <span
      className={`inline-block mt-4 transition-all duration-300 ${current.color} ${visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-3"
        }`}
      style={{ minWidth: "280px", display: "inline-block" }}
    >
      {current.word}
    </span>
  );
}

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-zinc-800 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 py-3">
      <div className="flex animate-ticker gap-12 whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span
            key={i}
            className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500 flex items-center gap-3"
          >
            <span className="w-1 h-1 rounded-full bg-zinc-600 dark:bg-zinc-600 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Features
const features = [
  {
    num: "01",
    title: "Organization OS",
    desc: "Manage employees, assign roles, set permissions. A structured hierarchy that scales from solo founders to full agencies — without switching between apps.",
    tag: "Internal",
  },
  {
    num: "02",
    title: "Freelancer Network",
    desc: "Source talent, send task requests, track deliverables. WorkHub replaces the chaotic email thread and the overpriced marketplace fee.",
    tag: "External",
  },
  {
    num: "03",
    title: "Client Portal",
    desc: "Clients see what they need — milestones, progress, invoices. Nothing more. A transparency layer that builds trust without exposing internals.",
    tag: "Clients",
  },
  {
    num: "04",
    title: "Task Engine",
    desc: "Projects break into tasks. Tasks have owners, priorities, deadlines, and comments. The work pipeline has never been this visible.",
    tag: "Workflow",
  },
  {
    num: "05",
    title: "Revenue Tracking",
    desc: "Every project, invoice, and payment in one place. Your accountant will stop using spreadsheets. Your boss will stop asking for updates.",
    tag: "Finance",
  },
  {
    num: "06",
    title: "SaaS Access Control",
    desc: "Free, Pro, and Enterprise plans. Middleware-enforced feature limits. Real subscription logic baked into the platform architecture.",
    tag: "Platform",
  },
];

// Scenarios
const scenarios = [
  {
    label: "Solo Founder",
    steps: ["Register as Owner", "Add Client", "Create Project", "Assign Tasks", "Generate Invoice"],
  },
  {
    label: "Small Agency",
    steps: ["Create Org", "Invite Employees", "Set Roles", "Assign Projects", "Track Progress"],
  },
  {
    label: "Outsourcing",
    steps: ["Internal Project", "Find Freelancer", "Send Task", "Track Delivery", "Log Payment"],
  },
];

// Stats
const stats = [
  { value: "5", label: "System Roles" },
  { value: "6+", label: "Core Modules" },
  { value: "100%", label: "RBAC Control " },
  { value: "0", label: "Setup Complexity" },
];

// Plans
const plans = [
  {
    name: "Free",
    price: "₹0",
    note: "Forever",
    features: ["1 Organization", "Up to 3 Employees", "5 Projects", "Basic Analytics", "Client Portal"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹XXX",
    note: "per month",
    features: ["Unlimited Employees", "Unlimited Projects", "Freelancer Access", "Advanced Analytics", "Invoice Generation", "Priority Support"],
    cta: "Coming Soon",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "contact us",
    features: ["Everything in Pro", "Custom Roles & Permissions", "Dedicated Onboarding", "SLA Agreement", "API Access", "White-label Option"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans antialiased selection:bg-indigo-200 selection:text-slate-900">

        {/* HERO */}
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-36 pb-10 overflow-hidden">
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-500/5 blur-[120px]" />

          <div className="relative z-10 max-w-5xl">
            <h1 className="w-160 max-[400px]:w-fit text-6xl sm:text-6xl md:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter mb-6 text-slate-900 dark:text-white">
              One Hub.<br />
              Manage Your{" "}
              <HeroCarousel />
            </h1>

            <p className="mt-8 max-w-xl text-slate-600 dark:text-zinc-400 text-lg leading-relaxed font-light">
              WorkHub is a controlled business operating system - not just a task manager, not just a CRM.
              A single platform for internal teams, freelancers, and clients to work together without friction.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-white dark:bg-white text-black dark:text-black hover:bg-slate-100 dark:hover:bg-zinc-200 font-semibold rounded-none px-8 py-6 text-base tracking-tight"
              >
                Start for Free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-none px-8 py-6 text-base font-normal border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors"
              >
                See How It Works →
              </Button>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <Ticker />

        {/* STATS */}
        <section className="px-6 md:px-16 lg:px-24 py-20 border-b border-slate-200 dark:border-zinc-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{s.value}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-500 font-mono uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 md:px-16 lg:px-24 py-24">
          <div className="max-w-5xl">
            <p className="font-mono text-xs text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-4">Core Modules</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-16 leading-tight">
              Everything a business<br />
              <span className="text-slate-600 dark:text-zinc-500">actually needs.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-zinc-900">
              {features.map((f) => (
                <div
                  key={f.num}
                  className="bg-white dark:bg-zinc-950 p-8 group hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-mono text-xs text-slate-500 dark:text-zinc-700">{f.num}</span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono uppercase tracking-widest bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 rounded-none border-0"
                    >
                      {f.tag}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-500 leading-relaxed font-light">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / SCENARIOS */}
        <section className="px-6 md:px-16 lg:px-24 py-24 bg-slate-100/60 dark:bg-zinc-900/30 border-y border-slate-200 dark:border-zinc-900">
          <div className="max-w-5xl">
            <p className="font-mono text-xs text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-4">Use Cases</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-16 leading-tight">
              Built for how<br />
              <span className="text-slate-600 dark:text-zinc-500">real work happens.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {scenarios.map((s, si) => (
                <div key={s.label} className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="font-mono text-xs text-slate-500">0{si + 1}</span>
                    <Separator className="flex-1 bg-slate-200 dark:bg-zinc-800" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{s.label}</h3>
                  <ol className="space-y-3">
                    {s.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-500 dark:text-zinc-500 flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-zinc-400">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROLE ARCHITECTURE */}
        <section className="px-6 md:px-16 lg:px-24 py-24 border-b border-slate-200 dark:border-zinc-900">
          <div className="max-w-5xl">
            <p className="font-mono text-xs text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-4">Access Control</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">
              5 Roles.<br />
              <span className="text-slate-600 dark:text-zinc-500">Zero ambiguity.</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-500 mb-16 max-w-lg text-sm leading-relaxed">
              Role-Based Access Control is built into the core. Every action, every screen, every API route respects the role hierarchy.
            </p>

            <div className="flex flex-col gap-px">
              {[
                { role: "Super Admin", scope: "Platform Owner · Full Access", color: "bg-amber-400" },
                { role: "Organization Owner", scope: "Creates & controls org workspace", color: "bg-sky-400" },
                { role: "Employee", scope: "Assigned tasks & internal visibility", color: "bg-emerald-400" },
                { role: "Freelancer", scope: "External collaborator · Task-level access", color: "bg-rose-400" },
                { role: "Client", scope: "View-only portal · Progress & invoices", color: "bg-violet-400" },
              ].map((r, i) => (
                <div
                  key={r.role}
                  className="flex items-center gap-6 p-5 bg-slate-50/80 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${r.color}`} />
                  <span className="font-semibold text-slate-900 dark:text-white w-52 text-sm tracking-tight">{r.role}</span>
                  <span className="text-slate-600 dark:text-zinc-500 text-sm font-light">{r.scope}</span>
                  <span className="ml-auto font-mono text-xs text-slate-700 dark:text-zinc-800 group-hover:text-slate-500 dark:group-hover:text-zinc-600 transition-colors">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="px-6 md:px-16 lg:px-24 py-24 border-b border-slate-200 dark:border-zinc-900">
          <div className="max-w-5xl">
            <p className="font-mono text-xs text-slate-500 dark:text-zinc-600 uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-16 leading-tight">
              Simple plans.<br />
              <span className="text-slate-600 dark:text-zinc-500">Serious software.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`rounded-none border ${plan.highlight
                      ? "border-white dark:border-white bg-white dark:bg-white text-black dark:text-black"
                      : "border-slate-200 dark:border-zinc-800 bg-transparent text-slate-900 dark:text-zinc-100"
                    }`}
                >
                  <CardContent className="opacity-50 p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${plan.highlight ? "text-slate-500" : "text-slate-500 dark:text-zinc-600"}`}>
                          {plan.name}
                        </p>
                        <p className={`text-4xl font-black tracking-tighter ${plan.highlight ? "text-black" : "text-slate-900 dark:text-white"}`}>
                          {plan.price}
                        </p>
                        <p className={`text-xs mt-1 ${plan.highlight ? "text-slate-500" : "text-slate-500 dark:text-zinc-600"}`}>
                          {plan.note}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className={`text-sm flex items-center gap-3 ${plan.highlight ? "text-slate-700" : "text-slate-600 dark:text-zinc-400"}`}
                        >
                          <span className={`w-1 h-1 rounded-full shrink-0 ${plan.highlight ? "bg-black" : "bg-slate-400"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full rounded-none font-semibold tracking-tight ${plan.highlight
                          ? "bg-black text-white hover:bg-zinc-800"
                          : "bg-transparent text-slate-900 dark:text-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                        }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-16 lg:px-24 py-32 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-4">
              Stop patching
            </h2>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8 text-slate-600 dark:text-zinc-600">six tools together.</h2>
            <p className="text-slate-600 dark:text-zinc-500 text-lg font-light mb-12 max-w-lg leading-relaxed">
              WorkHub consolidates your entire operational stack. One login. One dashboard. One source of truth for your entire business.
            </p>
            <Button
              size="lg"
              className="bg-white dark:bg-white text-black dark:text-black hover:bg-slate-100 dark:hover:bg-zinc-200 rounded-none px-10 py-6 text-base font-semibold tracking-tight"
            >
              Get Early Access
            </Button>
          </div>
        </section>

        <Footer />

        {/* TICKER KEYFRAME */}
        <style jsx global>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 28s linear infinite;
        }
      `}</style>
      </div>
    </>
  );
}