"use server";

import { db } from "@/app/firebase/admin";
import type { Interview } from "@/app/types";

export async function getInterviews(userId: string): Promise<Interview[]> {
  try {
    console.log("Fetching interviews for user:", userId);

    const interviewsRef = db.collection("interviews");

    // First try without ordering to at least show some data
    try {
      const snapshot = await interviewsRef
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      const interviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];

      console.log(`Found ${interviews.length} interviews for user:`, userId);
      return interviews;
    } catch (error: unknown) {
      // If we get the index error, fall back to unordered query
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "failed-precondition"
      ) {
        console.log("Index not ready, falling back to basic query");
        const basicSnapshot = await interviewsRef
          .where("userId", "==", userId)
          .get();

        const interviews = basicSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Interview[];

        return interviews;
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw error;
  }
}

export async function getInterviewById(
  interviewId: string
): Promise<Interview | null> {
  try {
    console.log("Fetching interview by ID:", interviewId);

    const interviewDoc = await db
      .collection("interviews")
      .doc(interviewId)
      .get();

    if (!interviewDoc.exists) {
      console.log("Interview not found:", interviewId);
      return null;
    }

    const interview = {
      id: interviewDoc.id,
      ...interviewDoc.data(),
    } as Interview;

    console.log("Found interview:", interview);
    return interview;
  } catch (error) {
    console.error("Error fetching interview:", error);
    throw error;
  }
}
