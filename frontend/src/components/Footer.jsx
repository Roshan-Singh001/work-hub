"use client"
import { Separator } from "@/components/ui/separator";

export default function Footer() {

    return (
        <footer className="border-t border-slate-200 dark:border-zinc-900 px-6 md:px-16 lg:px-24 py-16">
            <div className="max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">WorkHub</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-600 leading-relaxed font-light">
                            A controlled business operating system for teams, freelancers, and clients.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-600 mb-4">Product</p>
                        <ul className="space-y-3">
                            {["Features", "Pricing", "Changelog", "Roadmap"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-600 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-600 mb-4">Platform</p>
                        <ul className="space-y-3">
                            {["Organization", "Freelancers", "Client Portal", "Analytics"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-600 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-600 mb-4">Company</p>
                        <ul className="space-y-3">
                            {["About", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-600 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-zinc-900 mb-8" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="text-xs text-slate-600 dark:text-zinc-700 font-mono">
                        © {new Date().getFullYear()} WorkHub. Built By Roshan Singh. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {["GitHub", "Twitter", "LinkedIn"].map((s) => (
                            <a
                                key={s}
                                href="#"
                                className="text-xs font-mono text-slate-600 dark:text-zinc-700 hover:text-slate-500 dark:hover:text-zinc-400 transition-colors uppercase tracking-widest"
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}