import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="">
      <Link href="/" className="flex gap-2 items-center">
        <Image src="./logo.svg" alt="logo" width={38} height={32} />
        <h3>PrepWise</h3>
      </Link>
    </nav>
  );
};

export default Navbar;
