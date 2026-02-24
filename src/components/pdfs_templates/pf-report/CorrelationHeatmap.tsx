"use client";

import {
  getCellBg as _getCellBg,
  getCellText as _getCellText,
} from "@/lib/heatmap-colors";
import { cn } from "@/lib/utils";
import type { CorrelationHeatmapRow } from "@/types/pf-analysis";

const MAX_STOCKS = 10;
const SCALE = 1;

const getCellBg = (v: number | null) => _getCellBg(v, SCALE);
const getCellText = (v: number | null) => _getCellText(v, SCALE);

type Props = {
  data: CorrelationHeatmapRow[];
  className?: string;
};

export default function CorrelationHeatmap({ data, className }: Props) {
  if (!data || data.length === 0) return null;

  const isTruncated = data.length > MAX_STOCKS;
  const rows = isTruncated ? data.slice(0, MAX_STOCKS) : data;
  const symbols = rows.map((r) => r.symbol);

  return (
    <div className={cn("p-4", className)}>
      <h4 className="mb-4 text-center font-medium text-gray-900">
        Correlation Heatmap
      </h4>
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `64px repeat(${symbols.length}, 1fr)`,
        }}
      >
        {/* Header row */}
        <div />
        {symbols.map((s) => (
          <div
            key={`hdr-${s}`}
            className="flex items-end justify-center px-0.5 py-1 text-[8px] leading-tight font-semibold text-gray-600"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            {s}
          </div>
        ))}

        {/* Data rows */}
        {rows.map((row) => (
          <div
            key={`row-${row.symbol}`}
            className="contents"
          >
            <div className="flex items-center justify-end truncate pr-1.5 text-[9px] font-semibold text-gray-700">
              {row.symbol}
            </div>
            {symbols.map((col) => {
              const val =
                typeof row[col] === "number" ? (row[col] as number) : null;
              return (
                <div
                  key={`${row.symbol}-${col}`}
                  className="flex items-center justify-center py-1.5 text-[9px] font-medium"
                  style={{
                    backgroundColor: getCellBg(val),
                    color: getCellText(val),
                  }}
                >
                  {val != null ? val.toFixed(2) : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isTruncated && (
        <p className="mt-2 text-center text-[9px] text-gray-500">
          Showing top {MAX_STOCKS} stocks by portfolio weight.{" "}
          {data.length - MAX_STOCKS} additional stocks not displayed.
        </p>
      )}
    </div>
  );
}
