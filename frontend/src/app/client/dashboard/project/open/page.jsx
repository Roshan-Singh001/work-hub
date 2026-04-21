"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, ArrowRight, Clock, CircleDot } from "lucide-react";

export default function OpenProjectsPage() {
    const { userData, loading } = useAuth();
    const router = useRouter();
    const [openProjects, setOpenProjects] = useState([]);

    useEffect(() => {
        if (loading) return;
        async function fetchOpenProjects() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/overview`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                // Filter projects with status "OPEN"
                setOpenProjects((data.projects || []).filter(p => p.status === "OPEN"));
            } catch (error) {
                toast.error("Failed to load open projects.");
            }
        }
        fetchOpenProjects();
    }, [loading]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Open Projects
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Projects currently open for applications or proposals.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2 w-fit"
                        onClick={() => router.push("/client/dashboard/project/create")}
                    >
                        <FolderOpen className="h-4 w-4" /> Post a Project
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Your Open Projects</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Manage and review your open projects.
                        </CardDescription>
                    </CardHeader>
                    {openProjects.length === 0 ? (
                        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <FolderOpen className="h-8 w-8" />
                                <p className="text-sm font-medium">No open projects</p>
                                <p className="text-xs">Post a project to get started.</p>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
                            {openProjects.map((project) => (
                                <OpenProjectCard
                                    key={project.project_id}
                                    project={project}
                                    onView={() => router.push(`/client/dashboard/${project.project_id}`)}
                                />
                            ))}
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}

function OpenProjectCard({ project, onView }) {
    const deadline = new Date(project.deadline);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3 px-4 space-y-3">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight line-clamp-2">{project.title}</p>
                    <Badge variant="secondary" className="text-[10px] shrink-0 flex items-center gap-1">
                        <CircleDot className="h-2.5 w-2.5 text-amber-500" />
                        OPEN
                    </Badge>
                </div>

                {/* Applications */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Applications:</span>
                    <span className="font-medium text-foreground">{project.applications ?? 0}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{project.progress ?? 0}%</span>
                    </div>
                    <Progress value={project.progress ?? 0} className="h-1.5" />
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                        {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {daysLeft >= 0 && (
                        <span className={`ml-auto font-medium ${daysLeft <= 3 ? "text-destructive" : "text-muted-foreground"}`}>
                            {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                        </span>
                    )}
                    {daysLeft < 0 && (
                        <span className="ml-auto font-medium text-destructive">Overdue</span>
                    )}
                </div>
            </CardContent>
            <Separator />
            <CardContent className="py-2.5 px-4">
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-xs gap-1 justify-between"
                    onClick={onView}
                >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                </Button>
            </CardContent>
        </Card>
    );
}