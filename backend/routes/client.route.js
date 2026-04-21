import express from "express";
import { authenticate, authorizeClient } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import * as clientController from "../controllers/client.controller.js"

const clientRouter = express.Router();

clientRouter.use(authenticate);
clientRouter.use(authorizeClient);

clientRouter.get("/overview", clientController.overviewStats);
clientRouter.post("/project/post", upload.array("files"), clientController.postProject);
clientRouter.get("/project/detail/:projectId", clientController.getProjectDetail);
clientRouter.post("/project/proposal/accept", clientController.acceptProposal);
clientRouter.post("/project/proposal/reject", clientController.rejectProposal);
// clientRouter.get("/projects", clientController.getProjects);
// clientRouter.get("/proposals", clientController.getProposals);
export default clientRouter;