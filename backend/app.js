import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js"
import orgAdminRouter from "./routes/orgadmin.route.js"

const app = express()
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/org/admin', orgAdminRouter);



export default app