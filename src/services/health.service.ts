import z from "zod"
import { ServiceError } from "../schemas/class"
import {
  HealthRecordEntry,
  HealthRecordEntrySchema,
} from "../schemas/healthRecordEntry"
import { db } from "../config/firebase"
import { Child } from "../schemas/child"

interface Filters {
  childId?: string
  staffId?: string
  centerId?: string
  type?: "Incident" | "Medication Administered"
  startDate?: Date
  endDate?: Date
  severity?: string
}

const getDocById = async (collection: string, id: string) => {
  try {
    const docRef = await db.collection(collection).doc(id).get()
    return docRef.exists ? { ...docRef.data(), id: docRef.id } : null
  } catch (err) {
    throw new ServiceError(`Failed to fetch ${collection} with ID ${id}`, 500)
  }
}

// Create a health record entry
export const createHealthEntry = async (
  entry: Omit<HealthRecordEntry, "id">
) => {
  try {
    const validated = HealthRecordEntrySchema.parse(entry)

    const docRef = await db.collection("healthRecords").add(validated)

    // Fetch related info to return
    const [child, staff, center] = await Promise.all([
      getDocById("children", validated.childId),
      getDocById("staffMembers", validated.recordedByUserId),
      getDocById("center", validated.centerId),
    ])
    // If you need to assert the type of child:
    const childTyped = child as Child

    // Optionally include class info if child has classId
    let classInfo = null
    if (childTyped?.classId) {
      classInfo = await getDocById("classes", childTyped.classId)
    }

    return {
      id: docRef.id,
      ...validated,
      child,
      staff,
      center,
      class: classInfo,
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      throw new ServiceError(err.issues.map((e) => e.message).join(", "), 422)
    }
    throw new ServiceError(err.message || "Failed to create health entry", 500)
  }
}

// Fetch all health records with related data
export const getAllHealthRecords = async () => {
  try {
    const snapshot = await db.collection("healthRecords").get()
    const logsData = []

    for (const doc of snapshot.docs) {
      const log = doc.data()

      const [child, staff, center] = await Promise.all([
        getDocById("children", log.childId),
        getDocById("staffMembers", log.recordedByUserId),
        getDocById("center", log.centerId),
      ])
      const childTyped = child as Child
      let classInfo = null
      if (childTyped?.classId) {
        classInfo = await getDocById("classes", childTyped.classId)
      }

      logsData.push({
        id: doc.id,
        ...log,
        child,
        staff,
        center,
        class: classInfo,
      })
    }

    return logsData
  } catch (err: any) {
    throw new ServiceError(err.message || "Failed to fetch health records", 500)
  }
}

// Fetch by childId
export const getHealthRecordsByChildId = async (childId: string) => {
  try {
    const snapshot = await db
      .collection("healthRecords")
      .where("childId", "==", childId)
      .get()
    const logsData = []

    for (const doc of snapshot.docs) {
      const log = doc.data()
      const [child, staff, center] = await Promise.all([
        getDocById("children", log.childId),
        getDocById("staff", log.recordedByUserId),
        getDocById("center", log.centerId),
      ])
      const childTyped = child as Child
      let classInfo = null
      if (childTyped?.classId) {
        classInfo = await getDocById("classes", childTyped.classId)
      }

      logsData.push({
        id: doc.id,
        ...log,
        child,
        staff,
        center,
        class: classInfo,
      })
    }

    return logsData
  } catch (err: any) {
    throw new ServiceError(
      err.message || "Failed to fetch health records by child",
      500
    )
  }
}

// Fetch by staffId
export const getHealthRecordsByStaffId = async (staffId: string) => {
  try {
    const snapshot = await db
      .collection("healthRecords")
      .where("recordedByUserId", "==", staffId)
      .get()
    const logsData = []

    for (const doc of snapshot.docs) {
      const log = doc.data()
      const [child, staff, center] = await Promise.all([
        getDocById("children", log.childId),
        getDocById("staff", log.recordedByUserId),
        getDocById("center", log.centerId),
      ])
      const childTyped = child as Child
      let classInfo = null
      if (childTyped?.classId) {
        classInfo = await getDocById("classes", childTyped.classId)
      }

      logsData.push({
        id: doc.id,
        ...log,
        child,
        staff,
        center,
        class: classInfo,
      })
    }

    return logsData
  } catch (err: any) {
    throw new ServiceError(
      err.message || "Failed to fetch health records by staff",
      500
    )
  }
}

