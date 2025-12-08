"use client";
import { MarkdownText } from "@/components/thread/markdown-text";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AnimatePresence, motion } from "framer-motion";
import { capitalize, startCase } from "lodash";
import { ChevronRightIcon } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReChartsLineChartComp,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data?: any[];
  colors?: {
    [key: string]: string;
  };
  title?: string;
  description?: string;
  analysis?: string;
};

export default function LineChart({
  data,
  colors,
  title,
  description,
  analysis,
}: Props) {
  const isMobile = useIsMobile();
  return (
    <div className="mx-auto grid min-w-[calc(100dvw-2rem)] grid-rows-[1fr_auto] gap-2 md:min-w-3xl">
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
          <div className="p-3">
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
                    right: 30,
                    left: isMobile ? -10 : 30,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                    domain={["dataMin", "dataMax"]}
                    unit="%"
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
                    fontSize={isMobile ? 10 : 12}
                    tickMargin={6}
                    tickSize={12}
                  />
                  <Tooltip
                    labelFormatter={(l) =>
                      `Date: ${new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(l))}`
                    }
                    formatter={(value, name, props) => {
                      let v =
                        typeof value === "number"
                          ? `${value.toFixed(2)} %`
                          : value;
                      let n = "";
                      if (value) {
                        n = capitalize(startCase(`${name}`));
                        if (Array.isArray(value)) {
                          if (!value.some((e) => e !== null)) return [];
                          else v = value.join(" ~ ");
                        }
                      }

                      return [v, n];
                    }}
                  />
                  <Legend />
                  {Object.keys(data?.[0] || {})
                    .filter((k) => k !== "date")
                    .map((key, index) => {
                      return (
                        <Line
                          key={key}
                          type="linear"
                          dot={false}
                          dataKey={key}
                          stroke={colors?.[key] || "#035BFF"}
                          strokeWidth={2}
                        />
                      );
                    })}
                </ReChartsLineChartComp>
              </ResponsiveContainer>
            </AnimatePresence>
          </div>
          {/* Description */}
          {description && (
            <div className="border-t border-gray-200 p-3">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          )}
          {/* Analysis */}
          {analysis && (
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
      </div>
    </div>
  );
}
