"use client";

import ChartContainer from "../layout/ChartContainer";
import BulbIcon from "@/components/icons/BulbIcon";
import type {
  HeatmapRow,
  MonthlyReturnsHeatmapData,
} from "@/types/pf-analysis";

export type { MonthlyReturnsHeatmapData } from "@/types/pf-analysis";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type Props = {
  heatmap?: MonthlyReturnsHeatmapData;
  summary?: string;
};

/** Compute YTD as compounded return of non-null months */
function computeYTD(row: HeatmapRow): number | null {
  let product = 1;
  let hasValue = false;
  for (const m of MONTHS) {
    const v = row[m];
    if (v != null) {
      product *= 1 + v / 100;
      hasValue = true;
    }
  }
  return hasValue ? (product - 1) * 100 : null;
}

/** Compute mean of non-null values */
function mean(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

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

/** Continuous diverging color: red ↔ cream ↔ green, clamped at ±10 */
function getCellBg(value: number | null): string {
  if (value == null) return "#F3F4F6";
  const clamped = Math.max(-10, Math.min(10, value));

  if (clamped < -5) {
    const t = (clamped + 10) / 5; // -10→0, -5→1
    return lerpColor(NEG_DARK, NEG_MID, t);
  }
  if (clamped < -1) {
    const t = (clamped + 5) / 4; // -5→0, -1→1
    return lerpColor(NEG_MID, NEG_LIGHT, t);
  }
  if (clamped < 0) {
    const t = (clamped + 1) / 1; // -1→0, 0→1
    return lerpColor(NEG_LIGHT, NEUTRAL, t);
  }
  if (clamped < 1) {
    const t = clamped / 1; // 0→0, 1→1
    return lerpColor(NEUTRAL, POS_LIGHT, t);
  }
  if (clamped < 5) {
    const t = (clamped - 1) / 4; // 1→0, 5→1
    return lerpColor(POS_LIGHT, POS_MID, t);
  }
  // 5 to 10
  const t = (clamped - 5) / 5; // 5→0, 10→1
  return lerpColor(POS_MID, POS_DARK, t);
}

/** Text color: white on dark backgrounds, dark gray otherwise */
function getCellText(value: number | null): string {
  if (value == null) return "#9CA3AF";
  if (value > 7 || value < -7) return "#FFFFFF";
  return "#1F2937";
}

function formatCell(value: number | null): string {
  if (value == null) return "0.00";
  return value.toFixed(2);
}

function HeatmapTable({
  label,
  rows,
}: {
  label: string;
  rows: HeatmapRow[];
}) {
  if (!rows || rows.length === 0) return null;

  // Compute mean row
  const meanRow: Record<string, number | null> = {};
  for (const m of MONTHS) {
    meanRow[m] = mean(rows.map((r) => r[m] as number | null));
  }

  // Compute YTD for each row
  const ytdValues = rows.map(computeYTD);

  return (
    <div>
      <h4 className="mb-1.5 text-[10px] font-semibold text-gray-600">
        {label}
      </h4>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `48px repeat(12, 1fr) 48px`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-center rounded px-1 py-1.5 text-[9px] font-semibold text-gray-500">
          Year
        </div>
        {MONTHS.map((m) => (
          <div
            key={m}
            className="flex items-center justify-center rounded px-1 py-1.5 text-[9px] font-semibold text-gray-500"
          >
            {m}
          </div>
        ))}
        <div className="flex items-center justify-center rounded px-1 py-1.5 text-[9px] font-semibold text-gray-500">
          YTD
        </div>

        {/* Data rows */}
        {rows.map((row, idx) => {
          const ytd = ytdValues[idx];
          return (
            <div
              key={row.year}
              className="contents"
            >
              <div className="flex items-center justify-center rounded bg-gray-50 px-1 py-2 text-[10px] font-semibold text-gray-700">
                {row.year}
              </div>
              {MONTHS.map((m) => {
                const val = row[m] as number | null;
                return (
                  <div
                    key={m}
                    className="flex items-center justify-center px-1 py-2 text-[10px] font-medium"
                    style={{
                      backgroundColor: getCellBg(val),
                      color: getCellText(val),
                    }}
                  >
                    {formatCell(val)}
                  </div>
                );
              })}
              <div
                className="flex items-center justify-center px-1 py-2 text-[10px] font-semibold"
                style={{
                  backgroundColor: getCellBg(ytd),
                  color: getCellText(ytd),
                }}
              >
                {formatCell(ytd)}
              </div>
            </div>
          );
        })}

        {/* Mean row */}
        <div className="flex items-center justify-center bg-gray-50 px-1 py-2 text-[10px] font-bold text-gray-700">
          Mean
        </div>
        {MONTHS.map((m) => {
          const val = meanRow[m];
          return (
            <div
              key={m}
              className="flex items-center justify-center px-1 py-2 text-[10px] font-semibold"
              style={{
                backgroundColor: getCellBg(val),
                color: getCellText(val),
              }}
            >
              {formatCell(val)}
            </div>
          );
        })}
        <div className="border-t border-gray-300 px-1 py-2" />
      </div>
    </div>
  );
}

export default function MonthlyReturnsHeatmap({ heatmap, summary }: Props) {
  if (!heatmap && !summary) return null;

  const portfolio = heatmap?.portfolio;
  const benchmark = heatmap?.benchmark;
  const active = heatmap?.active;
  const hasBenchmark = benchmark && benchmark.length > 0;
  const hasActive = active && active.length > 0;
  const hasPortfolio = portfolio && portfolio.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold tracking-tight">
        Monthly Returns
      </h3>

      <ChartContainer
        Icon={BulbIcon}
        desc={
          summary ||
          "Monthly returns show how your portfolio performed each month compared to the benchmark. Green cells indicate positive returns and red cells indicate negative returns."
        }
        context="Tracking monthly returns helps identify seasonal patterns and consistency in portfolio performance relative to the benchmark."
      >
        {hasPortfolio && (
          <div className="space-y-8 p-4">
            <HeatmapTable
              label="Portfolio Returns (%)"
              rows={portfolio}
            />

            {hasBenchmark && (
              <HeatmapTable
                label="Benchmark Returns (%) — Nifty 500"
                rows={benchmark}
              />
            )}

            {hasActive && (
              <HeatmapTable
                label="Active Returns (%) — Portfolio vs Benchmark"
                rows={active}
              />
            )}
          </div>
        )}
      </ChartContainer>
    </div>
  );
}
