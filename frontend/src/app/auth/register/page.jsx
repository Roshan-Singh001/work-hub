"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Building2, User, Briefcase, ArrowRight,
    Upload, Globe, Phone, Mail, Lock, FileText,
} from "lucide-react"

// Roles
const ROLES = [
    { value: "orgs",       label: "Organization", icon: Building2, description: "Scale teams" },
    { value: "client",     label: "Client",        icon: User,      description: "Hire talent" },
    { value: "freelancer", label: "Freelancer",    icon: Briefcase, description: "Find work"  },
]

// Zod Schemas

const accountSchema = {
    email:    z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
}

const clientSchema = z.object({
    firstName:    z.string().min(1, "First name is required"),
    lastName:     z.string().min(1, "Last name is required"),
    organization: z.string().optional(),
    country:      z.string().min(1, "Please select a country"),
    phone:        z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number"),
    ...accountSchema,
})

const freelancerSchema = z.object({
    firstName:         z.string().min(1, "First name is required"),
    lastName:          z.string().min(1, "Last name is required"),
    professionalTitle: z.string().min(2, "Enter your professional title"),
    country:           z.string().min(1, "Please select a country"),
    phone:             z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number"),
    skillCategory:     z.string().min(1, "Please select a skill category"),
    about:             z.string().min(20, "Please write at least 20 characters"),
    ...accountSchema,
})

const orgsSchema = z.object({
    orgName:     z.string().min(2, "Organization name is required"),
    industry:    z.string().min(1, "Please select an industry"),
    companySize: z.number().min(1, "Please select company size"),
    country:     z.string().min(1, "Please select a country"),
    phone:       z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number"),
    website:     z.string().optional(),
    about:       z.string().min(20, "Please write at least 20 characters"),
    firstName:   z.string().min(1, "First name is required"),
    lastName:    z.string().min(1, "Last name is required"),
    ...accountSchema,
})

const schemaMap = {
    client:     clientSchema,
    freelancer: freelancerSchema,
    orgs:       orgsSchema,
}

function SectionDivider({ label }) {
    return (
        <div className="flex items-center gap-2 py-1">
            <Separator className="flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-1">
                {label}
            </span>
            <Separator className="flex-1" />
        </div>
    )
}

function CountrySelect({ value, onChange, invalid }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger aria-invalid={invalid}>
                <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="in">🇮🇳 India</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>
    )
}

function UploadZone({ label, onChange }) {
    return (
        <Field>
            <FieldLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Upload className="w-3 h-3" /> {label}
            </FieldLabel>
            <label className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer group flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-xs text-muted-foreground">Click to upload or drag & drop</p>
                <p className="text-[10px] text-muted-foreground/60">PDF, PNG, JPG — up to 10MB</p>
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={onChange} />
            </label>
        </Field>
    )
}

function AccountFields({ control }) {
    return (
        <>
            <SectionDivider label="Account" />

            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> Email Address
                        </FieldLabel>
                        <Input {...field} id="email" type="email" placeholder="you@example.com" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Lock className="w-3 h-3" /> Password
                        </FieldLabel>
                        <Input {...field} id="password" type="password" placeholder="Min. 8 characters" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        </>
    )
}

// Client Form

