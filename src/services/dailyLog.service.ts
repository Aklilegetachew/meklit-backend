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

// 1. Create a daily log entry
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

// 2. Get all logs (optionally filter)
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

// 3. Get a single log entry with populated references (child, staff, center)
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
    // Fetch logs filtered by childId if provided
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

// 1️⃣ Activity Count by Type
export const getActivityCountByType = async (
  filters: AnalyticsFilters = {}
) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
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

// 2️⃣ Logs by Child
export const getLogsByChild = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {}

    snapshot.docs.forEach((doc) => {
      const childName =
        doc.data().child?.firstName + " " + doc.data().child?.lastName
      if (childName) counts[childName] = (counts[childName] || 0) + 1
    })

    return counts // e.g., { "Sophia Davis": 5, "Ethan Smith": 3 }
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs by child", 500)
  }
}

// 3️⃣ Logs by Staff
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

// 4️⃣ Logs by Center
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

    return counts // e.g., { "Downtown Center": 12, "Uptown Center": 8 }
  } catch (err: any) {
    throw new ServiceError("Failed to fetch logs by center", 500)
  }
}

// 5️⃣ Logs over Time (daily count)
export const getLogsOverTime = async (filters: AnalyticsFilters = {}) => {
  try {
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const counts: Record<string, number> = {} // key: date string

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

// 6️⃣ Mood Trends (stacked by mood detail)
export const getMoodTrends = async (filters: AnalyticsFilters = {}) => {
  try {
    filters.type = "Mood" // only mood logs
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const moodCounts: Record<string, number> = {} // e.g., happy, sad, neutral

    snapshot.docs.forEach((doc) => {
      const mood = doc.data().details || "Unknown"
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })

    return moodCounts
  } catch (err: any) {
    throw new ServiceError("Failed to fetch mood trends", 500)
  }
}

// 7️⃣ Diaper/Nap Patterns
export const getDiaperNapPatterns = async (filters: AnalyticsFilters = {}) => {
  try {
    filters.type = undefined // we can filter for both "Diaper" and "Nap"
    let query: FirebaseFirestore.Query = db.collection("dailyLogs")
    query = applyFilters(query, filters)

    const snapshot = await query.get()
    const patterns: Record<string, Record<string, number>> = {} // childName -> { type -> count }

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
