"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  disableAnimation?: boolean;
};

export default function DrawdownChart({ data, returnsData, className, disableAnimation }: Props) {
  const isMobile = useIsMobile();
  const { underwater_plot, worst_periods = [], colors, description } = data;

  // 1. Top Chart Data (Returns)
  const returnsKeys = Object.keys(returnsData?.[0] || {}).filter(
    (k) => k !== "date",
  );

  // 2. Bottom Chart Data (Underwater)
  const underwaterKeys = Object.keys(underwater_plot?.[0] || {}).filter(
    (k) => k !== "date",
  );
  // Calculate nice Y-axis domain for underwater plot
  const uwMin = (underwater_plot || []).reduce((min, d) => {
    for (const k of underwaterKeys) {
      const v = Number(d[k]) || 0;
      if (v < min) min = v;
    }
    return min;
  }, 0);
  const yMinUW = Math.floor(uwMin); // e.g. -5.29 → -6

  const Wrapper = disableAnimation ? "div" : motion.div;
  const wrapperProps = disableAnimation
    ? {}
    : { initial: false, animate: { height: "auto" }, transition: { duration: 0.3 } };

  return (
    <Wrapper
      className="bg-gray-100"
      {...wrapperProps}
    >
      <div className="flex flex-col gap-2 p-4">
        {/* Chart 1: Strategy - Worst 5 Drawdown Periods */}
        <div className="space-y-2">
          <div className="h-56 w-full rounded-md border border-gray-200 bg-white p-2">
            <h4 className="text-center text-sm font-semibold text-gray-700">
              Strategy - Worst 5 Drawdown Periods
            </h4>
            <ResponsiveContainer
              width="100%"
              height="90%"
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
                    isAnimationActive={!disableAnimation}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Underwater Plot */}
        <div className="space-y-2">
          <div className="h-56 w-full rounded-md border border-gray-200 bg-white p-2">
            <h4 className="text-center text-sm font-semibold text-gray-700">
              Underwater Plot
            </h4>
            <ResponsiveContainer
              width="100%"
              height="90%"
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
                        ? "#6b7280" // gray-500
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
                      isAnimationActive={!disableAnimation}
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
    </Wrapper>
  );
}
