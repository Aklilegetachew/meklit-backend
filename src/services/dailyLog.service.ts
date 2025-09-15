import { z } from "zod"
import { DailyLogEntry, DailyLogEntrySchema } from "../schemas/dailyLogEntry"
import { getChildById } from "./child.service"
import { getStaffById } from "./staff.service"
import { getCenterById } from "./center.service"
import { db } from "../config/firebase"

interface AnalyticsFilters {
  childId?: string
  staffId?: string
  centerId?: string
  type?: string
  startDate?: Date
  endDate?: Date
}

class ServiceError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}


export const createDailyLog = async (
  entry: Omit<DailyLogEntry, "id">
): Promise<DailyLogEntry> => {
  try {
    const parsed = DailyLogEntrySchema.parse(entry)

    const docRef = await db.collection("dailyLogs").add(parsed)

    return { id: docRef.id, ...parsed }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      throw new ServiceError(err.issues.map((e) => e.message).join(", "), 422)
    }
    throw new ServiceError("Failed to create daily log", 500)
  }
}


export const getDailyLogs = async (filters?: {
  childId?: string
  staffId?: string
  centerId?: string
  type?: DailyLogEntry["type"]
  startDate?: Date
  endDate?: Date
}): Promise<DailyLogEntry[]> => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")

    if (filters?.childId) query = query.where("childId", "==", filters.childId)
    if (filters?.staffId) query = query.where("staffId", "==", filters.staffId)
    if (filters?.centerId)
      query = query.where("centerId", "==", filters.centerId)
    if (filters?.type) query = query.where("type", "==", filters.type)
    if (filters?.startDate)
      query = query.where("timestamp", ">=", filters.startDate)
    if (filters?.endDate)
      query = query.where("timestamp", "<=", filters.endDate)

    const snapshot = await query.get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate
          ? data.timestamp.toDate()
          : data.timestamp,
      } as DailyLogEntry
    })
  } catch (err) {
    throw new ServiceError("Failed to fetch daily logs", 500)
  }
}

export const getDailyLogById = async (logId: string): Promise<any | null> => {
  try {
    const docRef = await db.collection("dailyLogs").doc(logId).get()
    if (!docRef.exists) return null

    const data = docRef.data()
    if (!data) return null

    const child = await getChildById(data.childId)
    const staff = await getStaffById(data.staffId)
    const center = await getCenterById(data.centerId)

    return {
      id: docRef.id,
      ...data,
      timestamp: data.timestamp.toDate
        ? data.timestamp.toDate()
        : data.timestamp,
      child,
      staff,
      center,
    }
  } catch (err) {
    throw new ServiceError("Failed to fetch daily log", 500)
  }
}

export const getDailyLogsWithDetails = async (childId?: string) => {
  try {
    let queryRef: FirebaseFirestore.Query = db.collection("dailyLogs")
    if (childId) {
      queryRef = queryRef.where("childId", "==", childId)
    }

    const logsSnapshot = await queryRef.get()
    const logsData = []

    for (const doc of logsSnapshot.docs) {
      const log = doc.data()

      const childRef = await db.collection("children").doc(log.childId).get()
      const childData = childRef.exists ? childRef.data() : null

      const staffRef = await db
        .collection("staffMembers")
        .doc(log.staffId)
        .get()
      const staffData = staffRef.exists ? staffRef.data() : null

      const centerRef = await db.collection("center").doc(log.centerId).get()
      const centerData = centerRef.exists ? centerRef.data() : null

      logsData.push({
        id: doc.id,
        ...log,
        child: childData,
        staff: staffData,
        center: centerData,
      })
    }

    return logsData
  } catch (err) {
    console.error("Failed to fetch logs with details:", err)
    throw err
  }
}

const applyFilters = (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  filters: AnalyticsFilters
) => {
  if (filters.childId) query = query.where("childId", "==", filters.childId)
  if (filters.staffId) query = query.where("staffId", "==", filters.staffId)
  if (filters.centerId) query = query.where("centerId", "==", filters.centerId)
  if (filters.type) query = query.where("type", "==", filters.type)
  if (filters.startDate)
    query = query.where("timestamp", ">=", filters.startDate)
  if (filters.endDate) query = query.where("timestamp", "<=", filters.endDate)
  return query
}


