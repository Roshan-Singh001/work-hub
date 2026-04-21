import { prisma } from "../config/db.ts";
import { v4 as uuidv4 } from "uuid"

export const proposalApply = async (data, projectId) =>{
    console.log("Applying for proposal with data:", data.body, data.user, "and projectId:", projectId);
    const { proposal, bidAmount } = data.body;
    const proposal_id = 'proposal_' + uuidv4().replaceAll("-", "_");
    const price = parseFloat(bidAmount);

    const existingApplication = await prisma.projectApplication.findFirst({
        where: {
            projectId: projectId,
            applicantId: data?.user?.id,
        }
    });

    if (existingApplication) {
        throw new Error("You have already applied for this project.");
    }

    await prisma.projectApplication.create({
        data: {
            id: proposal_id,
            proposedPrice: price,
            projectId: projectId,
            applicantType: data?.user?.role === "ORG_Owner" ? "ORGANIZATION" : "FREELANCER",
            coverLetter: proposal,
            applicantId: data?.user?.id,
        }
    })

    return { message: "Proposal applied successfully" };

}