import z from "zod";

export interface Child {
  id?: string;
  firstName: string;
  lastName: string;
  classId: string;
  centerId: string;
  birthDate: Date;
}

export const ChildSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  classId: z.string(),
  centerId: z.string(),
  birthDate: z.date(),
});
