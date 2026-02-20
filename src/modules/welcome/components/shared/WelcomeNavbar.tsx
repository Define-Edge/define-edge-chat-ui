"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import appConfig from "@/configs/app.config";
import { cn } from "@/lib/utils";

export default function WelcomeNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/60 bg-white/80 shadow-sm backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/welcome" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt={`${appConfig.appName} logo`}
            width={32}
            height={32}
          />
          <span
            className={cn(
              "text-lg font-semibold transition-colors duration-300",
              scrolled ? "text-primary-main-dark" : "text-white",
            )}
          >
            {appConfig.appName}
          </span>
        </Link>

        <Button asChild size="sm">
          <Link href="/">Get Started</Link>
        </Button>
      </nav>
    </header>
  );
}
