import { prisma } from "../config/db.ts"
import { uploadDoc } from "../utils/docHandle.js"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

export const getOverviewStats = async (data) => {
    const activeProjects = await prisma.project.count({
        where: {
            clientId: data.clientId,
            status: "active",
        },
    });





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