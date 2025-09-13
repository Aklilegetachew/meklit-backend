import { z } from "zod"

export interface HealthRecordEntry {
  id?: string
  childId: string
  recordedByUserId: string
  centerId: string
  classId: string
  timestamp: Date
  type: "Incident" | "Medication Administered"
  severity?: "Low" | "Medium" | "High"
  details: string
  actionTaken: string
  medicationName?: string
  dose?: string
  notes?: string
}

export const HealthRecordEntrySchema = z.object({
  childId: z.string().min(1),
  recordedByUserId: z.string().min(1),
  centerId: z.string().min(1),
  classId: z.string().min(1),
  timestamp: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg)
  }, z.date()),
  type: z.enum(["Incident", "Medication Administered"]),
  severity: z.enum(["Low", "Medium", "High"]).optional(),
  details: z.string().min(1),
  actionTaken: z.string().min(1),
  medicationName: z.string().optional(),
  dose: z.string().optional(),
  notes: z.string().optional(),
})

export class ServiceError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}
