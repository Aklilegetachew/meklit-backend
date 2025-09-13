import { z } from "zod"

export interface Child {
  id?: string
  firstName: string
  lastName: string
  classId: string
  centerId: string
  staffId?: string
  birthDate: Date
  age: number
}

export const ChildSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  classId: z.string(),
  centerId: z.string(),
  staffId: z.string().optional(),
  birthDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg)
  }, z.date()),
})

export const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
