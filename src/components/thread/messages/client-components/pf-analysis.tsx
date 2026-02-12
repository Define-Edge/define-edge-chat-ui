"use client";

import { Button } from "@/components/ui/button";
import { formatKey, getPortfolioDisplayTable } from "@/lib/format-utils";
import {
  PfAnalysis,
  Section,
  PFFinSharpeAnalysisData,
  ChartData,
  DrawdownChartData,
} from "@/types/pf-analysis";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { MarkdownText } from "../../markdown-text";
import { PfAnalysisDownloadDialog } from "./pf-analysis-download-dialog";
import LineChart from "./LineChart";
import DrawdownChart from "./DrawdownChart";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";

// Color palette for pie charts (same as OverviewTab)
const PIE_COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#6366F1",
  "#14B8A6",
  "#F97316",
];

// Color palette for size distribution bars
const SIZE_COLORS: Record<string, string> = {
  Large: "#4F46E5",
  Mid: "#06B6D4",
  Small: "#8B5CF6",
};

export default function PfAnalysisComponent(analysis: PfAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const returnsChart = data.returns_chart as ChartData | null | undefined;
  const drawdownChart = data.drawdown_chart as
    | DrawdownChartData
    | null
    | undefined;
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef}>
      {/* 1. Portfolio Overview */}
      <PortfolioOverviewSection
        section={data.portfolio_overview}
        portfolio={analysis.portfolio}
      />

      {/* 2. Performance Analysis + Returns Chart */}
      <FormatSection section={data.performance_analysis} />
      {returnsChart && (
        <div className="my-4">
          <LineChart
            data={returnsChart.data}
            colors={returnsChart.colors}
            title={returnsChart.title}
            description={returnsChart.description}
          />
        </div>
      )}

      {/* 3. Risk Assessment */}
      <FormatSection section={data.risk_assessment} />

      {/* 4. Risk-Adjusted Returns */}
      <FormatSection section={data.risk_adjusted_returns} />

      {/* 5. Drawdown Analysis + Drawdown Chart */}
      <FormatSection section={data.drawdown_analysis} />
      {drawdownChart && (
        <div className="my-4">
          <div className="mx-auto grid min-w-[calc(100dvw-2rem)] grid-rows-[auto] gap-6 md:min-w-3xl">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                <h3 className="font-medium text-gray-900">
                  {drawdownChart.title}
                </h3>
              </div>
              <DrawdownChart
                data={drawdownChart}
                returnsData={returnsChart?.data}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Correlation Analysis */}
      <FormatSection section={data.correlation_analysis} />

      {/* 7. FinSharpe Analysis (if present - stock portfolios only) */}
      {data.finsharpe_analysis && (
        <FinSharpeAnalysisSection data={data.finsharpe_analysis} />
      )}

      {/* 8. Summary */}
      <FormatSection section={data.summary} />

      {/* 9. Recommendation */}
      <FormatSection section={data.recommendation} />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() =>
            topRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Back to Top
        </Button>
        <PfAnalysisDownloadDialog
          threadId={threadId}
          analysisId={analysis.id}
          portfolioName={analysis.portfolio_name}
        />
      </div>
    </div>
  );
}

function PortfolioOverviewSection({
  section,
  portfolio,
}: {
  section: Section;
  portfolio?: Record<string, any>[];
}) {
  if (!section) {
    return null;
  }

  const portfolioTable = getPortfolioDisplayTable(portfolio);

  const content = `${section.content}\n\n${portfolioTable ? `\n${portfolioTable}\n` : ""}`;

  const _section: Section = {
    title: section.title,
    content: content,
    sources: convertToMarkdownTable(portfolio || []),
  };

  return <FormatSection section={_section} />;
}

function FormatSection({ section }: { section: Section }) {
  if (!section) {
    return null;
  }

  const title = `## ${section.title}\n`;
  const content = `${section.content}\n`;
  const in_depth_analysis = section.in_depth_analysis
    ? `<details><summary>In-depth Analysis</summary>\n\n${section.in_depth_analysis}\n</details>\n`
    : "";

  const sources = formatSources(section.sources);

  const markdown = `${title}${content}${in_depth_analysis}${sources}\n---\n`;

  return (
    <div>
      <MarkdownText>{markdown}</MarkdownText>
      {section.sources &&
        typeof section.sources === "object" &&
        !Array.isArray(section.sources) && (
          <JsonSourcesDisplay sources={section.sources} />
        )}
    </div>
  );
}

