import { Request, Response, NextFunction } from "express"
import * as healthAnalyticsService from "../services/health.service"
import { ServiceError } from "../schemas/class"


export const createHealthEntryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const entry = req.body
    const result = await healthAnalyticsService.createHealthEntry(entry)
    res.status(201).json(result)
  } catch (err: any) {
    next(err instanceof ServiceError ? err : new ServiceError(err.message, 500))
  }
}


export const getAllHealthRecordsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await healthAnalyticsService.getAllHealthRecords()
    res.json(logs)
  } catch (err: any) {
    next(err instanceof ServiceError ? err : new ServiceError(err.message, 500))
  }
}


export const getHealthRecordsByChildIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { childId } = req.params
    const logs = await healthAnalyticsService.getHealthRecordsByChildId(childId)
    res.json(logs)
  } catch (err: any) {
    next(err instanceof ServiceError ? err : new ServiceError(err.message, 500))
  }
}


export const getHealthRecordsByStaffIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staffId } = req.params
    const logs = await healthAnalyticsService.getHealthRecordsByStaffId(staffId)
    res.json(logs)
  } catch (err: any) {
    next(err instanceof ServiceError ? err : new ServiceError(err.message, 500))
  }
}


export const getHealthRecordsByCenterIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { centerId } = req.params
    const logs = await healthAnalyticsService.getHealthRecordsByCenterId(
      centerId
    )
    res.json(logs)
  } catch (err: any) {
    next(err instanceof ServiceError ? err : new ServiceError(err.message, 500))
  }
}

const parseFilters = (req: Request) => {
  const { childId, staffId, centerId, type, startDate, endDate, severity } =
    req.query

  return {
    childId: childId as string | undefined,
    staffId: staffId as string | undefined,
    centerId: centerId as string | undefined,
    type: type as "Incident" | "Medication Administered" | undefined,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    severity: severity as string | undefined,
  }
}


export const getIncidentVsMedication = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentVsMedication(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getIncidentsBySeverity = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentsBySeverity(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getIncidentsByChild = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentsByChild(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getMedicationByChild = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getMedicationByChild(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getRecordsByStaff = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsByStaff(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getRecordsByCenter = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsByCenter(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getRecordsOverTime = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsOverTime(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getIncidentTypeBreakdown = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentTypeBreakdown(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}


export const getActionTakenSummary = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getActionTakenSummary(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getIncidentByClass = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, centerId } = req.query
    console.log("snap", startDate)
    console.log("snap", endDate)
    // Validate required filters
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" })
    }

    const filters = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
    }

    const data = await healthAnalyticsService.getIncidentsByClass(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

export const getRecentHealthRecords = async (req: Request, res: Response) => {
  try {
    const data = await healthAnalyticsService.getRecentHealthRecordsService()
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
