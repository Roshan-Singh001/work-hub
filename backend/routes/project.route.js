import express from "express";
import * as projectController from "../controllers/project.controller.js"; 
import { authenticate  } from "../middlewares/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.use(authenticate);


projectRouter.post("/proposal/:projectId/apply", projectController.proposalApply);
export default projectRouter;