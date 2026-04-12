import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js"

const adminRouter = express.Router();

adminRouter.use(authenticate);
adminRouter.use(authorizeAdmin);

adminRouter.get("/overview", adminController.overviewStats);
adminRouter.post("/approve/:userId", adminController.approveRequest);
adminRouter.post("/reject/:userId", adminController.rejectRequest);
adminRouter.post("/add/user/:role", adminController.addUser);

export default adminRouter;