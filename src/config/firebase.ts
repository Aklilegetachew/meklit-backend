import admin from "firebase-admin"


const serviceAccount = require("../../firebaseconfig.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

export { admin, db }
