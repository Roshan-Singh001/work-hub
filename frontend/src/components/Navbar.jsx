"use client"
import { useState, useEffect } from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Menu,
    Briefcase,
    Search,
    Users,
    UserCheck,
    Building2,
    Zap,
    ChevronRight,
    ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileHireOpen, setMobileHireOpen] = useState(false)

    const hireTalentLinks = [
    {
        href: "/hire/freelancer",
        icon: UserCheck,
        label: "Hire Freelancer",
        description: "Find skilled individuals for your projects",
        badge: null,
    },
    {
        href: "/hire/organization",
        icon: Building2,
        label: "Hire Organization",
        description: "Partner with agencies & teams",
        badge: "New",
    },
]

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 border-b-2 border-white/30 z-50 bg-black transition-all duration-300 ${
                scrolled ? "border-b shadow-sm" : ""
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-xl font-bold tracking-tight">
                            Work<span className="text-muted-foreground">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList>

                                <NavigationMenuItem>
                                    <Link href="/" passHref>
                                        <NavigationMenuLink className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none cursor-pointer">
                                            Home
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Link href="/find-work" passHref>
                                        <NavigationMenuLink className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none cursor-pointer">
                                            Find Work
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                                        Hire Talent
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[320px] p-3">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 pb-2">
                                                Choose how you hire
                                            </p>
                                            <ul className="space-y-1">
                                                {hireTalentLinks.map(({ href, icon: Icon, label, description, badge }) => (
                                                    <li key={href}>
                                                        <Link href={href} passHref>
                                                            <NavigationMenuLink className="group flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors cursor-pointer">
                                                                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium">
                                                                            {label}
                                                                        </span>
                                                                        {badge && (
                                                                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                                                                                {badge}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                        {description}
                                                                    </p>
                                                                </div>
                                                                <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Separator className="my-2" />
                                            <div className="px-2 py-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Not sure?{" "}
                                                    <Link href="/hire/guide" className="font-medium text-foreground underline-offset-4 hover:underline">
                                                        See hiring guide →
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden lg:flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">Sign up</Button>
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-80 p-0">
                                <div className="flex flex-col h-full">

                                    {/* Mobile Header */}
                                    <div className="flex items-center px-5 py-4 border-b">
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Zap className="w-5 h-5" />
                                            <span className="text-lg font-bold">
                                                Work<span className="text-muted-foreground">Hub</span>
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Mobile Links */}
                                    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                                        <Link
                                            href="/"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                                        >
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            Home
                                        </Link>

                                        <Link
                                            href="/find-work"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                                        >
                                            <Search className="w-4 h-4 text-muted-foreground" />
                                            Find Work
                                        </Link>

                                        <div>
                                            <button
                                                onClick={() => setMobileHireOpen(!mobileHireOpen)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                                            >
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="flex-1 text-left">Hire Talent</span>
                                                <ChevronRight
                                                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                                        mobileHireOpen ? "rotate-90" : ""
                                                    }`}
                                                />
                                            </button>

                                            {mobileHireOpen && (
                                                <div className="ml-10 mt-1 space-y-1">
                                                    {hireTalentLinks.map(({ href, icon: Icon, label, description, badge }) => (
                                                        <Link
                                                            key={href}
                                                            href={href}
                                                            onClick={() => setMobileOpen(false)}
                                                            className="flex items-start gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-accent transition-colors"
                                                        >
                                                            <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">{label}</span>
                                                                    {badge && (
                                                                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                                                                            {badge}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </nav>

                                    {/* Mobile Auth */}
                                    <div className="px-4 py-5 border-t space-y-2">
                                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                                            <Button variant="outline" className="w-full">Log in</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setMobileOpen(false)}>
                                            <Button className="w-full">Sign up</Button>
                                        </Link>
                                    </div>

                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </div>
        </nav>
    )
}