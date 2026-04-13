"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Users,
    UserPlus,
    Search,
    Mail,
    Phone,
    Briefcase,
    ShieldCheck,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock,
    MoreHorizontal,
    Filter,
    ChevronDown,
    UserCircle2,
    Building2,
    FolderOpen,
    Star,
    AlertTriangle,
    Eye,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const MOCK_MEMBERS = [
    {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        role: "Admin",
        department: "Engineering",
        status: "Active",
        joinedAt: "2023-04-12T00:00:00Z",
        avatar: "",
        projectsCount: 8,
        tasksCompleted: 42,
        bio: "Full-stack developer with 6+ years of experience in React and Node.js.",
    },
    {
        id: 2,
        name: "Priya Mehta",
        email: "priya.mehta@example.com",
        phone: "+91 91234 56789",
        role: "Manager",
        department: "Design",
        status: "Active",
        joinedAt: "2023-06-01T00:00:00Z",
        avatar: "",
        projectsCount: 5,
        tasksCompleted: 31,
        bio: "UI/UX designer passionate about accessible, user-centric products.",
    },
    {
        id: 3,
        name: "Rohan Verma",
        email: "rohan.verma@example.com",
        phone: "+91 99887 66554",
        role: "Member",
        department: "Marketing",
        status: "Inactive",
        joinedAt: "2024-01-15T00:00:00Z",
        avatar: "",
        projectsCount: 2,
        tasksCompleted: 9,
        bio: "Growth marketer focused on SEO and content strategy.",
    },
    {
        id: 4,
        name: "Sneha Iyer",
        email: "sneha.iyer@example.com",
        phone: "+91 87654 32109",
        role: "Member",
        department: "Engineering",
        status: "Active",
        joinedAt: "2023-11-20T00:00:00Z",
        avatar: "",
        projectsCount: 6,
        tasksCompleted: 27,
        bio: "Backend engineer specialising in microservices and cloud infrastructure.",
    },
    {
        id: 5,
        name: "Kabir Nair",
        email: "kabir.nair@example.com",
        phone: "+91 77889 90011",
        role: "Manager",
        department: "Sales",
        status: "Pending",
        joinedAt: "2024-03-05T00:00:00Z",
        avatar: "",
        projectsCount: 3,
        tasksCompleted: 14,
        bio: "Sales strategist with a track record in B2B SaaS.",
    },
];

const ROLES = ["Admin", "Manager", "Member"];
const STATUSES = ["Active", "Inactive", "Pending"];

export default function AllMembersPage() {
    const { userData } = useAuth();

    const [members, setMembers] = useState(MOCK_MEMBERS);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");

    const [selectedMember, setSelectedMember] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    // Derived stats
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === "Active").length;
    const adminCount = members.filter((m) => m.role === "Admin").length;
    const pendingCount = members.filter((m) => m.status === "Pending").length;

    // Filtered list
    const filtered = members.filter((m) => {
        const matchSearch =
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || m.role === roleFilter;
        const matchStatus = statusFilter === "all" || m.status === statusFilter;
        const matchDept = deptFilter === "all" || m.department === deptFilter;
        return matchSearch && matchRole && matchStatus && matchDept;
    });

    function handleViewDetail(member) {
        setSelectedMember(member);
        setDetailOpen(true);
    }

    function handleAddMember(newMember) {
        setMembers((prev) => [newMember, ...prev]);
    }

    const uniqueDepts = [...new Set(members.map((m) => m.department).filter(Boolean))];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Team Members
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {userData?.orgName || "Your Organization"} &middot;{" "}
                            <span className="font-medium text-foreground">
                                {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-1.5 h-9"
                        onClick={() => setAddOpen(true)}
                    >
                        <UserPlus className="h-4 w-4" /> Add Member
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Members" value={totalMembers} />
                    <StatCard icon={CheckCircle2} label="Active Members" value={activeMembers} highlight />
                    <StatCard icon={ShieldCheck} label="Admins" value={adminCount} />
                    <StatCard icon={Clock} label="Pending Approvals" value={pendingCount} />
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <CardTitle className="text-base">All Members</CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    {filtered.length} of {totalMembers} members
                                </CardDescription>
                            </div>
                        </div>

                        {/* Search + Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8 h-8 text-sm"
                                />
                            </div>

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="h-8 text-xs w-full sm:w-36">
                                    <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-xs">All Roles</SelectItem>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r} value={r} className="text-xs capitalize">{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-8 text-xs w-full sm:w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={deptFilter} onValueChange={setDeptFilter}>
                                <SelectTrigger className="h-8 text-xs w-full sm:w-40">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                                    {uniqueDepts.map((d) => (
                                        <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <Users className="h-9 w-9" />
                                <p className="text-sm font-medium">No members found</p>
                                <p className="text-xs">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 text-xs">Member</TableHead>
                                        <TableHead className="text-xs">Department</TableHead>
                                        <TableHead className="text-xs">Role</TableHead>
                                        <TableHead className="text-xs">Status</TableHead>
                                        <TableHead className="text-xs">Projects</TableHead>
                                        <TableHead className="text-xs">Joined</TableHead>
                                        <TableHead className="pr-6 text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((member) => (
                                        <TableRow key={member.id} className="group">
                                            {/* Member */}
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 shrink-0">
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback className="text-xs font-semibold bg-muted">
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate max-w-36">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-36">{member.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Department */}
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Building2 className="h-3 w-3 shrink-0" />
                                                    {member.department || "—"}
                                                </span>
                                            </TableCell>

                                            {/* Role */}
                                            <TableCell>
                                                <RoleBadge role={member.role} />
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <StatusBadge status={member.status} />
                                            </TableCell>

                                            {/* Projects */}
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <FolderOpen className="h-3 w-3 shrink-0" />
                                                    {member.projectsCount ?? 0}
                                                </span>
                                            </TableCell>

                                            {/* Joined */}
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <CalendarDays className="h-3 w-3 shrink-0" />
                                                    {new Date(member.joinedAt).toLocaleDateString("en-US", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleViewDetail(member)}
                                                        title="View details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="text-xs">
                                                            <DropdownMenuItem
                                                                className="text-xs cursor-pointer gap-1.5"
                                                                onClick={() => handleViewDetail(member)}
                                                            >
                                                                <Eye className="h-3.5 w-3.5" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-xs cursor-pointer gap-1.5 text-red-600 dark:text-red-400 focus:text-red-600"
                                                                onClick={() => {
                                                                    setMembers((prev) => prev.filter((m) => m.id !== member.id));
                                                                    toast.success(`${member.name} removed.`);
                                                                }}
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" /> Remove Member
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Dialogs */}
            <MemberDetailDialog
                member={selectedMember}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
            <AddMemberDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                onAdd={handleAddMember}
            />
        </div>
    );
}

