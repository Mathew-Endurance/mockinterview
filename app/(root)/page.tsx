import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviews } from "@/lib/actions/interview.actions";
import type { Interview } from "@/app/types";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const interviews: Interview[] = await getInterviews(user.id);

  return (
    <>
      <section>
        <div className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
            <p className="text-lg">
              Practice real interview questions & get instant feedback.
            </p>
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
          <Image
            src="/robot.png"
            width={400}
            height={400}
            alt="robot-dude"
            className="max-sm:hidden"
          />
        </div>
      </section>

      {/* interview section */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {interviews.length > 0 ? (
            interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-center w-full text-gray-500">
              You haven&apos;t taken any interviews yet. Start one now!
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
