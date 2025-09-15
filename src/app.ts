import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express, { Application } from "express"

import { errorHandler } from "./middlewares/errorHandler"
import centerRoutes from "./routes/center.routes"
import childRoutes from "./routes/child.routes"
import classRoutes from "./routes/class.routes"
import logrouter from "./routes/dailyLog.routes"
import healthReportRoute from "./routes/health.routes"
import routes from "./routes/index"
import staffmanagmentRoutes from "./routes/staff.routes"

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api", routes)
app.use("/api/center", centerRoutes)
app.use("/api/class", classRoutes)
app.use("/api/staff", staffmanagmentRoutes)
app.use("/api/child", childRoutes)
app.use("/api/daily-logs", logrouter)
app.use("/api/healthRecords", healthReportRoute)

app.use(errorHandler)

export default app
