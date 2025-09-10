import { Router } from "express"
import {
  getDailyLogs,
  createDailyLog,
} from "../controllers/dailyLog.controller"

const router = Router()

router.get("/", getDailyLogs)
router.post("/", createDailyLog)

export default router
