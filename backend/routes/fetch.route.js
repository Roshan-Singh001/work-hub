import express from "express";
//import { authenticate, authorizeClient } from "../middlewares/auth.middleware.js";
import * as fetchController from "../controllers/fetch.controller.js"

const fetchRouter = express.Router();

// fetchRouter.use(authenticate);
// fetchRouter.use(authorizeClient);

fetchRouter.get("/project/:slug", fetchController.getProjectBySlug);
fetchRouter.get("/projects", fetchController.getAllProjects);

export default fetchRouter;