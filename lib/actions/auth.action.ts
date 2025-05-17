"use server";
import { auth, db } from "@/app/firebase/admin";
import { SignInParams, SignUpParams, User } from "@/app/types";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  console.log("Setting session cookie...");
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });
  console.log("Session cookie created successfully");

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  console.log("Cookie set in browser");
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    console.log(`Attempting to sign up user: ${email}`);
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      console.log(`User ${email} already exists`);
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });
    console.log(`User ${email} created successfully`);

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    console.log("Attempting to sign in user:", email);
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      console.log("User not found:", email);
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    await setSessionCookie(idToken);
    console.log("User signed in successfully:", email);

    return { success: true };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  console.log("Signing out user...");
  const cookieStore = await cookies();
  cookieStore.delete("session");
  console.log("Session cookie deleted");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  console.log("Getting current user...");
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    console.log("No session cookie found");
    return null;
  }

  try {
    console.log("Verifying session cookie...");
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log("Session cookie verified, getting user data...");

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      console.log("User record not found in database");
      return null;
    }

    const userData = {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;

    console.log("User data retrieved successfully:", userData.email);
    return userData;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  console.log("Checking authentication...");
  const user = await getCurrentUser();
  const isAuth = !!user;
  console.log("Is authenticated:", isAuth);
  return isAuth;
}
