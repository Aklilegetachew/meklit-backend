import z from "zod"

export interface Center {
  id?: string
  name: string
  location: string
}

export const CenterSchema = z.object({
  name: z.string(),
  location: z.string(),
})
