"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiDataAnimationProps {
  status: "fetching" | "success" | "error";
}

const FiDataAnimation: React.FC<FiDataAnimationProps> = ({ status }) => {
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[100px] text-green-600">
        <CheckCircle className="w-12 h-12" />
        <p className="text-xl font-semibold">Success!</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[100px] text-red-600">
        <p className="text-xl font-semibold">Failed to fetch data</p>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[100px]">
      <div className="flex items-end justify-center gap-2 h-[30px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 bg-primary rounded-sm animate-wave",
              i === 0 && "h-[15px]",
              i === 1 && "h-[20px]",
              i === 2 && "h-[25px]",
              i === 3 && "h-[20px]",
              i === 4 && "h-[15px]"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <p className="text-xl font-semibold text-muted-foreground">
        Fetching Financial Data...
      </p>
    </div>
  );
};

export default FiDataAnimation; 