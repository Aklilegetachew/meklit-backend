import { z } from "zod"

export interface DailyLogEntry {
  id?: string
  childId: string
  staffId: string
  centerId: string
  timestamp: Date
  type: "Meal" | "Nap" | "Diaper" | "Mood" | "General Activity"
  details: string
}

export const DailyLogEntrySchema = z.object({
  childId: z.string().min(1),
  staffId: z.string().min(1),
  centerId: z.string().min(1),
  timestamp: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg)
  }, z.date()),
  type: z.enum(["Meal", "Nap", "Diaper", "Mood", "General Activity"]),
  details: z.string().min(1),
})
