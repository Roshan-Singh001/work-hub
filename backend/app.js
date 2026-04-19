import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js"
import orgAdminRouter from "./routes/orgadmin.route.js"
import clientRouter from "./routes/client.route.js"
import fetchRouter from "./routes/fetch.route.js"

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
app.use('/api/client', clientRouter);
app.use('/api/fetch', fetchRouter);



export default app