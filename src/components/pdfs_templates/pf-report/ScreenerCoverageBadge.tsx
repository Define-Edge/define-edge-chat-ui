import type { ScreenerCoverage } from "@/api/generated/report-apis/models";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface ScreenerCoverageBadgeProps {
  coverage: ScreenerCoverage | null | undefined;
  showMissing?: boolean;
  className?: string;
}

export default function ScreenerCoverageBadge({
  coverage,
  showMissing = false,
  className,
}: ScreenerCoverageBadgeProps) {
  if (!coverage) return null;

  const { covered_count, total_count, covered_weight, missing_holdings } =
    coverage;

  // Don't render when coverage is 100%
  if (covered_count >= total_count) return null;

  const missingItems =
    showMissing && missing_holdings && missing_holdings.length > 0
      ? (missing_holdings as { Ticker: string; weight: number }[])
      : null;

  return (
    <div
      className={cn(
        "rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <Info className="size-[1.75em] flex-shrink-0" />
        <div>
          Scores based on {covered_count} of {total_count} stocks (
          {covered_weight.toFixed(1)}% portfolio weight)
          {missingItems && (
            <span className="mt-1 block text-blue-600">
              Missing:{" "}
              {missingItems
                .map((h) => `${h.Ticker} (${h.weight.toFixed(1)}%)`)
                .join(", ")}
            </span>
          )}
        </div>
      </span>
    </div>
  );
}
