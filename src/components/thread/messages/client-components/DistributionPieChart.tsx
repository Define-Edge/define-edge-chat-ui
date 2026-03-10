"use client";

import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";
import groupSmallFragments from "@/lib/groupSmallFragments";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function DistributionPieChart({
  title,
  data,
  useGrouping = false,
  useSizeColors = false,
  disableAnimation = false,
  className,
}: {
  title: string;
  data: { name: string; value: number }[];
  useGrouping?: boolean;
  useSizeColors?: boolean;
  disableAnimation?: boolean;
  className?: string;
}) {
  // Merge entries with empty/null names into "Others", then deduplicate by name
  const normalized = (() => {
    const map = new Map<string, number>();
    for (const item of data) {
      const key = item.name || "Others";
      map.set(key, (map.get(key) ?? 0) + item.value);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  })();

  const grouped = useGrouping
    ? groupSmallFragments(normalized, {
        id: "name",
        value: "value",
        maxFragments: 15,
      })
    : normalized;

  // Deduplicate by name after groupSmallFragments (which may create its own "Others")
  const deduped = (() => {
    const map = new Map<string, number>();
    for (const item of grouped) {
      map.set(item.name, (map.get(item.name) ?? 0) + item.value);
    }
    return Array.from(map, ([name, value]) => ({ name, value }));
  })();

  const processed = deduped.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: useSizeColors
      ? SIZE_COLORS[item.name] || PIE_COLORS[index % PIE_COLORS.length]
      : PIE_COLORS[index % PIE_COLORS.length],
  }));

  if (processed.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      </div>
      <div className="p-5">
        <div className={className ?? "flex flex-col gap-4 md:flex-row md:items-center"}>
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={processed}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={!disableAnimation}
                >
                  {processed.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {processed.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 py-0.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-800 tabular-nums">
                  {Number(item.value).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
