// Import functions to initialize Firebase Admin SDK
import { cert, getApps, initializeApp } from "firebase-admin/app";

// Import Firebase Admin services for auth and firestore
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// cert is used to load service account credentials.

// getApps ensures you don’t initialize multiple Firebase instances.

// initializeApp sets up the Firebase app.

// getAuth, getFirestore give access to Admin Auth and Firestore services.

const initFirebaseAdmin = () => {
  //This checks if Firebase Admin is already initialized — Firebase throws errors if you try to re-initialize.
  const apps = getApps(); // Get all initialized Firebase admin apps

  // If no app has been initialized yet, initialize it
  if (!apps.length) {
    initializeApp({
      // Use credentials from service account (environment variables)
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        // Replace escaped newlines so private key is valid
      }),
    });
  }

  //You return initialized services so they can be reused across your app.
  return {
    adminAuth: getAuth(), // For server-side authentication (verify tokens, manage users)
    db: getFirestore(), // For accessing Firestore database
  };
};

// You extract and export auth and db for use in server-side logic (like verifying tokens, reading Firestore).
export const { adminAuth, db } = initFirebaseAdmin();
