import { db } from "../config/firebase"
import { Staff, StaffSchema } from "../schemas/staff"

interface Center {
  id: string
  name: string
  location?: string
}

interface StaffWithCenter extends Staff {
  center?: Center | null
}

export const createStaffmember = async (entry: Staff) => {
  const validated = StaffSchema.parse(entry)
  const docRef = db.collection("staffMembers").doc()
  await docRef.set({ ...validated, timestamp: validated.timestamp })
  return { id: docRef.id, ...validated }
}
export const getAllStaffmembers = async () => {
  try {
    const snapshot = await db.collection("staffMembers").get()

    const staff = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        timestamp: data.timestamp?.toDate
          ? data.timestamp.toDate()
          : data.timestamp,
        role: data.role,
        centerId: data.centerId,
      }
    })

    const centerIds = [...new Set(staff.map((s) => s.centerId).filter(Boolean))]

    const centerSnapshots = await Promise.all(
      centerIds.map((id) => db.collection("centers").doc(id).get())
    )

    const centersMap = new Map(
      centerSnapshots
        .filter((doc) => doc.exists)
        .map((doc) => [doc.id, { id: doc.id, ...doc.data() }])
    )

    const staffWithCenters = staff.map((s) => ({
      ...s,
      center: centersMap.get(s.centerId) || null,
    }))

    return staffWithCenters
  } catch (error) {
    console.error("Error fetching staff members:", error)
    throw new Error("Failed to fetch staff members")
  }
}

export const getStaffById = async (
  staffId: string
): Promise<StaffWithCenter | null> => {
  try {
    const staffDoc = await db.collection("staffMembers").doc(staffId).get()

    if (!staffDoc.exists) {
      return null // staff not found
    }

    const data = staffDoc.data()
    if (!data) return null

    const staff: Staff = {
      id: staffDoc.id,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
      centerId: data.centerId,
    }

    let center: Center | null = null
    if (data.centerId) {
      const centerDoc = await db.collection("centers").doc(data.centerId).get()
      if (centerDoc.exists) {
        center = { id: centerDoc.id, ...centerDoc.data() } as Center
      }
    }

    return { ...staff, center }
  } catch (error) {
    console.error("Error fetching staff member:", error)
    throw new Error("Failed to fetch staff member")
  }
}
