"use client"
import { useState, useCallback } from "react"
import {
  ArrowLeft, Plus, X, Upload, Link2, FileText, Image as ImageIcon,
  Github, Figma, HardDrive, ChevronDown, Briefcase, Clock,
  Users, Building2, User, DollarSign, Calendar, Tag,
  Sparkles, Globe, Star, Layers, Info, CheckCircle2,
  AlertCircle, Trash2, ExternalLink, Paperclip, Bold,
  Italic, Underline, List, ListOrdered, Quote, Code2,
  Heading1, Heading2, AlignLeft, AlignCenter, Undo, Redo,
  Type, Strikethrough, Link, Minus
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExtension from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import {Placeholder} from "@tiptap/extensions"

// ─── Constants ────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "E-Commerce",
  "Real Estate", "Media & Entertainment", "Manufacturing", "Logistics",
  "Travel & Hospitality", "Legal", "Agriculture", "Energy", "Non-Profit",
]

const SKILLS_SUGGESTIONS = [
  "React", "Next.js", "Node.js", "Python", "TypeScript", "GraphQL",
  "AWS", "Docker", "Figma", "UI/UX", "iOS", "Android", "Machine Learning",
  "Blockchain", "PostgreSQL", "MongoDB", "DevOps", "Laravel",
]

