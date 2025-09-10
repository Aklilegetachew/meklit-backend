import { NextFunction, Request, Response } from "express"
import * as DailyLogService from "../services/dailyLog.service"

export const getDailyLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await DailyLogService.getAllDailyLogs()
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

export const createDailyLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = {
    ...req.body,
    timestamp: new Date(req.body.timestamp),
  }

  try {
    const logs = await DailyLogService.createDailyLog(body)
    res.json(logs)
  } catch (err) {
    next(err)
  }
}
