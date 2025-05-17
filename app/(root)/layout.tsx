import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  console.log("Root layout: Checking authentication...");
  const isUserAuthenticated = await isAuthenticated();
  console.log("Root layout: Is authenticated:", isUserAuthenticated);

  if (!isUserAuthenticated) {
    console.log(
      "Root layout: User not authenticated, redirecting to sign-in..."
    );
    redirect("/sign-in");
  }

  console.log("Root layout: User is authenticated, rendering page...");
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