function Client({ onSuccess }) {
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(clientSchema),
    })

    async function onSubmit(data) {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "client", ...data }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.message || "Registration failed")
            onSuccess?.(json)
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SectionDivider label="Personal Info" />

            <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.firstName}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input {...register("firstName")} id="firstName" placeholder="John" aria-invalid={!!errors.firstName} />
                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                </Field>

                <Field data-invalid={!!errors.lastName}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input {...register("lastName")} id="lastName" placeholder="Doe" aria-invalid={!!errors.lastName} />
                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                </Field>
            </div>

            <Field data-invalid={!!errors.organization}>
                <FieldLabel htmlFor="organization" className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Organization <span className="text-muted-foreground font-normal">(Optional)</span>
                </FieldLabel>
                <Input {...register("organization")} id="organization" placeholder="Your company or org name" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="country" className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3" /> Country
                            </FieldLabel>
                            <CountrySelect value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field data-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone" className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> Phone
                    </FieldLabel>
                    <Input {...register("phone")} id="phone" type="tel" placeholder="+1 555 0000" aria-invalid={!!errors.phone} />
                    {errors.phone && <FieldError errors={[errors.phone]} />}
                </Field>
            </div>

            <AccountFields control={control} />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 gap-2 h-11 font-semibold">
                {isSubmitting ? "Creating account…" : <>Create Client Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
        </form>
    )
}

// Freelancer form

function Freelancer({ onSuccess }) {
    const { control, register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(freelancerSchema),
    })

    async function onSubmit(data) {
        try {
            const formData = new FormData()
            formData.append("role", "freelancer")
            Object.entries(data).forEach(([k, v]) => {
                if (v instanceof FileList) formData.append(k, v[0])
                else formData.append(k, v ?? "")
            })

            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: formData, 
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.message || "Registration failed")
            onSuccess?.(json)
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SectionDivider label="Personal Info" />

            <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.firstName}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input {...register("firstName")} id="firstName" placeholder="Jane" aria-invalid={!!errors.firstName} />
                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                </Field>

                <Field data-invalid={!!errors.lastName}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input {...register("lastName")} id="lastName" placeholder="Smith" aria-invalid={!!errors.lastName} />
                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                </Field>
            </div>

            <Field data-invalid={!!errors.professionalTitle}>
                <FieldLabel htmlFor="professionalTitle">Professional Title</FieldLabel>
                <Input {...register("professionalTitle")} id="professionalTitle" placeholder="e.g. Full-Stack Developer" aria-invalid={!!errors.professionalTitle} />
                {errors.professionalTitle && <FieldError errors={[errors.professionalTitle]} />}
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Country</FieldLabel>
                            <CountrySelect value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field data-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone" className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</FieldLabel>
                    <Input {...register("phone")} id="phone" type="tel" placeholder="+1 555 0000" aria-invalid={!!errors.phone} />
                    {errors.phone && <FieldError errors={[errors.phone]} />}
                </Field>
            </div>

            <Controller
                name="skillCategory"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Skill Category</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dev">💻 Software Development</SelectItem>
                                <SelectItem value="design">🎨 Design & Creative</SelectItem>
                                <SelectItem value="marketing">📣 Marketing</SelectItem>
                                <SelectItem value="writing">✍️ Writing & Content</SelectItem>
                                <SelectItem value="data">📊 Data & Analytics</SelectItem>
                                <SelectItem value="other">🔧 Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Field data-invalid={!!errors.about}>
                <FieldLabel htmlFor="about" className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> About You</FieldLabel>
                <Textarea
                    {...register("about")}
                    id="about"
                    placeholder="Describe your skills, experience, and what you offer..."
                    className="resize-none text-sm"
                    rows={3}
                    aria-invalid={!!errors.about}
                />
                {errors.about && <FieldError errors={[errors.about]} />}
            </Field>

            <UploadZone label="Portfolio / Resume / Certificate" onChange={(e) => setValue("portfolio", e.target.files)} />

            <AccountFields control={control} />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 gap-2 h-11 font-semibold">
                {isSubmitting ? "Creating account…" : <>Create Freelancer Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
        </form>
    )
}

// Organization form

