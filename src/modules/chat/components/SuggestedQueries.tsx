import React, { useState } from "react";
import {
  suggestedQueries,
  suggestedQueriesCategories,
} from "../constants/suggested-queries";
import type { SuggestedPrompt } from "../constants/suggested-queries";
import {
  Activity,
  BarChart3,
  PieChart,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  Stocks: <TrendingUp className="size-4" />,
  "Mutual Funds": <PieChart className="size-4" />,
  "Personal Finance": <Wallet className="size-4" />,
};

const promptIconMap: Record<SuggestedPrompt["icon"], React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  BarChart3,
  Sparkles,
  Activity,
  Shield,
  Wallet,
};

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void;
}

export default function SuggestedQueries({
  onQuerySelect,
}: SuggestedQueriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        {suggestedQueriesCategories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory((prev) =>
                prev === category ? null : category,
              )
            }
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-4",
              activeCategory === category
                ? "border-primary-main-dark bg-primary-main-dark text-white shadow-sm"
                : "border-border-default bg-bg-card text-text-secondary hover:border-border-default hover:bg-bg-hover",
            )}
          >
            {categoryIcons[category]}
            {category}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="animate-fade-in-up overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
              {categoryIcons[activeCategory]}
              {activeCategory}
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className="text-text-muted transition-colors hover:text-text-secondary"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="scrollbar-thin max-h-48 overflow-y-auto">
            {suggestedQueries[activeCategory].map((prompt, index, arr) => {
              const Icon = promptIconMap[prompt.icon];
              return (
                <button
                  key={`${activeCategory}-${prompt.id}`}
                  onClick={() => onQuerySelect(prompt.text)}
                  className={cn(
                    "group flex w-full items-start gap-3 px-4 py-3 text-left text-xs text-text-secondary transition-colors duration-150 hover:bg-bg-hover hover:text-text-primary",
                    index < arr.length - 1 &&
                      "border-b border-border-default",
                  )}
                >
                  <Icon className="mt-0.5 size-3.5 shrink-0 text-text-muted group-hover:text-accent-blue" />
                  <span>{prompt.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