function formatSources(
  sources: string | string[] | Record<string, any> | null | undefined,
): string {
  if (!sources) {
    return "";
  }

  // If sources is a string, wrap it in details
  if (typeof sources === "string") {
    return `<details><summary>Sources</summary>\n\n${sources}\n</details>\n`;
  }

  // If sources is an array of strings (URLs)
  if (Array.isArray(sources)) {
    const domainPattern = /https?:\/\/(?:www\.)?([^/]+)/;
    const sourcesMarkdown = sources
      .map((source) => {
        const match = source.match(domainPattern);
        const domain = match ? match[1] : source;
        return `[${domain}](${source}) ,`;
      })
      .join("\n");

    if (sources.length > 0) {
      return `<details><summary>Sources</summary>\n\n${sourcesMarkdown}\n</details>\n`;
    }
  }

  // If sources is an object (JSON), it will be rendered separately
  return "";
}

function JsonSourcesDisplay({ sources }: { sources: Record<string, any> }) {
  return (
    <details className="mb-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100">
        Sources (Data)
      </summary>
      <div className="mt-4 space-y-4">
        {Object.entries(sources).map(([key, value]) => (
          <div
            key={key}
            className="space-y-2"
          >
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
              {formatKey(key)}
            </h4>
            <JsonDataDisplay data={value} />
          </div>
        ))}
      </div>
    </details>
  );
}

function JsonDataDisplay({ data }: { data: any }) {
  if (data === null || data === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }

  // If it's a primitive value
  if (typeof data !== "object") {
    return (
      <span className="text-gray-700 dark:text-gray-300">{String(data)}</span>
    );
  }

  // If it's an array
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500">Empty</span>;
    }
    return (
      <ul className="list-inside list-disc space-y-1 text-sm">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="text-gray-700 dark:text-gray-300"
          >
            <JsonDataDisplay data={item} />
          </li>
        ))}
      </ul>
    );
  }

  // If it's an object, render as a table
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <span className="text-gray-500">Empty object</span>;
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {entries.map(([key, value]) => (
            <tr
              key={key}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                {formatKey(key)}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {typeof value === "object" ? (
                  <JsonDataDisplay data={value} />
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FinSharpe Analysis Section Component
function FinSharpeAnalysisSection({ data }: { data: PFFinSharpeAnalysisData }) {
  if (!data) {
    return null;
  }

  // Cast distribution items to typed arrays with colors
  const industryWithColors = (data.industry_distribution || []).map(
    (item: any, index: number) => ({
      name: item.name as string,
      value: item.value as number,
      color: PIE_COLORS[index % PIE_COLORS.length],
    }),
  );

  const sizeWithColors = (data.size_distribution || []).map((item: any) => ({
    name: item.name as string,
    value: item.value as number,
    color: SIZE_COLORS[item.name as string] || PIE_COLORS[0],
  }));

  return (
    <div className="my-6">
      {/* Main Analysis Section */}
      <FormatSection section={data.analysis} />

      {/* Score Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Score Chart */}
        {data.overall_score_chart_data &&
          data.overall_score_chart_data.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">
                Overall Score
              </h4>
              <div className="relative h-[28vh] w-full sm:h-[50vh]">
                <OverallScorePie
                  data={data.overall_score_chart_data as any}
                  shouldRenderActiveShapeLabel={true}
                />
              </div>
            </div>
          )}

        {/* Risk Score Chart */}
        {data.risk_score_chart_data &&
          data.risk_score_chart_data.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">
                Risk Score
              </h4>
              <div className="relative h-[28vh] w-full sm:h-[50vh]">
                <RiskScorePie
                  data={data.risk_score_chart_data as any}
                  shouldRenderActiveShapeLabel={true}
                />
              </div>
            </div>
          )}
      </div>

      {/* Distribution Charts Grid */}
      <div className="mt-6 grid gap-6">
        {/* Industry Distribution */}
        {industryWithColors.length > 0 && (
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-4 font-medium text-gray-900">
              Industry Allocation
            </h4>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="h-48 flex-shrink-0 md:w-48">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={industryWithColors}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {industryWithColors.map((entry, index) => (
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
              <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
                {industryWithColors.map((industry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: industry.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {industry.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Number(industry.value).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Size Distribution */}
        {sizeWithColors.length > 0 && (
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-4 font-medium text-gray-900">
              Market Cap Allocation
            </h4>
            <div className="space-y-3">
              {sizeWithColors.map((size, index) => (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">{size.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Number(size.value).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${size.value}%`,
                        backgroundColor: size.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