export default function CreateProjectPage() {
  // Basic Info
  const [title, setTitle] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [projectType, setProjectType] = useState("")

  // Assignment
  const [assignedTo, setAssignedTo] = useState("")

  // Freelancer fields
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  // Organization fields
  const [industries, setIndustries] = useState([])

  // Budget & Timeline
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [deadline, setDeadline] = useState("")

  // Detail Dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailData, setDetailData] = useState({ content: "", files: [], links: [] })
  const hasDetails = detailData.content && detailData.content !== "<p></p>" && detailData.content !== ""

  const showFreelancerFields = assignedTo === "FREELANCER" || assignedTo === "BOTH"
  const showOrgFields = assignedTo === "ORGANIZATION" || assignedTo === "BOTH"

  function addSkill(s) {
    const trimmed = s.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
    }
    setSkillInput("")
  }

  function removeSkill(s) {
    setSkills(prev => prev.filter(sk => sk !== s))
  }

  function toggleIndustry(ind) {
    setIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind])
  }

  function handleSubmit() {
    const payload = {
      title, shortDesc, projectType, assignedTo,
      skills, experienceLevel, industries,
      minBudget, maxBudget, deadline,
      details: detailData,
    }
    console.log("Project payload:", payload)
    // Submit logic here
  }

  const budgetError = minBudget && maxBudget && Number(minBudget) > Number(maxBudget)

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
              <p className="text-sm text-muted-foreground mt-1">Fill in the details below to post your project and find the right talent.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">Save Draft</Button> */}
              <Button size="sm" className="text-xs gap-1.5 h-8" onClick={handleSubmit}>
                <Sparkles className="h-3.5 w-3.5" /> Publish Project
              </Button>
            </div>
          </div>
        </div>

        {/* ══ 1. Basic Info ══ */}
        <Section number="1" title="Basic Information" description="Introduce your project with a clear title and context." icon={Info} accent="bg-violet-500">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Project Title <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. Build a Full-Stack E-Commerce Platform"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">Write a clear, descriptive title that tells talent exactly what you need.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Short Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                placeholder="A brief 1–2 line summary shown in project listings..."
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                rows={2}
                maxLength={160}
                className="resize-none text-sm"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Appears as preview text in search results</span>
                <span>{shortDesc.length}/160</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Project Type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "FIXED", icon: Briefcase, label: "Fixed Price", desc: "Pay a set amount for the entire project" },
                  { value: "HOURLY", icon: Clock, label: "Hourly Rate", desc: "Pay per hour of work completed" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setProjectType(opt.value)}
                    className={cn(
                      "relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
                      projectType === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:bg-muted/30"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", projectType === opt.value ? "bg-primary/10" : "bg-muted")}>
                      <opt.icon className={cn("h-4 w-4", projectType === opt.value ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                    {projectType === opt.value && (
                      <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ══ 2. Assignment ══ */}
        <Section number="2" title="Assignment" description="Who should receive and work on this project?" icon={Users} accent="bg-blue-500">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "FREELANCER", icon: User, label: "Freelancer", desc: "Individual talent" },
              { value: "ORGANIZATION", icon: Building2, label: "Organization", desc: "Agency or team" },
              { value: "BOTH", icon: Globe, label: "Both", desc: "Open to all" },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAssignedTo(opt.value)}
                className={cn(
                  "relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 text-center transition-all hover:border-primary/50",
                  assignedTo === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className={cn("p-2.5 rounded-full", assignedTo === opt.value ? "bg-primary/10" : "bg-muted")}>
                  <opt.icon className={cn("h-4 w-4", assignedTo === opt.value ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                {assignedTo === opt.value && (
                  <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ══ 3. Conditional Fields ══ */}
        {(showFreelancerFields || showOrgFields) && (
          <Section number="3" title="Project Requirements" description="Specify what skills or industry experience you need." icon={Tag} accent="bg-emerald-500">
            <div className="space-y-5">

              {/* Freelancer Fields */}
              {showFreelancerFields && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <User className="h-3.5 w-3.5" />
                    <span>Freelancer Requirements</span>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Required Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill (e.g. React, Python...)"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput) }
                          if (e.key === ",") { e.preventDefault(); addSkill(skillInput) }
                        }}
                        className="h-8 text-sm flex-1"
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={() => addSkill(skillInput)}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map(s => <SkillTag key={s} skill={s} onRemove={removeSkill} />)}
                      </div>
                    )}

                    {/* Suggestions */}
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Suggestions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILLS_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addSkill(s)}
                            className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border rounded-full px-2.5 py-0.5 transition-colors"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Experience Level</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "BEGINNER", label: "Beginner", desc: "0–2 years", stars: 1 },
                        { value: "INTERMEDIATE", label: "Intermediate", desc: "2–5 years", stars: 2 },
                        { value: "EXPERT", label: "Expert", desc: "5+ years", stars: 3 },
                      ].map(lvl => (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setExperienceLevel(lvl.value)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 px-2 text-center transition-all",
                            experienceLevel === lvl.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <div className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star key={i} className={cn("h-3 w-3", i < lvl.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
                            ))}
                          </div>
                          <p className="text-xs font-semibold">{lvl.label}</p>
                          <p className="text-xs text-muted-foreground">{lvl.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showFreelancerFields && showOrgFields && <Separator />}

              {/* Organization Fields */}
              {showOrgFields && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Organization Requirements</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Industry <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/20 min-h-15">
                      {INDUSTRIES.map(ind => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => toggleIndustry(ind)}
                          className={cn(
                            "text-xs rounded-full px-3 py-1 border transition-all font-medium",
                            industries.includes(ind)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                    {industries.length > 0 && (
                      <p className="text-xs text-muted-foreground">{industries.length} industr{industries.length === 1 ? "y" : "ies"} selected</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ══ 4. Budget & Timeline ══ */}
        <Section number={showFreelancerFields || showOrgFields ? "4" : "3"} title="Budget & Timeline" description="Set your budget range and project deadline." icon={DollarSign} accent="bg-orange-500">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Budget Range (₹)</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
                    <Input
                      type="number"
                      placeholder="Min budget"
                      value={minBudget}
                      onChange={e => setMinBudget(e.target.value)}
                      className="h-9 pl-7 text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">Minimum</p>
                </div>
                <div className="text-muted-foreground text-sm font-medium shrink-0 pb-5">—</div>
                <div className="flex-1 space-y-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
                    <Input
                      type="number"
                      placeholder="Max budget"
                      value={maxBudget}
                      onChange={e => setMaxBudget(e.target.value)}
                      className={cn("h-9 pl-7 text-sm", budgetError && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">Maximum</p>
                </div>
              </div>
              {budgetError && (
                <div className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Maximum budget must be greater than minimum.
                </div>
              )}
              {minBudget && maxBudget && !budgetError && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Budget range: ₹{Number(minBudget).toLocaleString("en-IN")} – ₹{Number(maxBudget).toLocaleString("en-IN")}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Project Deadline
              </Label>
              <Input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-9 text-sm max-w-xs"
              />
              {deadline && (
                <p className="text-xs text-muted-foreground">
                  Due {new Date(deadline).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ══ 5. Project Details (Dialog) ══ */}
        <Card className={cn("overflow-hidden border-2 transition-colors", hasDetails ? "border-primary/30 bg-primary/5" : "border-dashed")}>
          <CardContent className="py-5 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn("p-2.5 rounded-xl shrink-0", hasDetails ? "bg-primary/10" : "bg-muted")}>
                  <Layers className={cn("h-5 w-5", hasDetails ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="text-sm font-semibold flex items-center gap-2">
                    Detailed Project Description
                    {hasDetails && <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Added</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {hasDetails
                      ? "Rich description, attachments."
                      : "Add full description, requirements, features, scope and files."}
                  </p>
                  {hasDetails && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {detailData.files.length > 0 && (
                        <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" />{detailData.files.length} file{detailData.files.length !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant={hasDetails ? "outline" : "default"}
                size="sm"
                className="gap-1.5 text-xs shrink-0"
                onClick={() => setDetailDialogOpen(true)}
              >
                {hasDetails ? (
                  <><Edit2 className="h-3.5 w-3.5" /> Edit Details</>
                ) : (
                  <><Plus className="h-3.5 w-3.5" /> Add Detailed Description</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          {/* <Button variant="outline" size="sm" className="text-sm h-10 flex-1 sm:flex-none sm:min-w-32">
            Save as Draft
          </Button> */}
          <Button
            size="sm"
            className="text-sm h-10 flex-1 gap-2"
            onClick={handleSubmit}
            disabled={!title || !projectType || !assignedTo || budgetError}
          >
            <Sparkles className="h-4 w-4" />
            Publish Project
          </Button>
        </div>
      </div>

      {/* ── Detail Dialog ── */}
      <ProjectDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        data={detailData}
        onSave={setDetailData}
      />
    </div>
  )
}

// TipTap Toolbar 
function EditorToolbar({ editor }) {
  if (!editor) return null

  const tools = [
    {
      group: "history",
      items: [
        { icon: Undo, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: "Undo" },
        { icon: Redo, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: "Redo" },
      ]
    },
    {
      group: "format",
      items: [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
        { icon: Underline, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strikethrough" },
        { icon: Code2, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), title: "Inline Code" },
      ]
    },
    {
      group: "headings",
      items: [
        { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), title: "H1" },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "H2" },
      ]
    },
    {
      group: "lists",
      items: [
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullet List" },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Ordered List" },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Blockquote" },
        { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), title: "Divider" },
      ]
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1.5 rounded-t-lg">
      {tools.map((group, gi) => (
        <div key={group.group} className="flex items-center gap-0.5">
          {gi > 0 && <div className="w-px h-5 bg-border mx-1" />}
          {group.items.map((tool) => (
            <Button
              key={tool.title}
              type="button"
              variant="ghost"
              size="sm"
              title={tool.title}
              disabled={tool.disabled}
              onClick={tool.action}
              className={cn(
                "h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground",
                tool.active && "bg-primary/10 text-primary"
              )}
            >
              <tool.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}

function ProjectDetailDialog({ open, onOpenChange, data, onSave }) {
  const [localFiles, setLocalFiles] = useState(data.files || [])
  const [dragActive, setDragActive] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your full project description here. Include requirements, features, scope, and any other important details..." }),
    ],
    content: data.content || "",
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[220px] px-4 py-3 text-sm leading-relaxed" }
    },
    immediatelyRender: false,
  })

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  function addFiles(files) {
    const mapped = files.map(f => ({ name: f.name, size: f.size, type: f.type, id: `f${Date.now()}${Math.random()}` }))
    setLocalFiles(prev => [...prev, ...mapped])
  }

  function removeFile(id) {
    setLocalFiles(prev => prev.filter(f => f.id !== id))
  }

  function handleSave() {
    onSave({ content: editor?.getHTML() || "", files: localFiles })
    onOpenChange(false)
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            Project Detailed Description
          </DialogTitle>
          <DialogDescription className="text-xs">
            Add a comprehensive description with requirements, features, and supporting materials.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Rich Text Editor */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" /> Full Description
              </Label>
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 bg-background">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
              <p className="text-xs text-muted-foreground">Use the toolbar to format your content with headings, lists, quotes, and more.</p>
            </div>

            <Separator />

            {/* File Attachments */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" /> Attachments
              </Label>

              {/* Drop Zone */}
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer hover:border-primary/50 hover:bg-muted/30",
                  dragActive ? "border-primary bg-primary/5" : "border-border"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => {
                  const inp = document.createElement("input")
                  inp.type = "file"; inp.multiple = true
                  inp.onchange = (e) => addFiles(Array.from(e.target.files))
                  inp.click()
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2.5 rounded-full bg-muted">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drop files or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PDF, images, docs up to 25MB</p>
                  </div>
                </div>
              </div>

              {/* File List */}
              {localFiles.length > 0 && (
                <div className="space-y-2">
                  {localFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg border">
                      <div className="p-1.5 bg-background rounded-md border shrink-0">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500" onClick={() => removeFile(file.id)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Section({ number, title, description, icon: Icon, children, accent = "bg-blue-500" }) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className={cn("h-0.5 w-full", accent)} />
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
            {number}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {title}
            </CardTitle>
            {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 pb-5">
        {children}
      </CardContent>
    </Card>
  )
}

function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-medium">
      {skill}
      <button type="button" onClick={() => onRemove(skill)} className="ml-0.5 hover:text-red-500 transition-colors">
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}
