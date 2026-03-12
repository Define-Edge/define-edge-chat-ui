"use client";

import ChartContainer from "../layout/ChartContainer";
import BulbIcon from "@/components/icons/BulbIcon";
import { cn } from "@/lib/utils";
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

import { getCellBg as _getCellBg, getCellText as _getCellText } from "@/lib/heatmap-colors";

const SCALE = 10;

const getCellBg = (v: number | null) => _getCellBg(v, SCALE);
const getCellText = (v: number | null) => _getCellText(v, SCALE);

function formatCell(value: number | null): string {
  if (value == null) return "0.00";
  return value.toFixed(2);
}

function HeatmapTable({
  label,
  rows,
  compact = false,
}: {
  label: string;
  rows: HeatmapRow[];
  compact?: boolean;
}) {
  if (!rows || rows.length === 0) return null;

  // Compute mean row
  const meanRow: Record<string, number | null> = {};
  for (const m of MONTHS) {
    meanRow[m] = mean(rows.map((r) => r[m] as number | null));
  }

  // Compute YTD for each row
  const ytdValues = rows.map(computeYTD);

  const colWidth = compact ? "44px" : "48px";
  const headerCls = cn(
    "flex items-center justify-center rounded font-semibold text-gray-500",
    compact ? "px-0.5 py-1 text-[8px]" : "px-1 py-1.5 text-[9px]",
  );
  const cellCls = cn(
    "flex items-center justify-center font-medium",
    compact ? "px-0.5 py-1.5 text-[8px]" : "px-1 py-2 text-[10px]",
  );
  const yearCls = cn(
    "flex items-center justify-center rounded bg-gray-50 font-semibold text-gray-700",
    compact ? "px-0.5 py-1.5 text-[8px]" : "px-1 py-2 text-[10px]",
  );
  const boldCellCls = cn(
    "flex items-center justify-center font-semibold",
    compact ? "px-0.5 py-1.5 text-[8px]" : "px-1 py-2 text-[10px]",
  );
  const meanCls = cn(
    "flex items-center justify-center bg-gray-50 font-bold text-gray-700",
    compact ? "px-0.5 py-1.5 text-[8px]" : "px-1 py-2 text-[10px]",
  );

  return (
    <div>
      <h4
        className={cn(
          "font-semibold text-gray-600",
          compact ? "mb-1 text-[9px]" : "mb-1.5 text-[10px]",
        )}
      >
        {label}
      </h4>
      <div
        className={cn("grid", compact ? "gap-[2px]" : "gap-[3px]")}
        style={{
          gridTemplateColumns: `${colWidth} repeat(12, 1fr) ${colWidth}`,
        }}
      >
        {/* Header row */}
        <div className={headerCls}>Year</div>
        {MONTHS.map((m) => (
          <div key={m} className={headerCls}>
            {m}
          </div>
        ))}
        <div className={headerCls}>YTD</div>

        {/* Data rows */}
        {rows.map((row, idx) => {
          const ytd = ytdValues[idx];
          return (
            <div
              key={row.year}
              className="contents"
            >
              <div className={yearCls}>{row.year}</div>
              {MONTHS.map((m) => {
                const val = row[m] as number | null;
                return (
                  <div
                    key={m}
                    className={cellCls}
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
                className={boldCellCls}
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
        <div className={meanCls}>Mean</div>
        {MONTHS.map((m) => {
          const val = meanRow[m];
          return (
            <div
              key={m}
              className={boldCellCls}
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
          className={cn(
            "border-t border-gray-300",
            compact ? "px-0.5 py-1.5" : "px-1 py-2",
          )}
        />
      </div>
    </div>
  );
}

/** Standalone heatmap tables — no ChartContainer wrapper */
export function MonthlyReturnsHeatmapTables({
  heatmap,
  className,
  compact: compactProp = false,
}: {
  heatmap: MonthlyReturnsHeatmapData;
  className?: string;
  compact?: boolean;
}) {
  if (!heatmap) return null;

  const portfolio = heatmap.portfolio;
  const benchmark = heatmap.benchmark;
  const active = heatmap.active;
  const hasPortfolio = portfolio && portfolio.length > 0;
  const hasBenchmark = benchmark && benchmark.length > 0;
  const hasActive = active && active.length > 0;

  if (!hasPortfolio) return null;

  // Use compact mode when explicitly set or when any table has more than 3 years of data
  const maxYears = Math.max(
    portfolio?.length ?? 0,
    benchmark?.length ?? 0,
    active?.length ?? 0,
  );
  const compact = compactProp ?? maxYears > 3;

  return (
    <div className={className ?? cn(compact ? "space-y-4 p-3" : "space-y-8 p-4")}>
      <HeatmapTable
        label="Portfolio Returns (%)"
        rows={portfolio}
        compact={compact}
      />
      {hasBenchmark && (
        <HeatmapTable
          label="Benchmark Returns (%) — Nifty 500"
          rows={benchmark}
          compact={compact}
        />
      )}
      {hasActive && (
        <HeatmapTable
          label="Active Returns (%) — Portfolio vs Benchmark"
          rows={active}
          compact={compact}
        />
      )}
    </div>
  );
}

type Props = {
  heatmap?: MonthlyReturnsHeatmapData;
  summary?: string;
  compact?: boolean;
};

/** Full MonthlyReturnsHeatmap with ChartContainer — used in PDF report */
export default function MonthlyReturnsHeatmap({ heatmap, summary, compact }: Props) {
  if (!heatmap && !summary) return null;

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
        <MonthlyReturnsHeatmapTables heatmap={heatmap ?? null} compact={compact} />
      </ChartContainer>
    </div>
  );
}
