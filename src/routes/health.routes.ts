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
} from "../controllers/health.controller"

const healthReportRoute = Router()

// Create a new health record
healthReportRoute.post("/", createHealthEntryController)

// Get all health records
healthReportRoute.get("/", getAllHealthRecordsController)

// Get records by childId
healthReportRoute.get("/child/:childId", getHealthRecordsByChildIdController)

// Get records by staffId
healthReportRoute.get("/staff/:staffId", getHealthRecordsByStaffIdController)

// Get records by centerId
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

export default healthReportRoute
