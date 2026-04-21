import express from "express";
import { authenticate, authorizeOrgAdmin } from "../middlewares/auth.middleware.js";
import * as orgAdminController from "../controllers/orgadmin.controller.js";

const orgAdminRouter = express.Router();

orgAdminRouter.use(authenticate);
orgAdminRouter.use(authorizeOrgAdmin);

orgAdminRouter.get("/overview", orgAdminController.overviewStats);
orgAdminRouter.get("/project/detail/:projectId", orgAdminController.getProjectDetail);

export default orgAdminRouter;