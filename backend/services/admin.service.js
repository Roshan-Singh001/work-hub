import { prisma } from "../config/db.ts"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

export const getOverviewStats = async () => {
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
            status: 'Pending'
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

export const approveRequest = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'Active' }
    })
}

export const rejectRequest = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'Rejected' }
    })
}

export const addUser = async (userData, role) => {
    console.log("Adding user with data: ", userData, " and role: ", role);
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    if (role == 'admin') {
        const user_id = 'admin_' + uuidv4().replaceAll("-", "_");
        await prisma.admin.create({
            data: {
                id: user_id,
                name: userData.name,
                password: hashedPassword,
                email: userData.email,
                phone: userData.phone,
            }
        })
    }
    else if (role == 'client') {
        const user_id = 'user_' + uuidv4().replaceAll("-", "_");

        await prisma.user.create({
            data: {
                id: user_id,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                password: hashedPassword,
                phone: userData.phone,
                role: "Client",
                status: "Active",
            }
        })

        await prisma.client.create({
            data: {
                client_id: user_id,
                org_name: userData?.organization,
                country: userData.country,
            }
        })
    }

}