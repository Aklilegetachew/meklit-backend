import z from "zod"
import { db } from "../config/firebase"
import { Child } from "../schemas/child"
import { Class, ClassSchema, ServiceError } from "../schemas/class"

export const createClass = async (
  classData: Omit<Class, "id">
): Promise<Class> => {
  try {
    const parsed = ClassSchema.parse(classData)

    const docRef = await db.collection("classes").add(parsed)

    return { id: docRef.id, ...parsed }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      throw new ServiceError(err.issues.map((e) => e.message).join(", "), 422)
    }
    throw new ServiceError("Failed to create class", 500)
  }
}

export const getAllClasses = async (): Promise<Class[]> => {
  try {
    const snapshot = await db.collection("classes").get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Class))
  } catch (err) {
    throw new ServiceError("Failed to fetch classes", 500)
  }
}

export const getClassById = async (classId: string): Promise<Class | null> => {
  try {
    const docRef = await db.collection("classes").doc(classId).get()
    if (!docRef.exists) return null

    return { id: docRef.id, ...docRef.data() } as Class
  } catch (err) {
    throw new ServiceError("Failed to fetch class", 500)
  }
}

export const getClassChildren = async (classId: string): Promise<Child[]> => {
  try {
    const snapshot = await db
      .collection("children")
      .where("classId", "==", classId)
      .get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        birthDate: data.birthDate.toDate
          ? data.birthDate.toDate()
          : data.birthDate,
      } as Child
    })
  } catch (err) {
    throw new ServiceError("Failed to fetch class children", 500)
  }
}
