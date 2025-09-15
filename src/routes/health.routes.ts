import { Router } from "express"
import {
  createHealthEntryController,
  getAllHealthRecordsController,
  getHealthRecordsByChildIdController,
  getHealthRecordsByStaffIdController,
  getHealthRecordsByCenterIdController,
  getActionTakenSummary,
  getIncidentsByChild,
  getIncidentsBySeverity,
  getIncidentTypeBreakdown,
  getIncidentVsMedication,
  getMedicationByChild,
  getRecordsByCenter,
  getRecordsByStaff,
  getRecordsOverTime,
  getIncidentByClass,
  getRecentHealthRecords,
} from "../controllers/health.controller"

const healthReportRoute = Router()

// Create a new health record
healthReportRoute.post("/", createHealthEntryController)

healthReportRoute.get("/", getAllHealthRecordsController)

healthReportRoute.get("/child/:childId", getHealthRecordsByChildIdController)

healthReportRoute.get("/staff/:staffId", getHealthRecordsByStaffIdController)

healthReportRoute.get("/center/:centerId", getHealthRecordsByCenterIdController)

// for statics purpose
healthReportRoute.get("/incident-vs-medication", getIncidentVsMedication)
healthReportRoute.get("/incidents-by-severity", getIncidentsBySeverity)
healthReportRoute.get("/incidents-by-child", getIncidentsByChild)
healthReportRoute.get("/medication-by-child", getMedicationByChild)
healthReportRoute.get("/records-by-staff", getRecordsByStaff)
healthReportRoute.get("/records-by-center", getRecordsByCenter)
healthReportRoute.get("/records-over-time", getRecordsOverTime)
healthReportRoute.get("/incident-type-breakdown", getIncidentTypeBreakdown)
healthReportRoute.get("/action-taken-summary", getActionTakenSummary)
healthReportRoute.get("/incident-by-class", getIncidentByClass)
healthReportRoute.get("/recent", getRecentHealthRecords)

export default healthReportRoute