function Orgs({ onSuccess }) {
    const { control, register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(orgsSchema),
    })

    async function onSubmit(data) {
        try {
            const formData = new FormData()
            formData.append("role", "orgs")
            Object.entries(data).forEach(([k, v]) => {
                if (v instanceof FileList) formData.append(k, v[0])
                else formData.append(k, v ?? "")
            })

            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: formData,
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.message || "Registration failed")
            onSuccess?.(json)
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SectionDivider label="Organization Details" />

            <Field data-invalid={!!errors.orgName}>
                <FieldLabel htmlFor="orgName" className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Organization Name</FieldLabel>
                <Input {...register("orgName")} id="orgName" placeholder="Acme Corp" aria-invalid={!!errors.orgName} />
                {errors.orgName && <FieldError errors={[errors.orgName]} />}
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Controller
                    name="industry"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Industry</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger aria-invalid={fieldState.invalid}><SelectValue placeholder="Industry" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tech">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="media">Media</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="companySize"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Company Size</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger aria-invalid={fieldState.invalid}><SelectValue placeholder="Size" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-10">1–10</SelectItem>
                                    <SelectItem value="11-50">11–50</SelectItem>
                                    <SelectItem value="51-200">51–200</SelectItem>
                                    <SelectItem value="201-1000">201–1000</SelectItem>
                                    <SelectItem value="1000+">1000+</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Country</FieldLabel>
                            <CountrySelect value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field data-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone" className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</FieldLabel>
                    <Input {...register("phone")} id="phone" type="tel" placeholder="+1 555 0000" aria-invalid={!!errors.phone} />
                    {errors.phone && <FieldError errors={[errors.phone]} />}
                </Field>
            </div>

            <Field data-invalid={!!errors.website}>
                <FieldLabel htmlFor="website">Website</FieldLabel>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs text-muted-foreground border border-r-0 rounded-l-md bg-muted border-input">
                        https://
                    </span>
                    <Input {...register("website")} id="website" placeholder="yourcompany.com" className="rounded-l-none" />
                </div>
            </Field>

            <Field data-invalid={!!errors.about}>
                <FieldLabel htmlFor="about" className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> About the Organization</FieldLabel>
                <Textarea
                    {...register("about")}
                    id="about"
                    placeholder="Describe your organization, mission, and what you do..."
                    className="resize-none text-sm"
                    rows={3}
                    aria-invalid={!!errors.about}
                />
                {errors.about && <FieldError errors={[errors.about]} />}
            </Field>

            <SectionDivider label="Owner / Admin" />

            <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.firstName}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input {...register("firstName")} id="firstName" placeholder="Alex" aria-invalid={!!errors.firstName} />
                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                </Field>

                <Field data-invalid={!!errors.lastName}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input {...register("lastName")} id="lastName" placeholder="Johnson" aria-invalid={!!errors.lastName} />
                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                </Field>
            </div>

            <UploadZone label="Business Registration / License" onChange={(e) => setValue("license", e.target.files)} />

            <AccountFields control={control} />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 gap-2 h-11 font-semibold">
                {isSubmitting ? "Creating account…" : <>Create Organization Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
        </form>
    )
}

export default function Register() {
    const [role, setRole] = useState("")

    function handleSuccess(data) {
        console.log("Registered:", data)
        // e.g. router.push("/dashboard")
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-150 space-y-5">

                <div className="text-center space-y-1 mt-4">
                    <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                </div>

                <Card className="shadow-xl border-slate-200/80">
                    <CardContent className="pt-6 pb-6 px-6 space-y-4">

                        {/* Role picker */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                I want to register as a
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {ROLES.map(({ value, label, icon: Icon, description }) => {
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
                                            <span className="text-[10px] text-muted-foreground leading-tight">
                                                {description}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {role === "client" && <Client onSuccess={handleSuccess} />}
                        {role === "freelancer" && <Freelancer onSuccess={handleSuccess} />}
                        {role === "orgs" && <Orgs onSuccess={handleSuccess} />}

                        {!role && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                Select a role above to continue →
                            </p>
                        )}

                        <p className="text-xs text-center text-muted-foreground pt-1">
                            Already have an account?{" "}
                            <a href="/login" className="text-primary font-semibold hover:underline">Sign in</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}