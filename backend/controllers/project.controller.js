import * as projectService from "../services/project.service.js";

export const proposalApply = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await projectService.proposalApply(req, projectId);

        res.status(200).json({ message: "Proposal applied successfully" });
    } catch (error) {
        console.error("Error applying for proposal:", error);
        res.status(400).json({ message: error.message || "Internal server error" });
    }
}