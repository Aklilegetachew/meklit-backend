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


export class ServiceError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}
