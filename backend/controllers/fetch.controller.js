import * as fetchService from "../services/fetch.service.js";

export const getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await fetchService.getProjectDetails(slug);
        console.log("result: ", result);
        if (!result) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error("Error fetching project by slug:", err);
        res.status(404).json({ message: "Internal server error" })
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const result = await fetchService.getAllProjects();
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching all projects:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}