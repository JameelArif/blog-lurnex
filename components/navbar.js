"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";

export default function Navbar() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Learn", href: "/learn" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <Container>
      <nav className="flex items-center justify-between py-4">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/logo.png" // Make sure you place logo.png in public/
              alt="Lurnex Logo"
              width={120}
              height={30}
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
          {/* Sign in & Register buttons */}
          <Link
            href="/signin"
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            Register
          </Link>
        </div>
      </nav>
    </Container>
  );
}
