import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize the Firebase client app (initializeApp)

// Prevent multiple initializations (getApps, getApp)

// Access Firebase Auth client-side (getAuth)

const firebaseConfig = {
  apiKey: "AIzaSyD4iRkwO3E4sP5pM98d9HJQMCT9WzyBuMo",
  authDomain: "prepwise-28f8a.firebaseapp.com",
  projectId: "prepwise-28f8a",
  storageBucket: "prepwise-28f8a.firebasestorage.app",
  messagingSenderId: "498664559930",
  appId: "1:498664559930:web:b9cc5ebe6316014e202c03",
  measurementId: "G-5GGE6PRV0X",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
//This ensures Firebase isn’t initialized multiple times (which would crash your app). If no app exists, it initializes one with your config.

export const auth = getAuth(app);
export const db = getFirestore(app);
// This gets the Firebase Auth instance, tied to your initialized app,
// and exports it for use in things like sign-in/sign-up logic.
