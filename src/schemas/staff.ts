import { time } from "console"
import z from "zod"

export interface Staff {
  id?: string
  firstName: string
  lastName: string
  role: string
  centerId: string
  timestamp?: Date
}

export const StaffSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  centerId: z.string(),
  timestamp: z.date().optional(),
})
