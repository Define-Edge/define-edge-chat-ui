"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  CartesianGrid,
  LegendProps,
  Line,
  LineChart as ReChartsLineChartComp,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon } from "lucide-react";
import { MarkdownText } from "../../markdown-text";

type Props = {
  data?: any;
  args?: any;
  tool_call_id?: string;
  analysis?: Record<string, any> | string;
  report?: any;
  labels_colors_map?: Record<string, string>;
};

const MetricPill = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] leading-none text-gray-700">
      <span className="opacity-70">{icon}</span>
      <span className="text-gray-500">{label}:</span>
      <span className="font-mono text-gray-900">{value}</span>
    </div>
  );
};

function formatINR(value: number): string {
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

const ChartTooltip = ({
  payload,
  active,
  label,
  labels_colors_map,
}: React.ComponentProps<typeof Tooltip> & {
  labels_colors_map: Record<string, string>;
}) => {
  return (
    <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      {label
        ? `Date: ${new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(label))}`
        : null}
      <div className="grid gap-1.5">
        {payload?.map((item) => {
          if (item.dataKey?.toString()?.includes?.("Simulation")) return null;
          return (
            <div
              key={item.dataKey}
              className="[&>svg]:text-muted-foreground flex w-full flex-wrap items-center gap-1 [&>svg]:h-2.5 [&>svg]:w-2.5"
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)"
                style={
                  {
                    "--color-bg":
                      labels_colors_map?.[item?.dataKey || ""] || "lightgray",
                    "--color-border":
                      labels_colors_map?.[item?.dataKey || ""] || "lightgray",
                  } as React.CSSProperties
                }
              />
              <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                <span className="text-muted-foreground">{item.name}</span>

                {item.value && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    ₹{Number(item.value)?.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CustomizedLegend = ({
  payload,
  verticalAlign,
  onItemEnter,
  onItemLeave,
}: Pick<LegendProps, "payload" | "verticalAlign"> & {
  onItemEnter?: (key: string) => void;
  onItemLeave?: () => void;
}) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="grid w-max grid-cols-2 gap-1 text-xs">
      {payload.map((item) => {
        const key = item.dataKey as string;

        if (key.includes("Simulation")) return null;

        return (
          <div
            key={item.value}
            className={cn(
              "[&>svg]:text-muted-foreground group/legend flex cursor-pointer items-center gap-1 rounded-sm hover:bg-(--legend-color-bg) hover:p-0.5 hover:px-2 hover:text-white [&>svg]:h-3 [&>svg]:w-3",
            )}
            style={{ "--legend-color-bg": item.color } as React.CSSProperties}
            onMouseEnter={() => onItemEnter?.(key)}
            onMouseLeave={() => onItemLeave?.()}
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px] group-hover/legend:hidden"
              style={{
                backgroundColor: item.color,
              }}
            />
            {item.value}
          </div>
        );
      })}
    </div>
  );
};

const SimulationChart = React.memo(
  function SimulationChart({
    data,
    args,
    analysis,
    labels_colors_map,
    report,
  }: Props) {
    const isMobile = useIsMobile();
    const [hoveredLegendKey, setHoveredLegendKey] = React.useState<
      string | null
    >(null);
    return (
      <div className="mx-auto grid min-w-[calc(100dvw-2rem)] grid-rows-[1fr_auto] gap-2 md:min-w-3xl">
        <div className="overflow-hidden rounded-lg border border-gray-100">
          {/* Title */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="font-medium text-gray-900">
              Monte Carlo Simulation
            </h3>
          </div>
          {/* Metrics Bar (outside chart) */}
          {args && (
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] leading-none text-gray-600">
                Parameters
              </div>
              {typeof args.yearly_expected_return === "number" && (
                <MetricPill
                  icon={"μ"}
                  label="Exp. Return"
                  value={`${(args.yearly_expected_return * 100).toFixed(2)}%`}
                />
              )}
              {typeof args.yearly_std_dev === "number" && (
                <MetricPill
                  icon={"σ"}
                  label="Std Dev"
                  value={`${(args.yearly_std_dev * 100).toFixed(2)}%`}
                />
              )}
              {args.portfolio ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] leading-none text-blue-700 transition-colors hover:bg-blue-100">
                      <span className="opacity-70">📊</span>
                      <span className="text-blue-500">Portfolio:</span>
                      <span className="font-mono text-blue-900">
                        {args.portfolio.items?.length || 0}{" "}
                        {args.pf_type === "mutual_fund" ? "Funds" : "Stocks"}
                      </span>
                      <span className="text-blue-400">→</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span>📊</span>
                        Portfolio Details
                        {args?.pf_type && (
                          <span className="text-sm font-normal text-gray-500">
                            (
                            {args.pf_type === "mutual_fund"
                              ? "Mutual Funds"
                              : "Stocks"}
                            )
                          </span>
                        )}
                      </DialogTitle>
                      <DialogDescription>
                        {args?.portfolio?.items?.length || 0}{" "}
                        {args?.pf_type === "mutual_fund" ? "funds" : "stocks"}{" "}
                        in this portfolio
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                      {/* Portfolio Metadata */}
                      {args?.portfolio && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {args.portfolio.start_date && (
                              <div>
                                <span className="text-gray-500">
                                  Start Date:
                                </span>
                                <span className="ml-2 font-mono text-gray-900">
                                  {new Intl.DateTimeFormat("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).format(
                                    new Date(args.portfolio.start_date),
                                  )}
                                </span>
                              </div>
                            )}
                            {args.portfolio.end_date && (
                              <div>
                                <span className="text-gray-500">End Date:</span>
                                <span className="ml-2 font-mono text-gray-900">
                                  {new Intl.DateTimeFormat("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).format(new Date(args.portfolio.end_date))}
                                </span>
                              </div>
                            )}
                            {args.portfolio.duration && (
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-2 font-mono text-gray-900">
                                  {args.portfolio.duration}
                                </span>
                              </div>
                            )}
                            {args.portfolio.input_unit && (
                              <div>
                                <span className="text-gray-500">
                                  Input Unit:
                                </span>
                                <span className="ml-2 font-mono text-gray-900 capitalize">
                                  {args.portfolio.input_unit}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Portfolio Items */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Holdings
                        </h4>
                        <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-gray-200">
                          <div className="divide-y divide-gray-200">
                            {args?.portfolio?.items?.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white p-3 hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <div className="font-mono font-medium text-gray-900">
                                        {item.symbol}
                                      </div>
                                      {item.quantity !== null &&
                                        item.quantity !== undefined && (
                                          <div className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  {item.weight !== null &&
                                    item.weight !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <div className="text-right">
                                          <div className="font-mono text-lg font-semibold text-gray-900">
                                            {item.weight}%
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Weight
                                          </div>
                                        </div>
                                        <div className="h-12 w-2 overflow-hidden rounded-full bg-gray-200">
                                          <div
                                            className="h-full bg-blue-500 transition-all"
                                            style={{
                                              height: `${item.weight}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total Weight Check */}
                      {args?.portfolio?.input_unit === "weight" && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Weight:</span>
                            <span className="font-mono font-semibold text-gray-900">
                              {args.portfolio.items
                                ?.reduce(
                                  (sum: number, item: any) =>
                                    sum + (item.weight || 0),
                                  0,
                                )
                                .toFixed(2)}
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : args.symbol ? (
                <MetricPill
                  icon={"🏷"}
                  label="Symbol"
                  value={args.symbol}
                />
              ) : null}
              {typeof args.initial_investment === "number" && (
                <MetricPill
                  icon={"₹"}
                  label={args.symbol ? "Starting Price" : "Initial Investment"}
                  value={`₹${Number(args.initial_investment).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    },
                  )}`}
                />
              )}
              {typeof args.simulations !== "undefined" && (
                <MetricPill
                  icon={"⚙"}
                  label="Sims"
                  value={String(args.simulations)}
                />
              )}
              {typeof args.duration_years !== "undefined" && (
                <MetricPill
                  icon={"🗓"}
                  label="Years"
                  value={String(args.duration_years)}
                />
              )}
              {/* {typeof args.trading_days_per_year !== "undefined" && (
                <MetricPill
                  icon={"📅"}
                  label="Days/yr"
                  value={String(args.trading_days_per_year)}
                />
              )} */}
            </div>
          )}
          {/* Chart */}
          <motion.div
            className="bg-gray-50"
            initial={false}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative p-3">
              {/* Custom positioned legend */}
              <div className="absolute top-5 left-24 z-10">
                <CustomizedLegend
                  payload={
                    Array.isArray(data) && data.length > 0
                      ? Object.keys(data[0])
                          .filter((k) => k !== "date")
                          .map((key) => ({
                            value: key,
                            dataKey: key,
                            color: labels_colors_map?.[key] || "lightgray",
                            type: "line",
                          }))
                      : []
                  }
                  verticalAlign="top"
                  onItemEnter={(key) => setHoveredLegendKey(key)}
                  onItemLeave={() => setHoveredLegendKey(null)}
                />
              </div>

              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <ReChartsLineChartComp
                    data={data}
                    margin={{
                      top: 5,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? -15 : 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(0)}`}
                      domain={["dataMin", "dataMax"]}
                      unit="₹"
                      fontSize={isMobile ? 10 : 12}
                    />
                    <XAxis
                      dataKey="date"
                      domain={["dataMin", "dataMax"]}
                      name="Time"
                      tickFormatter={(unixTime) =>
                        new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          year: "2-digit",
                        }).format(new Date(unixTime))
                      }
                      type="number"
                      tickMargin={6}
                      tickSize={12}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <Tooltip
                      content={(props) => (
                        <ChartTooltip
                          {...props}
                          labels_colors_map={labels_colors_map || {}}
                        />
                      )}
                    />
                    {Array.isArray(data) &&
                      data.length > 0 &&
                      typeof data[0] === "object" &&
                      Object.keys(data[0])
                        .filter((k) => k !== "date")
                        .map((key) => {
                          const isDimmed =
                            hoveredLegendKey !== null &&
                            key !== hoveredLegendKey;
                          const strokeOpacity = isDimmed
                            ? 0.2
                            : labels_colors_map?.[key]
                              ? 1
                              : 0.8;
                          const color = labels_colors_map?.[key] || "lightgray";

                          let strokeWidth = 2;
                          if (key.includes("Simulation")) {
                            strokeWidth = 1;
                          }

                          let strokeDasharray = "";
                          if (key === "Mean") {
                            strokeWidth = 4;

                            strokeDasharray = "5 5";
                          }

                          const effectiveStrokeWidth =
                            hoveredLegendKey !== null &&
                            key === hoveredLegendKey
                              ? strokeWidth + 2
                              : strokeWidth;

                          return (
                            <Line
                              key={key}
                              type="linear"
                              dot={false}
                              dataKey={key}
                              strokeOpacity={strokeOpacity}
                              stroke={color}
                              strokeWidth={effectiveStrokeWidth}
                              activeDot={false}
                              strokeDasharray={strokeDasharray}
                            />
                          );
                        })}
                  </ReChartsLineChartComp>
                </ResponsiveContainer>
              </AnimatePresence>
            </div>
            {/* Analysis */}
            {analysis && typeof analysis === "string" && (
              <div className="markdown-content">
                <details
                  className="!m-0 rounded-lg border border-gray-200 bg-gray-50"
                  open
                >
                  <summary className="flex cursor-pointer items-center font-medium hover:bg-gray-100">
                    <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
                    Analysis
                  </summary>
                  <div className="p-3">
                    <MarkdownText>{analysis}</MarkdownText>
                  </div>
                </details>
              </div>
            )}
          </motion.div>
          {/* Report Summary (outside chart) */}
          {report && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] leading-none text-gray-600">
                Report
              </div>
              {[
                "Best Final",
                "Worst Final",
                "Median",
                "90th Percentile",
                "75th Percentile",
                "25th Percentile",
                "10th Percentile",
              ].map((key) =>
                report[key] !== undefined ? (
                  <MetricPill
                    key={key}
                    icon={
                      key === "Best Final"
                        ? "🏆"
                        : key === "Worst Final"
                          ? "⚠"
                          : key === "Median"
                            ? "⎯"
                            : key === "90th Percentile"
                              ? "P90"
                              : key === "75th Percentile"
                                ? "P75"
                                : key === "25th Percentile"
                                  ? "P25"
                                  : "P10"
                    }
                    label={key}
                    value={formatINR(report[key] as number)}
                  />
                ) : null,
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.tool_call_id === nextProps.tool_call_id;
  },
);

export default SimulationChart;