function getInitials(name = "") {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function RoleBadge({ role }) {
    if (role === "Admin")
        return (
            <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0 gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin
            </Badge>
        );
    if (role === "Manager")
        return (
            <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 gap-1">
                <Star className="h-3 w-3" /> Manager
            </Badge>
        );
    return (
        <Badge variant="outline" className="text-xs capitalize gap-1">
            <UserCircle2 className="h-3 w-3" /> Member
        </Badge>
    );
}

function StatusBadge({ status }) {
    if (status === "Active")
        return (
            <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0 gap-1">
                <CheckCircle2 className="h-3 w-3" /> Active
            </Badge>
        );
    if (status === "Inactive")
        return (
            <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 gap-1">
                <XCircle className="h-3 w-3" /> Inactive
            </Badge>
        );
    return (
        <Badge className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-0 gap-1">
            <Clock className="h-3 w-3" /> Pending
        </Badge>
    );
}

function MemberDetailDialog({ member, open, onOpenChange }) {
    if (!member) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-130">
                <DialogHeader>
                    <DialogTitle className="text-lg">Member Details</DialogTitle>
                    <DialogDescription className="text-xs">
                        Full profile information for {member.name}.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {/* Avatar + name */}
                <div className="flex items-center gap-4 py-2">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-base font-semibold bg-muted">
                            {getInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-base leading-tight">{member.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{member.department}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <RoleBadge role={member.role} />
                            <StatusBadge status={member.status} />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Info grid */}
                <div className="grid grid-cols-1 gap-3 py-1">
                    <InfoRow icon={Mail} label="Email" value={member.email} />
                    <InfoRow icon={Phone} label="Phone" value={member.phone} />
                    <InfoRow icon={Building2} label="Department" value={member.department} />
                    <InfoRow
                        icon={CalendarDays}
                        label="Joined"
                        value={new Date(member.joinedAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    />
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <MiniStatCard icon={FolderOpen} label="Projects" value={member.projectsCount} />
                    <MiniStatCard icon={CheckCircle2} label="Tasks Done" value={member.tasksCompleted} />
                </div>

                {/* Bio */}
                {member.bio && (
                    <>
                        <Separator />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                            <p className="text-sm leading-relaxed">{member.bio}</p>
                        </div>
                    </>
                )}

                <DialogFooter className="mt-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-muted shrink-0">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground leading-none">{label}</p>
                <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
            </div>
        </div>
    );
}

function MiniStatCard({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="text-xl font-bold leading-tight">{value ?? 0}</p>
            </div>
        </div>
    );
}

function AddMemberDialog({ open, onOpenChange, onAdd }) {
    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        role: "Member",
        department: "",
        status: "Active",
        description: "",
    };
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit() {
        if (!form.name.trim() || !form.email.trim()) {
            toast.error("Name and email are required.");
            return;
        }
        setLoading(true);
        try {
            
            await new Promise((r) => setTimeout(r, 600)); 
            const newMember = {
                ...form,
                id: Date.now(),
                joinedAt: new Date().toISOString(),
                avatar: "",
                projectsCount: 0,
                tasksCompleted: 0,
            };
            onAdd(newMember);
            toast.success(`${form.name} has been added.`);
            setForm(emptyForm);
            onOpenChange(false);
        } catch {
            toast.error("Failed to add member. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-130">
                <DialogHeader>
                    <DialogTitle className="text-lg">Add New Member</DialogTitle>
                    <DialogDescription className="text-xs">
                        Fill in the details to invite a new member to your organization.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="e.g. Aarav Sharma"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Phone Number</Label>
                        <Input
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <Label className="text-xs">Role</Label>
                        <Select value={form.role} onValueChange={(v) => handleChange("role", v)}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r} className="text-sm capitalize">{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Status</Label>
                        <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s} value={s} className="text-sm capitalize">{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                            placeholder="Short description about this member…"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={loading} className="gap-1.5">
                        {loading ? (
                            <>
                                <Clock className="h-3.5 w-3.5 animate-spin" /> Adding…
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-3.5 w-3.5" /> Add Member
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({ icon: Icon, label, value, highlight = false }) {
    return (
        <Card className="py-4">
            <CardContent className="py-4 px-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className={`text-3xl font-bold tracking-tight truncate ${highlight ? "text-green-600 dark:text-green-400" : ""}`}>
                            {value ?? "0"}
                        </p>
                    </div>
                    <div className={`p-2 rounded-md shrink-0 ml-2 ${highlight ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${highlight ? "text-green-600 dark:text-green-400" : "text-foreground"}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}