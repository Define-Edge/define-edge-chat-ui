"use client";

import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
}

export default function GradientBackground({
  className,
}: GradientBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Top-right circle */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-3xl" />
      {/* Bottom-left circle */}
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-brand-teal/15 blur-3xl" />
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl" />
    </div>
  );
}
