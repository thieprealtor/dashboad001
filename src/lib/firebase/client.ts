import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth"
import { Firestore, getFirestore } from "firebase/firestore"
import { FirebaseStorage, getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
}

const missingVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
].filter((key) => !process.env[key])

if (missingVars.length > 0) {
  // Log warning instead of throwing — prevents prerender crash during Next.js build
  // Firebase calls will fail at runtime if env vars are missing
  console.warn(
    `[Firebase] Missing environment variables: ${missingVars.join(", ")}. ` +
    `Set these in .env.local or Vercel Environment Variables.`
  )
}

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
