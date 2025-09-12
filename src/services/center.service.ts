import { db } from "../config/firebase"
import { Center, CenterSchema } from "../schemas/center"

export const createCenter = async (entry: Center) => {
  try {
    const validated = CenterSchema.parse(entry)
    const docRef = db.collection("center").doc()
    await docRef.set({ ...validated, timestamp: validated.timestamp })
    return { id: docRef.id, ...validated }
  } catch (error) {
    throw error
  }
}
export const getAllCenters = async (): Promise<Center[]> => {
  try {
    const snapshot = await db.collection("center").get()
    const centers: Center[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        location: data.location,
        timestamp: data.timestamp.toDate
          ? data.timestamp.toDate()
          : data.timestamp,
      }
    })
    return centers
  } catch (error) {
    console.error("Error fetching centers:", error)
    throw new Error("Failed to fetch centers")
  }
}
export const getCenterById = async (id: string): Promise<Center | null> => {
  try {
    const doc = await db.collection("center").doc(id).get()
    if (!doc.exists) {
      return null
    }
    const data = doc.data()
    return {
      id: doc.id,
      name: data?.name,
      location: data?.location,
      timestamp: data?.timestamp.toDate
        ? data?.timestamp.toDate()
        : data?.timestamp,
    }
  } catch (error) {
    console.error("Error fetching center by ID:", error)
    throw new Error("Failed to fetch center by ID")
  }
}
