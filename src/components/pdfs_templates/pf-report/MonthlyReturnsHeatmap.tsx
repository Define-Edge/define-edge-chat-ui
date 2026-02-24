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

/** Standalone heatmap tables — no ChartContainer wrapper */
export function MonthlyReturnsHeatmapTables({
  heatmap,
  className,
}: {
  heatmap: MonthlyReturnsHeatmapData;
  className?: string;
}) {
  if (!heatmap) return null;

  const portfolio = heatmap.portfolio;
  const benchmark = heatmap.benchmark;
  const active = heatmap.active;
  const hasPortfolio = portfolio && portfolio.length > 0;
  const hasBenchmark = benchmark && benchmark.length > 0;
  const hasActive = active && active.length > 0;

  if (!hasPortfolio) return null;

  return (
    <div className={className ?? "space-y-8 p-4"}>
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
  );
}

type Props = {
  heatmap?: MonthlyReturnsHeatmapData;
  summary?: string;
};

/** Full MonthlyReturnsHeatmap with ChartContainer — used in PDF report */
export default function MonthlyReturnsHeatmap({ heatmap, summary }: Props) {
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
        <MonthlyReturnsHeatmapTables heatmap={heatmap ?? null} />
      </ChartContainer>
    </div>
  );
}
