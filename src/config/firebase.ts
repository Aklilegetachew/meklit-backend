import admin from "firebase-admin"
import fs from "fs"
//for dev
// const serviceAccount = require("../../firebaseconfig.json")

const serviceAccountPath = "/etc/secrets/firebaseconfig.json"

// Parse the JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

export { admin, db }
