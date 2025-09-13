import { Router } from "express"
import {
  createDailyLogController,
  getDailyLogsController,
  getDailyLogByIdController,
  getallLogData,
  getDiaperNapPatterns,
  getLogsByCenter,
  getLogsByChild,
  getLogsByStaff,
  getLogsOverTime,
  getMoodTrends,
} from "../controllers/dailyLog.controller"
import { getActivityCountByType } from "../services/dailyLog.service"

const logrouter = Router()

logrouter.post("/", createDailyLogController)
logrouter.get("/", getDailyLogsController)
logrouter.get("/all", getallLogData)
logrouter.get("/:id", getDailyLogByIdController)

// for anyltics purpose
logrouter.get("/type", getActivityCountByType)
logrouter.get("/by-child", getLogsByChild)
logrouter.get("/by-staff", getLogsByStaff)
logrouter.get("/by-center", getLogsByCenter)
logrouter.get("/over-time", getLogsOverTime)
logrouter.get("/mood-trends", getMoodTrends)
logrouter.get("/diaper-nap-patterns", getDiaperNapPatterns)

export default logrouter
