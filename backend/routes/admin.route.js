import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js"

const adminRouter = express.Router();

adminRouter.use(authenticate);
adminRouter.use(authorizeAdmin);

adminRouter.get("/overview", adminController.overviewStats);
adminRouter.get("/announcement/all", adminController.getAllAnnouncements);
adminRouter.get("/user/clients", adminController.getAllClients);


adminRouter.post("/announcement/create", adminController.createAnnouncement);
adminRouter.post("/approve/:userId", adminController.approveRequest);
adminRouter.post("/reject/:userId", adminController.rejectRequest);
adminRouter.post("/add/user/:role", adminController.addUser);

export default adminRouter;