import { prisma } from "../config/db.ts";

export const getProjectDetails = async (projectId) => {
    const project = await prisma.project.findUnique({
        where: { 
            project_id: projectId, 
            status: "OPEN"
        },
        select: {
            project_id: true,
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
        return null;
    }

    const totalProjects = await prisma.project.count({
        where: {
            clientId: project.client.client_id,
        }
    })

    return {project, totalProjects};
}

export const getAllProjects = async () => {
    const projects = await prisma.project.findMany({
        where:{
            status: "OPEN"
        },
        select: {
            project_id: true,
            title: true,
            shortDesc: true,
            projectType: true,
            skills: true,
            industry: true,
            visibility: true,
            minBudget: true,
            maxBudget: true,
            createdAt: true,
            client: {
                select: {
                    client_id: true,
                    client_dp_url: true,
                    org_name: true,
                }
            },
        }
    })

    return projects;
}

export const getClientDetails = async (clientId) => {

}

export const getOrgDetails = async (orgId) => {

}

export const getFreelancerDetails = async (freelancerId) => {

}