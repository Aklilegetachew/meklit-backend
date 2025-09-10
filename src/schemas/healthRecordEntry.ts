import z from "zod";

export interface HealthRecordEntry {
  id?: string;
  childId: string;
  recordedByUserId: string;
  timestamp: Date;
  type: "Incident" | "Medication Administered";
  details: string;
  actionTaken: string;
}

export const HealthRecordEntrySchema = z.object({
  childId: z.string().min(1),
  recordedByUserId: z.string().min(1),
  timestamp: z.date(),
  type: z.enum(["Incident", "Medication Administered"]),
  details: z.string().min(1),
  actionTaken: z.string().min(1),
});
