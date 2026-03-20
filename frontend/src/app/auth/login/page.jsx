"use client"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
    Building2, User, Briefcase, ArrowRight,
    Upload, Globe, Phone, Mail, Lock, FileText, ShieldUser,
} from "lucide-react"

import { toast } from "sonner"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ROLES = [
    { value: "Orgs", label: "Organization", icon: Building2 },
    { value: "Client", label: "Client", icon: User },
    { value: "Freelancer", label: "Freelancer", icon: Briefcase },
    { value: "Admin", label: "Admin", icon: ShieldUser },
]

const accountSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export default function Login() {
    const [role, setRole] = useState("");
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(accountSchema),
    })

    async function onSubmit(data) {
        console.log("Submitting login for role:", role, "with data:", data)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: role, ...data }),
                credentials: "include",
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.message || "Login failed")
            toast.success("Logged in Successfully");
            handleSuccess(json)
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Login failed: " + err.message);
        }
    }


    function handleSuccess(data) {
        console.log("Logged in:", data)
        if(data.role === "Admin"){
            console.log("Redirecting to admin dashboard");
            router.push("/admin/dashboard");
        }
        else if(data.role === "ORG_Owner"){
            router.push("/orgs/admin/dashboard");
        }
        else if(data.role === "ORG_Member"){
            router.push("/orgs/member/dashboard");
        }
        else if(data.role === "Freelancer"){
            router.push("/freelancer/dashboard");
        }
        else if(data.role === "Client"){
            router.push("/client/dashboard");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-150 space-y-5">

                <div className="text-center space-y-1 mt-4">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back! Log in to continue</h1>
                </div>

                <Card className="shadow-xl border-slate-200/80">
                    <CardContent className="pt-6 pb-6 px-6 space-y-4">

                        {/* Role picker */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Login as a
                            </Label>
                            <div className="grid grid-cols-4 gap-2">
                                {ROLES.map(({ value, label, icon: Icon }) => {
                                    const active = role === value
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRole(value)}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-150
                                                ${active
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-xs font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                                                {label}
                                            </span>

                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {role && (<>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex items-center gap-2 py-1">
                                    <Separator className="flex-1" />
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-1">
                                        ENTER YOUR CREDENTIALS
                                    </span>
                                    <Separator className="flex-1" />
                                </div>

                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </FieldLabel>
                                    <Input {...register("email")} id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
                                    {errors.email && <FieldError errors={[errors.email]} />}
                                </Field>

                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                        <Lock className="w-3 h-3" /> Password
                                    </FieldLabel>
                                    <Input {...register("password")} id="password" type="password" placeholder="Min. 8 characters" aria-invalid={!!errors.password} />
                                    {errors.password && <FieldError errors={[errors.password]} />}
                                </Field>

                                <Button type="submit" disabled={isSubmitting} className="w-full mt-2 gap-2 h-11 font-semibold">
                                    {isSubmitting ? "Logging in…" : <>Log in <ArrowRight className="w-4 h-4" /></>}
                                </Button>
                            </form>

                        </>
                        )}

                        {!role && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                Select a role above to continue →
                            </p>
                        )}

                        <p className="text-xs text-center text-muted-foreground pt-1">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary font-semibold hover:underline">Register</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}