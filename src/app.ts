import express, { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

import routes from "./routes/index"
import { errorHandler } from "./middlewares/errorHandler"
import dailyLogRoutes from "./routes/dailyLog.routes"
import staffmanagmentRoutes from "./routes/staff.routes"
import centerRoutes from "./routes/center.routes"
import childRoutes from "./routes/child.routes"
import classRoutes from "./routes/class.routes"

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
app.use("/api/daily-logs", dailyLogRoutes)

app.use(errorHandler)

export default app
