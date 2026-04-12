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
            budget: true,
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