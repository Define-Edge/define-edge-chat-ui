"use client";

import { cn } from "@/lib/utils";

type StatsRecord = Record<string, unknown>;

type Props = {
  data?: StatsRecord[] | null;
  className?: string;
};

/** Format a cell value for display */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "\u2014";
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "\u2014";
    // If integer and large (like drawdown duration in days), no decimal
    if (Number.isInteger(value) && Math.abs(value) >= 10)
      return value.toLocaleString();
    // Otherwise 2-3 decimal places
    return value.toFixed(3).replace(/\.?0+$/, "") || "0";
  }
  return String(value);
}

/** Color class for numeric values */
function getValueColor(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-600";
  return "";
}

export default function RiskMetricsTable({ data, className }: Props) {
  if (!data || data.length === 0) return null;

  // Extract column headers from first row keys (Stats + dynamic columns)
  const columns = Object.keys(data[0]);
  const statsCol = columns[0]; // "Stats"
  const valueColumns = columns.slice(1);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th
                key={col}
                className={cn(
                  "whitespace-nowrap px-3 py-2 font-semibold text-slate-700",
                  col === statsCol ? "text-left" : "text-right",
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b border-slate-100 transition-colors hover:bg-slate-50/50",
                idx % 2 === 0 ? "bg-white" : "bg-slate-25",
              )}
            >
              <td className="whitespace-nowrap px-3 py-1.5 font-medium text-slate-700">
                {String(row[statsCol] ?? "")}
              </td>
              {valueColumns.map((col) => (
                <td
                  key={col}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 text-right tabular-nums",
                    getValueColor(row[col]),
                  )}
                >
                  {formatCellValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
