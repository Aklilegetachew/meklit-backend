import express, { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

import routes from "./routes/index"
import { errorHandler } from "./middlewares/errorHandler"
import dailyLogRoutes from "./routes/dailyLog.routes"
import staffmanagmentRoutes from "./routes/staff.routes"

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api", routes)
app.use("/api/staff", staffmanagmentRoutes)
app.use("/api/daily-logs", dailyLogRoutes)

app.use(errorHandler)

export default app