export const getActivityCountByType = async (
  filters: AnalyticsFilters = {}
) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    console.log("dayily log", snapshot)
    const counts: Record<string, number> = {}

    snapshot.docs.forEach((doc) => {
      const data = doc.data()
      const type = data.type
      counts[type] = (counts[type] || 0) + 1
    })

    return counts // e.g., { Meal: 12, Nap: 8, Mood: 5 }
  } catch (err: any) {
    throw new ServiceError("Failed to fetch activity count by type", 500)
  }
}

export const getLogsByChild = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {}

    for (const doc of snapshot.docs) {
      const log = doc.data()

    
      const childRef = await db.collection("children").doc(log.childId).get()
      const childData = childRef.exists ? childRef.data() : null

      const childName = childData
        ? `${childData.firstName} ${childData.lastName}`
        : "Unknown"

      counts[childName] = (counts[childName] || 0) + 1
    }

    return counts
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs by child", 500)
  }
}


export const getLogsByStaff = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {}

    snapshot.docs.forEach((doc) => {
      const staffName =
        doc.data().staff?.firstName + " " + doc.data().staff?.lastName
      if (staffName) counts[staffName] = (counts[staffName] || 0) + 1
    })

    return counts // e.g., { "John Doe": 10, "Jane Smith": 6 }
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs by staff", 500)
  }
}


export const getLogsByCenter = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {}

    snapshot.docs.forEach((doc) => {
      const centerName = doc.data().center?.name
      if (centerName) counts[centerName] = (counts[centerName] || 0) + 1
    })

    return counts
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs by center", 500)
  }
}


export const getLogsOverTime = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {} 

    snapshot.docs.forEach((doc) => {
      const ts = doc.data().timestamp
      if (!ts) return
      const date = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts)
      const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD
      counts[dateStr] = (counts[dateStr] || 0) + 1
    })

    return counts // e.g., { "2025-09-12": 5, "2025-09-13": 7 }
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs over time", 500)
  }
}


export const getMoodTrends = async (filters: AnalyticsFilters = {}) => {
  try {
    filters.type = "Mood" // only mood logs
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const moodCounts: Record<string, number> = {} 

    snapshot.docs.forEach((doc) => {
      const mood = doc.data().details || "Unknown"
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })

    return moodCounts
  } catch (err: any) {
    throw new ServiceError("Failed to fetch mood trends", 500)
  }
}


export const getDiaperNapPatterns = async (filters: AnalyticsFilters = {}) => {
  try {
    filters.type = undefined 
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const patterns: Record<string, Record<string, number>> = {}

    snapshot.docs.forEach((doc) => {
      const type = doc.data().type
      if (type !== "Diaper" && type !== "Nap") return

      const childName =
        doc.data().child?.firstName + " " + doc.data().child?.lastName
      if (!childName) return

      if (!patterns[childName]) patterns[childName] = {}
      patterns[childName][type] = (patterns[childName][type] || 0) + 1
    })

    return patterns
  } catch (err: any) {
    throw new ServiceError("Failed to fetch diaper/nap patterns", 500)
  }
}

export const getRecentLogsService = async () => {
  try {
    const snapshot = await db
      .collection("dailyLogs")
      .orderBy("timestamp", "desc")
      .limit(5)
      .get()

    const logs = []

    for (const doc of snapshot.docs) {
      const data = doc.data()

      // Fetch child
      const childRef = await db.collection("children").doc(data.childId).get()
      const childData = childRef.exists ? childRef.data() : null

      // Fetch staff
      const staffRef = await db
        .collection("staffMembers")
        .doc(data.staffId)
        .get()
      const staffData = staffRef.exists ? staffRef.data() : null

      logs.push({
        id: doc.id,
        childName: childData
          ? `${childData.firstName} ${childData.lastName}`
          : "Unknown",
        staffName: staffData
          ? `${staffData.firstName} ${staffData.lastName}`
          : "Unknown",
        type: data.type,
        details: data.details,
        timestamp: data.timestamp.toDate
          ? data.timestamp.toDate()
          : data.timestamp,
      })
    }

    return logs
  } catch (err: any) {
    throw new ServiceError("Failed to fetch recent daily logs", 500)
  }
}
