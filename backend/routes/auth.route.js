import express from "express"
import upload from "../middlewares/upload.middleware.js";
import {register, login} from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/register", upload.single("license"),register);
authRouter.post("/login", login);

export default authRouter;