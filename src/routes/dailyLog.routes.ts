import { Router } from "express"
import {
  createDailyLogController,
  getActivityCountByTypeController,
  getallLogData,
  getDailyLogByIdController,
  getDailyLogsController,
  getDiaperNapPatternsController,
  getLogsByCenterController,
  getLogsByChildController,
  getLogsByStaffController,
  getLogsOverTimeController,
  getMoodTrendsController,
  getRecentLogsController,
} from "../controllers/dailyLog.controller"

const logrouter = Router()

logrouter.post("/", createDailyLogController)
logrouter.get("/", getDailyLogsController)
logrouter.get("/all", getallLogData)

// for anyltics purpose
logrouter.get("/type", getActivityCountByTypeController)
logrouter.get("/by-child", getLogsByChildController)
logrouter.get("/by-staff", getLogsByStaffController)
logrouter.get("/by-center", getLogsByCenterController)
logrouter.get("/over-time", getLogsOverTimeController)
logrouter.get("/mood-trends", getMoodTrendsController)
logrouter.get("/diaper-nap-patterns", getDiaperNapPatternsController)
logrouter.get("/recent", getRecentLogsController)

logrouter.get("/:id", getDailyLogByIdController)
export default logrouter
