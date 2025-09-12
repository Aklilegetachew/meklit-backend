import { Router } from "express"
import {
  getDailyLogs,
  createDailyLog,
} from "../controllers/dailyLog.controller"

const logrouter = Router()

logrouter.get("/", getDailyLogs)
logrouter.post("/", createDailyLog)

export default logrouter
