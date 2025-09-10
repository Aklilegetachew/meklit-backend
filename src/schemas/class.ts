import z from "zod"

export interface Class {
  id?: string
  name: string
  centerId: string
}

export const ClassSchema = z.object({
  name: z.string(),
  centerId: z.string(),
})
