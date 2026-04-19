import { prisma } from "../config/db.ts";

export const getProjectDetails = async (projectId) => {
    const project = await prisma.project.findUnique({
        where: { 
            project_id: projectId 
        },
        select: {
            title: true,
            description: true,
            projectType: true,
            status: true,
            experienceLevel: true,
            minBudget: true,
            maxBudget: true,
            deadline: true,
            skills: true,
            industry: true,
            visibility: true,
            createdAt: true,
            client: {
                select: {
                    client_id: true,
                    client_dp_url: true,
                    rating: true,
                    org_name: true,
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            createdAt: true,
                        }
                    }
                }
            },
        }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
}