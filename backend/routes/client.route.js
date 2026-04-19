import express from "express";
import { authenticate, authorizeClient } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import * as clientController from "../controllers/client.controller.js"

const clientRouter = express.Router();

clientRouter.use(authenticate);
clientRouter.use(authorizeClient);

clientRouter.get("/overview", clientController.overviewStats);
clientRouter.post("/project/post", upload.array("files"), clientController.postProject);

export default clientRouter;