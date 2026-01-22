import React, { useState } from "react";
import {
  suggestedQueries,
  suggestedQueriesCategories,
} from "../constants/suggested-queries";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void;
}

export default function SuggestedQueries({
  onQuerySelect,
}: SuggestedQueriesProps) {
  const [activeCategory, setActiveCategory] = useState("Stocks");

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div className="flex justify-center space-x-2">
        {suggestedQueriesCategories.map((category) => (
          <CategoryButton
            key={category}
            label={category}
            isActive={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
        {suggestedQueries[activeCategory as keyof typeof suggestedQueries].map(
          (query, index) => (
            <SuggestedQuery
              key={index}
              query={query}
              onClick={() => onQuerySelect(query)}
            />
          ),
        )}
      </div>
    </div>
  );
}

function SuggestedQuery({
  query,
  onClick,
}: {
  query: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full md:w-[calc(50%-0.5rem)] rounded-lg border border-border-default bg-bg-card p-2.5 text-left shadow-sm transition-all duration-200 hover:border-accent-blue hover:bg-gradient-to-r hover:from-brand-gradient-from hover:to-brand-gradient-to hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary group-hover:text-accent-blue">
          {query}
        </span>
        <ArrowUpRight className="ml-2 h-3.5 w-3.5 flex-shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-blue" />
      </div>
    </button>
  );
}

function CategoryButton({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs shadow-sm transition-all ${
        isActive
          ? "bg-accent-blue text-primary-foreground shadow-md hover:bg-accent-indigo"
          : "border border-border-default bg-bg-card text-text-secondary hover:border-border-default hover:bg-bg-hover"
      }`}
    >
      {label}
    </Button>
  );
}
