import * as orgAdminService from "../services/orgadmin.service.js"

export const overviewStats = async (req, res) => {
    try {
        const result = await orgAdminService.getOverviewStats(req.body);
        console.log("result: ", result);
        res.status(201).json(result);
    }
    catch(err){
        console.error("Error fetching overview stats:", err);
        res.status(400).json({ message: "Internal server error" })
    }
}