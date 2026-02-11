"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { DrawdownChartData } from "@/types/pf-analysis";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: DrawdownChartData;
  returnsData?: Record<string, number>[];
  className?: string;
};

export default function DrawdownChart({ data, returnsData, className }: Props) {
  const isMobile = useIsMobile();
  const { underwater_plot, worst_periods, colors, title, description } = data;

  // 1. Top Chart Data (Returns)
  const returnsKeys = Object.keys(returnsData?.[0] || {}).filter(
    (k) => k !== "date",
  );

  // 2. Bottom Chart Data (Underwater)
  const underwaterKeys = Object.keys(underwater_plot?.[0] || {}).filter(
    (k) => k !== "date",
  );
  // Calculate nice Y-axis domain for underwater plot
  const allUnderwaterValues = (underwater_plot || []).flatMap((d) =>
    underwaterKeys.map((k) => Number(d[k]) || 0),
  );
  const uwMin = Math.min(...allUnderwaterValues, 0);
  const yMinUW = Math.floor(uwMin); // e.g. -5.29 → -6

  return (
    <div
      className={cn(
        "mx-auto grid min-w-[calc(100dvw-2rem)] grid-rows-[auto] gap-6 md:min-w-3xl",
        className,
      )}
    >
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <motion.div
          className="bg-gray-100"
          initial={false}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-6 p-4">
            {/* Chart 1: Strategy - Worst 5 Drawdown Periods */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">
                Strategy - Worst 5 Drawdown Periods
              </h4>
              <div className="h-[300px] w-full rounded-md border border-gray-200 bg-white p-2">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={returnsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: isMobile ? -10 : 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(unixTime) =>
                        new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          year: "2-digit",
                        }).format(new Date(unixTime))
                      }
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      fontSize={10}
                      tickMargin={6}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(0)}%`}
                      fontSize={10}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      labelFormatter={(l) =>
                        new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(new Date(l))
                      }
                      formatter={(value: number) => [
                        `${value.toFixed(2)}%`,
                        undefined,
                      ]}
                    />
                    <Legend />
                    {/* Highlight Regions */}
                    {worst_periods.map((period, index) => (
                      <ReferenceArea
                        key={index}
                        x1={period.start_date}
                        x2={period.end_date}
                        fill="red"
                        fillOpacity={0.1}
                        strokeOpacity={0}
                      />
                    ))}
                    {/* Lines (using existing returns data) */}
                    {returnsKeys.map((key) => (
                      <Line
                        key={key}
                        type="linear"
                        dataKey={key}
                        stroke={colors?.[key] || "#035BFF"}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Underwater Plot */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">
                Underwater Plot
              </h4>
              <div className="h-[300px] w-full rounded-md border border-gray-200 bg-white p-2">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={underwater_plot}
                    margin={{
                      top: 5,
                      right: 30,
                      left: isMobile ? -10 : 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(unixTime) =>
                        new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          year: "2-digit",
                        }).format(new Date(unixTime))
                      }
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      fontSize={10}
                      tickMargin={6}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(0)}%`}
                      domain={[yMinUW, 0]}
                      fontSize={10}
                    />
                    <Tooltip
                      labelFormatter={(l) =>
                        new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(new Date(l))
                      }
                      formatter={(value: number) => [
                        `${value.toFixed(2)}%`,
                        undefined,
                      ]}
                    />
                    <Legend />
                    {/* Dashed Reference Line at 0% */}
                    <Line
                      type="monotone"
                      dataKey={() => 0}
                      stroke="#666"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      dot={false}
                      isAnimationActive={false}
                    />
                    {/* Area Plots */}
                    {underwaterKeys.map((key) => {
                      // Default to red/negative colors for underwater plot if not specified
                      const strokeColor =
                        key === "PORTFOLIO"
                          ? "#ef4444" // red-500
                          : key === "NIFTY500"
                            ? "#gray-500" // gray
                            : colors?.[key] || "#ef4444";

                      return (
                        <Area
                          key={key}
                          type="stepAfter"
                          dataKey={key}
                          stroke={strokeColor}
                          fill={strokeColor}
                          fillOpacity={0.1}
                          strokeWidth={2}
                          dot={false}
                        />
                      );
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Description */}
          {description && (
            <div className="border-t border-gray-200 p-3">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
