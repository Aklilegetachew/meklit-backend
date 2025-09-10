import { db } from "../config/firebase"

interface User {
  id: string
  name: string
  email: string
}

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await db.collection("users").get()
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, "id">),
  }))
}
