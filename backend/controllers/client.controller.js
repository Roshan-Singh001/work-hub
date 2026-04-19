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