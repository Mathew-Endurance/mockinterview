import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  console.log("Auth layout: Checking authentication...");
  const isUserAuthenticated = await isAuthenticated();
  console.log("Auth layout: Is authenticated:", isUserAuthenticated);

  if (isUserAuthenticated) {
    console.log("Auth layout: User is authenticated, redirecting to home...");
    redirect("/");
  }

  console.log("Auth layout: User not authenticated, showing auth page...");
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
