import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/app/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
// create route
export async function GET() {
  return Response.json({ success: true, data: "Thank you" }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    console.log("Starting interview generation...");
    const { type, role, level, techstack, amount, userid } =
      await request.json();
    console.log("Received request data:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
    });

    console.log("Generating interview questions...");
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    console.log("Questions generated successfully");
    console.log("Raw questions text:", questions);

    const parsedQuestions = JSON.parse(questions);
    console.log("Parsed questions:", parsedQuestions);

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Attempting to save interview to Firestore:", interview);
    try {
      const docRef = await db.collection("interviews").add(interview);
      console.log("Interview saved successfully with ID:", docRef.id);
      return Response.json(
        { success: true, interviewId: docRef.id },
        { status: 200 }
      );
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError);
      throw firestoreError;
    }
  } catch (error) {
    console.error("Error in interview generation:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
