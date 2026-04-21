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

export default function CompletedProjectsPage() {
    const { userData, loading } = useAuth();
    const router = useRouter();
    const [completedProjects, setCompletedProjects] = useState([]);

    useEffect(() => {
        if (loading) return;
        async function fetchCompletedProjects() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/overview`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setCompletedProjects((data.projects || []).filter(p => p.status === "COMPLETED"));
            } catch (error) {
                toast.error("Failed to load completed projects.");
            }
        }
        fetchCompletedProjects();
    }, [loading]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Completed Projects
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Projects that have been successfully delivered.
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
                        <CardTitle className="text-base">Your Completed Projects</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Review your delivered projects.
                        </CardDescription>
                    </CardHeader>
                    {completedProjects.length === 0 ? (
                        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <FolderOpen className="h-8 w-8" />
                                <p className="text-sm font-medium">No completed projects</p>
                                <p className="text-xs">Completed projects will appear here.</p>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-0">
                            {completedProjects.map((project) => (
                                <CompletedProjectCard
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

function CompletedProjectCard({ project, onView }) {
    const deadline = new Date(project.deadline);

    return (
        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3 px-4 space-y-3">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight line-clamp-2">{project.title}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0 flex items-center gap-1">
                        <CircleDot className="h-2.5 w-2.5 text-green-500" />
                        COMPLETED
                    </Badge>
                </div>

                {/* Freelancer */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Freelancer:</span>
                    <span className="font-medium text-foreground">{project.freelancer_name || "—"}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{project.progress ?? 100}%</span>
                    </div>
                    <Progress value={project.progress ?? 100} className="h-1.5" />
                </div>

                {/* Completed On */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                        {deadline.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="ml-auto font-medium text-green-600">Delivered</span>
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
                    View Project <ArrowRight className="h-3.5 w-3.5" />
                </Button>
            </CardContent>
        </Card>
    );
}