"use client";

import type { CorrelationHeatmapRow } from "@/types/pf-analysis";

const MAX_STOCKS = 10;

/** Linearly interpolate between two [r,g,b] colors */
function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

// Gradient stops: dark red → red → salmon → cream → light green → green → dark green
const NEG_DARK: [number, number, number] = [153, 27, 27]; // #991B1B
const NEG_MID: [number, number, number] = [220, 70, 55]; // #DC4637
const NEG_LIGHT: [number, number, number] = [245, 190, 170]; // #F5BEAA
const NEUTRAL: [number, number, number] = [252, 246, 228]; // #FCF6E4
const POS_LIGHT: [number, number, number] = [190, 225, 160]; // #BEE1A0
const POS_MID: [number, number, number] = [80, 180, 60]; // #50B43C
const POS_DARK: [number, number, number] = [22, 101, 52]; // #166534

/** Diverging color for correlation values: red ↔ cream ↔ green, range -1 to 1 */
function getCellBg(value: number | null): string {
  if (value == null) return "#F3F4F6";
  const clamped = Math.max(-1, Math.min(1, value));

  if (clamped < -0.5) {
    const t = (clamped + 1) / 0.5; // -1→0, -0.5→1
    return lerpColor(NEG_DARK, NEG_MID, t);
  }
  if (clamped < -0.1) {
    const t = (clamped + 0.5) / 0.4; // -0.5→0, -0.1→1
    return lerpColor(NEG_MID, NEG_LIGHT, t);
  }
  if (clamped < 0) {
    const t = (clamped + 0.1) / 0.1; // -0.1→0, 0→1
    return lerpColor(NEG_LIGHT, NEUTRAL, t);
  }
  if (clamped < 0.1) {
    const t = clamped / 0.1; // 0→0, 0.1→1
    return lerpColor(NEUTRAL, POS_LIGHT, t);
  }
  if (clamped < 0.5) {
    const t = (clamped - 0.1) / 0.4; // 0.1→0, 0.5→1
    return lerpColor(POS_LIGHT, POS_MID, t);
  }
  // 0.5 to 1
  const t = (clamped - 0.5) / 0.5; // 0.5→0, 1→1
  return lerpColor(POS_MID, POS_DARK, t);
}

/** Text color: white on dark backgrounds, dark gray otherwise */
function getCellText(value: number | null): string {
  if (value == null) return "#9CA3AF";
  if (value > 0.7 || value < -0.7) return "#FFFFFF";
  return "#1F2937";
}

type Props = {
  data: CorrelationHeatmapRow[];
};

export default function CorrelationHeatmap({ data }: Props) {
  if (!data || data.length === 0) return null;

  const isTruncated = data.length > MAX_STOCKS;
  const rows = isTruncated ? data.slice(0, MAX_STOCKS) : data;
  const symbols = rows.map((r) => r.symbol);

  return (
    <div className="p-4">
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
