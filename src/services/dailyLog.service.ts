import { db } from "../config/firebase"
import { DailyLogEntry, DailyLogEntrySchema } from "../schemas/dailyLogEntry"

export const createDailyLog = async (entry: DailyLogEntry) => {
  const validated = DailyLogEntrySchema.parse(entry)
  const docRef = db.collection("dailyLogEntries").doc()
  await docRef.set({ ...validated, timestamp: validated.timestamp })
  return { id: docRef.id, ...validated }
}
export async function getAllDailyLogs(): Promise<DailyLogEntry[]> {
  try {
    const snapshot = await db.collection("dailyLogEntries").get()


    const logs: DailyLogEntry[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        childId: data.childId,
        staffId: data.staffId,
        timestamp: data.timestamp.toDate
          ? data.timestamp.toDate()
          : data.timestamp, 
        type: data.type,
        details: data.details,
      }
    })

    return logs
  } catch (error) {
    console.error("Error fetching daily logs:", error)
    throw new Error("Failed to fetch daily logs")
  }
}
