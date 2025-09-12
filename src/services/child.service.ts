import { db } from "../config/firebase"
import { calculateAge, Child, ChildSchema } from "../schemas/child"

export const createChild = async (
  childData: Omit<Child, "id" | "age">
): Promise<Child> => {
  const parsed = ChildSchema.parse(childData)

  const age = calculateAge(parsed.birthDate)

  const docRef = await db.collection("children").add({
    ...parsed,
    birthDate: parsed.birthDate,
    age,
  })

  return { id: docRef.id, ...parsed, age }
}

export const getAllChildren = async (): Promise<Child[]> => {
  const snapshot = await db.collection("children").get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      birthDate: data.birthDate.toDate
        ? data.birthDate.toDate()
        : data.birthDate,
      age: calculateAge(
        data.birthDate.toDate ? data.birthDate.toDate() : data.birthDate
      ),
    } as Child
  })
}

export const getChildrenByClientId = async (
  clientId: string
): Promise<Child[]> => {
  const snapshot = await db
    .collection("children")
    .where("clientId", "==", clientId)
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      birthDate: data.birthDate.toDate
        ? data.birthDate.toDate()
        : data.birthDate,
      age: calculateAge(
        data.birthDate.toDate ? data.birthDate.toDate() : data.birthDate
      ),
    } as Child
  })
}

export const getChildrenByStaffId = async (
  staffId: string
): Promise<Child[]> => {
  const snapshot = await db
    .collection("children")
    .where("staffId", "==", staffId)
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      birthDate: data.birthDate.toDate
        ? data.birthDate.toDate()
        : data.birthDate,
      age: calculateAge(
        data.birthDate.toDate ? data.birthDate.toDate() : data.birthDate
      ),
    } as Child
  })
}

export const getChildById = async (childId: string): Promise<Child | null> => {
  const docRef = await db.collection("children").doc(childId).get()

  if (!docRef.exists) return null

  const data = docRef.data()
  if (!data) return null

  const birthDate = data.birthDate.toDate
    ? data.birthDate.toDate()
    : data.birthDate

  return {
    id: docRef.id,
    ...data,
    birthDate,
    age: calculateAge(birthDate),
  } as Child
}


export const getChildrenBirthdays = async (): Promise<{
  birthdaysThisMonth: Child[];
  birthdaysToday: Child[];
}> => {
  const snapshot = await db.collection("children").get();
  const today = new Date();

  const children = snapshot.docs.map((doc) => {
    const data = doc.data();
    const birthDate = data.birthDate.toDate ? data.birthDate.toDate() : data.birthDate;
    return {
      id: doc.id,
      ...data,
      birthDate,
      age: calculateAge(birthDate),
    } as Child;
  });

  const birthdaysThisMonth = children.filter(
    (c) => c.birthDate.getMonth() === today.getMonth()
  );

  const birthdaysToday = birthdaysThisMonth.filter(
    (c) => c.birthDate.getDate() === today.getDate()
  );

  return { birthdaysThisMonth, birthdaysToday };
};
