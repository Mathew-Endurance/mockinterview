"use server"; //This marks the file or functions as server-only (used in Next.js 13+ with server actions). It prevents client bundles from including
//  sensitive server-side code like Admin SDK access.

import { adminAuth, db } from "@/app/firebase/admin";
import { cookies } from "next/headers";

// db is your Firestore Admin SDK (server-side DB access)

// cookies allows you to set session cookies in Next.js server components

// adminAuth is your Firebase Admin Auth instance used to verify tokens or create custom sessions securely

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface SignInParams {
  idToken: string;
  email: string;
}

export const SignUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;
  try {
    // sign user up
    const userRecord = await db.collection("user").doc(uid).get();
    // Checks if the user already exists in Firestore. (users collection should match your DB naming).

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exist, Please sign in instead.",
      };
    }

    await db.collection("user").doc(uid).set({
      name,
      email,
    });
    // Creates a new document in the users collection
    // with user info — tied to the UID from Firebase Auth.
    return {
      success: true,
      message: "You have successfully created an account. Please sign in.",
    };
  } catch (error: any) {
    console.log(error, "Error creating user");

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email already exits",
      };
    }
    return {
      sucess: false,
      message: "Failed to create an account",
    };
  }

  return {};
};

// sign-in functionality

export const SignIn = async (params: SignInParams) => {
  const { email, idToken } = params;
  try {
    const userRecord = await adminAuth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist, Create an account instead",
      };
    }
    await setSessionCookie(idToken);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to Sign in to account",
    };
  }
};

// to generate session cookie
export const setSessionCookie = async (idToken: string) => {
  const OneWeekExpireTime = 60 * 60 * 24 * 7 * 1000;
  // store them in cookies
  const cookieStore = await cookies();
  // create the session cookie and the duration of the token

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: OneWeekExpireTime,
  });

  // save it in the cookie store
  cookieStore.set("session", sessionCookie, {
    maxAge: OneWeekExpireTime,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  //   Saves the session cookie on the browser, making it:

  // httpOnly: inaccessible via JS (secure)

  // secure: only sent over HTTPS

  // sameSite: "strict": guards against CSRF

  // path: "/": available site-wide
};

// authenticate users

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser;

  return !!user;
};
