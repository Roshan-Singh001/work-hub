import { prisma } from "../config/db.ts"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

export const getOverviewStats = async (data) => {
    const totalUsers = await prisma.user.count();
    const totalOrgs = await prisma.organization.count();
    const totalProjects = await prisma.project.count();
    const totalFreelancer = await prisma.freelancer.count();

    const recentUsers = await prisma.user.findMany({
        select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            status: true,
            createdAt: true,
            organization: {
                select: {
                    org_id: true,
                    org_name: true,
                }
            }
        },
        where: {
            role: {
                not: 'ORG_Member'
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    })

    const recentProjects = await prisma.project.findMany({
        select: {
            project_id: true,
            title: true,
            createdAt: true,
            status: true,
            minBudget: true,
            maxBudget: true,
            finalPrice: true,
            client: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                }
            }
        },
        where: {
            client: {
                role: "Client"
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    })

    const pendingRequests = await prisma.user.findMany({
        select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
            status: true,
            createdAt: true,
            organization: {
                select: {
                    org_id: true,
                    org_name: true,
                    industry: true,
                    license_url: true,
                }
            },
            freelancer: {
                select: {
                    skills_category: true,
                    resume_url: true,
                }
            }
        },
        where: {
            role: {
                in: ['ORG_Owner', 'Freelancer']
            },
            status: 'pending'
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
    })

    console.log("Total Users: ", totalUsers);
    console.log("Total Orgs: ", totalOrgs);
    console.log("Total Projects: ", totalProjects);
    console.log("Total Freelancers: ", totalFreelancer);
    console.log("Recent Projects: ", recentProjects);
    console.log("Recent Users: ", recentUsers);

    return {
        totalUsers,
        totalOrgs,
        totalProjects,
        totalFreelancer,
        recentUsers,
        recentProjects,
        pendingRequests,
    }


}

export const getProjectDetail = async (user, projectId) => {

    const projectAssign = await prisma.project.findUnique({
        where: {
            project_id: projectId,
        },
        select: {
            assignedToId: true,
        }
    })

    if (!projectAssign || projectAssign.assignedToId !== user.id) {
        throw new Error("Project not found or access denied");
    }

    const project = await prisma.project.findUnique({
        where: {
            project_id: projectId,
        },
        select: {
            project_id: true,
            title: true,
            shortDesc: true,
            description: true,
            projectType: true,
            visibility: true,
            experienceLevel: true,
            minBudget: true,
            maxBudget: true,
            finalPrice: true,
            deadline: true,
            skills: true,
            industry: true,
            files: true,
            clientId: true,
            status: true,
            assignedType: true,
            assignedAt: true,
            assignedToId: true,
            createdAt: true,
            progress: true,
            review: true,
            startDate: true,
            completionDate: true,
            tasks: {
                select: {
                    task_id: true,
                    title: true,
                    description: true,
                    progress: true,
                    review: true,
                    status: true,
                    createdAt: true,
                    

                }
            }
        }
    })

    return project;
}