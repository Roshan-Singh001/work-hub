import * as clientService from "../services/client.service.js"

export const overviewStats = async (req, res) => {
    try {
        const result = await clientService.getOverviewStats(req.body);
        console.log("result: ", result);
        res.status(201).json(result);
    }
    catch (err) {
        console.error("Error fetching overview stats:", err);
        res.status(400).json({ message: "Internal server error" })
    }
}

export const postProject = async (req, res) => {
    try {
        console.log("BODY:", req.body)
        console.log("FILES:", req.files)

        const result = await clientService.postProject(req);
        console.log("result: ", result);
        res.status(201).json(result);
    }
    catch (err) {
        console.error("Error posting project:", err);
        res.status(400).json({ message: "Internal server error" })
    }
}

export const getProjectDetail = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await clientService.getProjectDetail(req.user,projectId);
        console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching project detail:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const acceptProposal = async (req, res) => {
    try {
        const result = await clientService.acceptProposal(req.body);
        console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error accepting proposal:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const rejectProposal = async (req, res) => {
    try {
        const result = await clientService.rejectProposal(req.body);
        console.log("result: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error rejecting proposal:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}