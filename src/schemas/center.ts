import z from "zod"

export interface Center {
  id?: string
  name: string
  location: string
  timestamp?: Date
}

export const CenterSchema = z.object({
  name: z.string(),
  location: z.string(),
  timestamp: z
    .preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg)
    }, z.date())
    .optional(),
})
