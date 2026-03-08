"use client";

import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";
import groupSmallFragments from "@/lib/groupSmallFragments";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PdfPieChart({
  title,
  data,
  useGrouping = false,
  useSizeColors = false,
}: {
  title: string;
  data: { name: string; value: number }[];
  useGrouping?: boolean;
  useSizeColors?: boolean;
}) {
  const processed = useGrouping
    ? groupSmallFragments(data, {
        id: "name",
        value: "value",
        maxFragments: 15,
      }).map((item, index) => ({
        name: item.name,
        value: item.value,
        color: PIE_COLORS[index % PIE_COLORS.length],
      }))
    : data.map((item, index) => ({
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-48 shrink-0 md:w-48">
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
                  isAnimationActive={false}
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
