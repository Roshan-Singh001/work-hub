import express from "express"
import upload from "../middlewares/upload.middleware.js";
import {register, login, logout, me} from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/register", upload.single("license"),register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", me);

export default authRouter;