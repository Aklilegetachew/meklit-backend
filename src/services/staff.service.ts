import { db } from "../config/firebase"
import { Staff, StaffSchema } from "../schemas/staff"

export const createStaffmember = async (entry: Staff) => {
  const validated = StaffSchema.parse(entry)
  const docRef = db.collection("staffMembers").doc()
  await docRef.set({ ...validated, timestamp: validated.timestamp })
  return { id: docRef.id, ...validated }
}
export const getAllStaffmembers = async () => {
  try {
    const snapshot = await db.collection("staffMembers").get()

    const logs: Staff[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        timestamp: data.timestamp.toDate
          ? data.timestamp.toDate()
          : data.timestamp,
        role: data.role,
        centerId: data.centerId,
      }
    })

    return logs
  } catch (error) {
    console.error("Error fetching daily logs:", error)
    throw new Error("Failed to fetch daily logs")
  }
}
