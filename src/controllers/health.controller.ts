import { Request, Response, NextFunction } from "express"
import * as healthAnalyticsService from "../services/health.service"
import { ServiceError } from "../schemas/class"

// Create a new health record entry
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

// Get all health records
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

// Get health records by childId
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

// Get health records by staffId
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

// Get health records by centerId
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

// 1️⃣ Incidents vs Medication
export const getIncidentVsMedication = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentVsMedication(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 2️⃣ Incidents by Severity
export const getIncidentsBySeverity = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentsBySeverity(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 3️⃣ Incidents by Child
export const getIncidentsByChild = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentsByChild(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 4️⃣ Medication by Child
export const getMedicationByChild = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getMedicationByChild(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 5️⃣ Records by Staff
export const getRecordsByStaff = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsByStaff(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 6️⃣ Records by Center
export const getRecordsByCenter = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsByCenter(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 7️⃣ Records Over Time
export const getRecordsOverTime = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getRecordsOverTime(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 8️⃣ Incident Type Breakdown
export const getIncidentTypeBreakdown = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getIncidentTypeBreakdown(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}

// 9️⃣ Action Taken Summary
export const getActionTakenSummary = async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req)
    const data = await healthAnalyticsService.getActionTakenSummary(filters)
    res.json(data)
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
}
