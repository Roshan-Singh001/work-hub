import express from "express"
import upload from "../middlewares/upload.middleware.js";
import {register, login, me} from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/register", upload.single("license"),register);
authRouter.post("/login", login);
authRouter.get("/me", me);

export default authRouter;