// Fetch by centerId
export const getHealthRecordsByCenterId = async (centerId: string) => {
  try {
    const snapshot = await db
      .collection("healthRecords")
      .where("centerId", "==", centerId)
      .get()
    const logsData = []

    for (const doc of snapshot.docs) {
      const log = doc.data()
      const [child, staff, center] = await Promise.all([
        getDocById("children", log.childId),
        getDocById("staff", log.recordedByUserId),
        getDocById("center", log.centerId),
      ])
      const childTyped = child as Child
      let classInfo = null
      if (childTyped?.classId) {
        classInfo = await getDocById("classes", childTyped.classId)
      }

      logsData.push({
        id: doc.id,
        ...log,
        child,
        staff,
        center,
        class: classInfo,
      })
    }

    return logsData
  } catch (err: any) {
    throw new ServiceError(
      err.message || "Failed to fetch health records by center",
      500
    )
  }
}

// 🔹 Helper to fetch filtered records
const fetchHealthRecords = async (filters: Filters) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("healthRecords")

    if (filters.childId) query = query.where("childId", "==", filters.childId)
    if (filters.staffId)
      query = query.where("recordedByUserId", "==", filters.staffId)
    if (filters.centerId)
      query = query.where("centerId", "==", filters.centerId)
    if (filters.type) query = query.where("type", "==", filters.type)

    const snapshot = await query.get()

    let data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Date filtering
    if (filters.startDate || filters.endDate) {
      data = data.filter((record: any) => {
        const ts = (record.timestamp as any)?._seconds
          ? new Date((record.timestamp as any)._seconds * 1000)
          : new Date(record.timestamp)

        return (
          (!filters.startDate || ts >= filters.startDate) &&
          (!filters.endDate || ts <= filters.endDate)
        )
      })
    }

    return data
  } catch (err: any) {
    throw new ServiceError("Failed to fetch health records", 500)
  }
}

/** 1️⃣ Incidents vs Medication Count (Pie / Donut) */
export const getIncidentVsMedication = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const incidentCount = records.filter((r: any) => r.type === "Incident").length
  const medicationCount = records.filter(
    (r: any) => r.type === "Medication Administered"
  ).length

  return { incidentCount, medicationCount }
}

/** 2️⃣ Incidents by Severity (Stacked Bar) */
export const getIncidentsBySeverity = async (filters: Filters) => {
  const records = await fetchHealthRecords({ ...filters, type: "Incident" })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const severity = r.severity || "Unknown"
    grouped[severity] = (grouped[severity] || 0) + 1
  })

  return grouped
}

/** 3️⃣ Incidents by Child (Bar / Line) */
export const getIncidentsByChild = async (filters: Filters) => {
  const records = await fetchHealthRecords({ ...filters, type: "Incident" })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.childId] = (grouped[r.childId] || 0) + 1
  })

  return grouped
}

/** 4️⃣ Medication by Child (Bar) */
export const getMedicationByChild = async (filters: Filters) => {
  const records = await fetchHealthRecords({
    ...filters,
    type: "Medication Administered",
  })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.childId] = (grouped[r.childId] || 0) + 1
  })

  return grouped
}

/** 5️⃣ Records by Staff (Bar / Heatmap) */
export const getRecordsByStaff = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.recordedByUserId] = (grouped[r.recordedByUserId] || 0) + 1
  })

  return grouped
}

/** 6️⃣ Records by Center (Bar / Line) */
export const getRecordsByCenter = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.centerId] = (grouped[r.centerId] || 0) + 1
  })

  return grouped
}

/** 7️⃣ Records over Time (Line / Area) */
export const getRecordsOverTime = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const ts = (r.timestamp as any)?._seconds
      ? new Date((r.timestamp as any)._seconds * 1000)
      : new Date(r.timestamp)

    const key = ts.toISOString().split("T")[0] // Group by day
    grouped[key] = (grouped[key] || 0) + 1
  })

  return grouped
}

/** 8️⃣ Incident Type Breakdown (Treemap / Pie) */
export const getIncidentTypeBreakdown = async (filters: Filters) => {
  const records = await fetchHealthRecords({ ...filters, type: "Incident" })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const key = r.details || "Unknown"
    grouped[key] = (grouped[key] || 0) + 1
  })

  return grouped
}

/** 9️⃣ Action Taken Summary (Pie / Bar) */
export const getActionTakenSummary = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const key = r.actionTaken || "Unknown"
    grouped[key] = (grouped[key] || 0) + 1
  })

  return grouped
}
