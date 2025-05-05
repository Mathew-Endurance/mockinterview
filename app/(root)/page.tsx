import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dummyInterviews } from "../constants";
import InterviewCard from "@/components/InterviewCard";

const HomePage = () => {
  return (
    <>
      <section>
        <div className="card-cta ">
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
        <h2>Your Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => {
            return <InterviewCard {...interview} key={interview?.id} />;
          })}
          {/* <p>you haven&apos;t taken any interview yet</p> */}
        </div>
      </section>

      <div className="flex flex-col mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => {
            return <InterviewCard {...interview} key={interview?.id} />;
          })}
          {/* <p>There are no interviews available</p> */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
