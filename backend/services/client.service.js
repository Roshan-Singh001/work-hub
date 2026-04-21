import { prisma } from "../config/db.ts"
import { uploadDoc } from "../utils/docHandle.js"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

export const getOverviewStats = async (data) => {
    const activeProjects = await prisma.project.count({
        where: {
            clientId: data?.user?.id,
            status: "IN_PROGRESS",
        },
    });

    const completedProjects = await prisma.project.count({
        where: {
            clientId: data?.user?.id,
            status: "COMPLETED",
        },
    });

    const pendingApplications = await prisma.projectApplication.count({
        where: {
            status: "PENDING",
            project: {
                clientId: data?.user?.id
            }
        }
    })

    const projects = await prisma.project.findMany({
        where: {
            clientId: data?.user?.id,
        },
        select: {
            project_id: true,
            title: true,
            status: true,
            progress: true,
            deadline: true,

        }
    })

    return {
        stat: {
            activeProjects,
            completedProjects,
            pendingApplications,
        },
        projects,
    }
}

export const postProject = async (req) => {
    const {
        title,
        shortDesc,
        projectType,
        assignedTo,
        experienceLevel,
        minBudget,
        maxBudget,
        deadline,
        skills,
        industries,
        details,
        files,
    } = req.body

    const parsedDetails = JSON.parse(details)

    let uploadedFiles = []

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const url = await uploadDoc(file.path, "projects")

            uploadedFiles.push({
                url,
                name: file.originalname
            })

            fs.unlinkSync(file.path)
        }
    }

    const projectId = 'project_' + uuidv4().replaceAll("-", "_");

    const project = await prisma.project.create({
        data: {
            project_id: projectId,
            title,
            shortDesc,
            projectType,
            visibility: assignedTo,
            experienceLevel,

            minBudget: parseFloat(minBudget),
            maxBudget: parseFloat(maxBudget),

            deadline: new Date(deadline),
            description: parsedDetails.content,

            skills: {
                connectOrCreate: (Array.isArray(skills) ? skills : [skills]).map(skill => ({
                    where: { name: skill },
                    create: { name: skill }
                }))
            },

            industry: {
                connectOrCreate: (Array.isArray(industries) ? industries : [industries]).map(ind => ({
                    where: { name: ind },
                    create: { name: ind }
                }))
            },

            files: uploadedFiles,

            clientId: req.user?.id
        }
    })

    if (!project) {
        throw new Error("Failed to create project");
    }
    return { message: "Your project is posted successfully" }
}

export const getProjectDetail = async (user,projectId) => {
    const projectOwner = await prisma.project.findUnique({
        where: {
            project_id: projectId,
        },
        select: {
            clientId: true,
        }
    })

    if (!projectOwner || projectOwner.clientId !== user.id) {
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
        }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const applications = await prisma.projectApplication.findMany({
        where: {
            projectId: projectId,
        },
        select: {
            id: true,
            status: true,
            applicantId: true,
            coverLetter: true,
            proposedPrice: true,
            applicantType: true,
            projectId: true,
            appliedAt: true,
            applicant: {
                select: {
                    first_name: true,
                    last_name: true,
                    freelancer: {
                        select: {
                            rating: true,
                            country: true,
                            freelancer_dp_url: true,
                            skills: true,
                            title: true,
                        }
                    },
                    organization: {
                        select: {
                            org_id: true,
                            org_name: true,
                            rating: true,
                            org_logo_url: true,
                            country: true,
                            industry: true,
                        }
                    }

                }
            }            
        }
    })

    let assignedTo = null;

    if (project.assignedType === "FREELANCER") {
        assignedTo = await prisma.freelancer.findUnique({
            where: {
                freelancer_id: project.assignedToId,
            },
            select: {
                freelancer_id: true,
                title: true,
                freelancer_dp_url: true,
                rating: true,
                country: true,
                user: {
                    select:{
                        first_name: true,
                        last_name: true,
                    }
                }
            }
        })
    }
    else if (project.assignedType === "ORGANIZATION") {
        assignedTo = await prisma.organization.findUnique({
            where: {
                ownerId: project.assignedToId,
            },
            select: {
                org_id: true,
                org_name: true,
                org_logo_url: true,
                rating: true,
                country: true,
            }
        })
    }

    return { projectData: {project, applications, assignedTo} };
}

export const acceptProposal = async (data) =>{
    const {projectId, applicantId, appId} = data;

    const appDetail = await prisma.projectApplication.findUnique({
        where: {
            id: appId,
        },
        select: {
            proposedPrice: true,
            applicantType: true,
        }
    })

    await prisma.projectApplication.update({
        where: {
            id: appId,
        },
        data: {
            status: "ACCEPTED",
        }
    })

    await prisma.project.update({
        where: {
            project_id: projectId,
        },
        data: {
            assignedToId: applicantId,
            assignedType: appDetail.applicantType,
            status: "IN_PROGRESS",
            finalPrice: appDetail.proposedPrice,
            assignedAt: new Date(),
            startDate: new Date(),
        }
    })

    if (!appDetail) {
        throw new Error("Application not found");
    }

    return { message: "Proposal accepted and project assigned successfully" };
}

export const rejectProposal = async (data) =>{
    const {projectId, applicantId} = data;
    await prisma.projectApplication.update({
        where: {
            projectId: projectId,
            applicantId: applicantId,
        },
        data: {
            status: "REJECTED",
        }
    })

    return { message: "Proposal rejected successfully" };
}