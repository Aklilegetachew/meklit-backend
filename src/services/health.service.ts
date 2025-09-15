import z from "zod"
import { ClassSchema, ServiceError } from "../schemas/class"
import {
  HealthRecordEntry,
  HealthRecordEntrySchema,
} from "../schemas/healthRecordEntry"
import { db } from "../config/firebase"
import { Child, ChildSchema } from "../schemas/child"

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


export const createHealthEntry = async (
  entry: Omit<HealthRecordEntry, "id">
) => {
  try {
    const validated = HealthRecordEntrySchema.parse(entry)

    const docRef = await db.collection("healthRecords").add(validated)

 
    const [child, staff, center] = await Promise.all([
      getDocById("children", validated.childId),
      getDocById("staffMembers", validated.recordedByUserId),
      getDocById("center", validated.centerId),
    ])

    const childTyped = child as Child

  
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


export const getIncidentVsMedication = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const incidentCount = records.filter((r: any) => r.type === "Incident").length
  const medicationCount = records.filter(
    (r: any) => r.type === "Medication Administered"
  ).length

  return { incidentCount, medicationCount }
}


export const getIncidentsBySeverity = async (filters: Filters) => {

  const records = await fetchHealthRecords({
    type: "Incident",
    startDate: filters.startDate,
    endDate: filters.endDate,
  })


  const grouped: Record<string, number> = {}

  records.forEach((record: any) => {
    const severity = record.severity || "Unknown"
    grouped[severity] = (grouped[severity] || 0) + 1
  })

  return grouped
}


export const getIncidentsByChild = async (filters: Filters) => {
  const records = await fetchHealthRecords({ ...filters, type: "Incident" })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.childId] = (grouped[r.childId] || 0) + 1
  })

  return grouped
}


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


export const getRecordsByStaff = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.recordedByUserId] = (grouped[r.recordedByUserId] || 0) + 1
  })

  return grouped
}


export const getRecordsByCenter = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    grouped[r.centerId] = (grouped[r.centerId] || 0) + 1
  })

  return grouped
}


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


export const getIncidentTypeBreakdown = async (filters: Filters) => {
  const records = await fetchHealthRecords({ ...filters, type: "Incident" })
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const key = r.details || "Unknown"
    grouped[key] = (grouped[key] || 0) + 1
  })

  return grouped
}


export const getActionTakenSummary = async (filters: Filters) => {
  const records = await fetchHealthRecords(filters)
  const grouped: Record<string, number> = {}

  records.forEach((r: any) => {
    const key = r.actionTaken || "Unknown"
    grouped[key] = (grouped[key] || 0) + 1
  })

  return grouped
}

export const getIncidentsByClass = async (filters: Filters) => {

  const records = await fetchHealthRecords({ ...filters, type: "Incident" })


  const countsByClassId: Record<string, number> = {}
  records.forEach((r: any) => {
    const classId = r.classId
    if (!countsByClassId[classId]) countsByClassId[classId] = 0
    countsByClassId[classId] += 1
  })

 
  const classIds = Object.keys(countsByClassId)
  if (classIds.length === 0) return {}

  const classesSnapshot = await db
    .collection("classes")
    .where("__name__", "in", classIds) 
    .get()

  const result: Record<string, number> = {}
  classesSnapshot.forEach((doc) => {
    const classData = doc.data() as any 
    const className = classData.name || doc.id
    result[className] = countsByClassId[doc.id] || 0
  })

  return result
}

export const getRecentHealthRecordsService = async () => {

  const snapshot = await db
    .collection("healthRecords")
    .orderBy("timestamp", "desc")
    .limit(5)
    .get()

  if (snapshot.empty) return []

  const records = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))


  const childIds = records.map((r: any) => r.childId)
  const classIds = records.map((r: any) => r.classId)


  const childrenSnapshot = await db
    .collection("children")
    .where("__name__", "in", childIds)
    .get()

  const childrenMap: Record<string, any> = {}
  childrenSnapshot.forEach((doc) => {
    const data = doc.data()
    childrenMap[doc.id] = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      classId: data.classId || "",
    }
  })


  const classesSnapshot = await db
    .collection("classes")
    .where("__name__", "in", classIds)
    .get()

  const classesMap: Record<string, any> = {}
  classesSnapshot.forEach((doc) => {
    const parsed = ClassSchema.safeParse(doc.data())
    if (parsed.success) classesMap[doc.id] = parsed.data
  })

  console.log(childrenMap)

 
  const result = records.map((r: any) => {
    const child = childrenMap[r.childId]
    const cls = classesMap[r.classId]

    return {
      childName: child ? `${child.firstName} ${child.lastName}` : "Unknown",
      className: cls ? cls.name : "Unknown",
      type: r.type,
      details: r.details,
      timestamp: r.timestamp,
    }
  })

  return result
}
