// Import functions to initialize Firebase Admin SDK
import { cert, getApps, initializeApp } from "firebase-admin/app";

// Import Firebase Admin services for auth and firestore
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// cert is used to load service account credentials.

// getApps ensures you don't initialize multiple Firebase instances.

// initializeApp sets up the Firebase app.

// getAuth, getFirestore give access to Admin Auth and Firestore services.

const initFirebaseAdmin = () => {
  try {
    console.log("Initializing Firebase Admin...");
    console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
    console.log("Client Email:", process.env.FIREBASE_CLIENT_EMAIL);
    console.log("Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);

    const apps = getApps();
    if (!apps.length) {
      console.log("No Firebase Admin apps found, initializing...");
      initializeApp({
        // Use credentials from service account (environment variables)
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          // Replace escaped newlines so private key is valid
        }),
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.log("Firebase Admin already initialized");
    }

    const auth = getAuth();
    const db = getFirestore();
    console.log("Firebase services initialized");

    return { auth, db };
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
};

// You extract and export auth and db for use in server-side logic (like verifying tokens, reading Firestore).
export const { auth, db } = initFirebaseAdmin();
