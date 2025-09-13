import { NextFunction, Request, Response } from "express"
import {
  createDailyLog,
  getDailyLogs,
  getDailyLogById,
  getDailyLogsWithDetails,
  getActivityCountByType as getActivityCountByTypeService,
  getLogsByChild as getLogsByChildService,
  getLogsByCenter as getLogsByCenterService,
  getDiaperNapPatterns as getDiaperNapPatternsService,
  getMoodTrends as getMoodTrendsService,
  getLogsOverTime as getLogsOverTimeService,
  getLogsByStaff as getLogsByStaffService,
} from "../services/dailyLog.service"

export const createDailyLogController = async (req: Request, res: Response) => {
  try {
    const log = await createDailyLog(req.body)
    res.status(201).json(log)
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ error: err.message })
  }
}

export const getDailyLogsController = async (req: Request, res: Response) => {
  try {
    const filters = {
      childId: req.query.childId as string,
      staffId: req.query.staffId as string,
      centerId: req.query.centerId as string,
      type: req.query.type as any,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    }

    const logs = await getDailyLogs(filters)
    res.json(logs)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getDailyLogByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const log = await getDailyLogById(req.params.id)
    if (!log) return res.status(404).json({ error: "Log not found" })
    res.json(log)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getallLogData = async (req: Request, res: Response) => {
  try {
    const log = await getDailyLogsWithDetails()
    if (!log) return res.status(404).json({ error: "Log not found" })
    res.json(log)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

const parseFilters = (req: Request) => {
  const { childId, staffId, centerId, type, startDate, endDate } = req.query

  return {
    childId: childId as string | undefined,
    staffId: staffId as string | undefined,
    centerId: centerId as string | undefined,
    type: type as string | undefined,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
  }
}

// 1️⃣ Activity count by type
export const getActivityCountByTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const filters = parseFilters(req)
    const data = await getActivityCountByTypeService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 2️⃣ Logs by Child
export const getLogsByChild = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getLogsByChildService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 3️⃣ Logs by Staff
export const getLogsByStaff = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getLogsByStaffService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 4️⃣ Logs by Center
export const getLogsByCenter = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getLogsByCenterService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 5️⃣ Logs over Time
export const getLogsOverTime = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getLogsOverTimeService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 6️⃣ Mood Trends
export const getMoodTrends = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getMoodTrendsService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 7️⃣ Diaper / Nap Patterns
export const getDiaperNapPatterns = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await getDiaperNapPatternsService(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}
