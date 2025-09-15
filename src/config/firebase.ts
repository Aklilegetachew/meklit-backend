import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let serviceAccount;

try {
  const serviceAccountPath =
    process.env.NODE_ENV === "production"
      ? "/etc/secrets/firebaseconfig.json"
      : path.resolve(process.cwd(), "firebaseconfig.json"); // safer relative path

  const fileContent = fs.readFileSync(serviceAccountPath, "utf8");
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  console.error("Failed to load Firebase config:", error);
  process.exit(1); // stop app if credentials are missing
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { admin, db };
