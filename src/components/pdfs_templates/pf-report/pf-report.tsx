"use client";
import { MarkdownText } from "@/components/thread/markdown-text";
import {
  Section,
  PfAnalysis,
  PFFinSharpeAnalysisData,
  ChartData,
  DrawdownChartData,
} from "@/types/pf-analysis";
import PfWelcome from "./PfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";
import {
  chunkArray,
  formatKey,
  getPortfolioDisplayTable,
} from "@/lib/format-utils";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import DrawdownChart from "@/components/thread/messages/client-components/DrawdownChart";
import LineChart from "@/components/thread/messages/client-components/LineChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import PageLayout from "../layout/PageLayout";
import TotalPageCtxProvider from "../stock-report/TotalPageCtx";
import IntroPageContainer from "../layout/IntroPageContainer";
import ScoreCard from "../layout/ScoreCard";
import ChartContainer from "../layout/ChartContainer";
import BulbIcon from "@/components/icons/BulbIcon";
import Actionables from "../layout/Actionables";
import Summary from "../layout/Summary/Summary";

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

export const MAX_ROWS_PER_PAGE = 17;

export default function PfAnalysisReportMessageComponent({
  analysis,
  selectedSections,
  personalComment,
}: {
  analysis: PfAnalysis;
  selectedSections?: string[];
  personalComment?: string;
}) {
  const { data } = analysis;
  const returnsChart = data.returns_chart as ChartData | null | undefined;
  const drawdownChart = data.drawdown_chart as
    | DrawdownChartData
    | null
    | undefined;

  // Helper function to check if a section should be rendered
  const shouldRenderSection = (sectionKey: string) => {
    // If no selectedSections provided, render all sections
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  const portfolio = analysis.portfolio || [];
  const pfItemsArr = chunkArray(portfolio, MAX_ROWS_PER_PAGE);

  return (
    <TotalPageCtxProvider value={9}>
      <PfWelcome analysis={analysis} />
      <IntroPageContainer>
        <ScoreCard
          label="Overall score"
          data={data.finsharpe_analysis?.overall_score_chart_data || []}
          desc={
            data.finsharpe_analysis?.overall_score_summary ||
            "Overall score is a comprehensive metric that evaluates the overall health and performance of your portfolio based on various factors such as returns, risk, diversification, and other key indicators. A higher overall score indicates a stronger portfolio, while a lower score may suggest areas for improvement."
          }
        />
        <ScoreCard
          label="Risk score"
          data={data.finsharpe_analysis?.risk_score_chart_data || []}
          desc={
            data.finsharpe_analysis?.risk_score_summary ||
            "Risk score is a measure of the portfolio's exposure to potential losses. A lower risk score indicates a more conservative portfolio with less volatility, while a higher risk score suggests a more aggressive portfolio with higher potential returns but also higher risk."
          }
        />
      </IntroPageContainer>
      {/* FinSharpe Analysis (if present) */}
      {shouldRenderSection("finsharpe_analysis") && data.finsharpe_analysis && (
        <>
          <AllocationsPage data={data.finsharpe_analysis} />
          <FinSharpeAnalysisSection data={data.finsharpe_analysis} />
        </>
      )}

      {/* Performance Analysis */}
      {shouldRenderSection("performance_analysis") && (
        <PageLayout pgNo={1}>
          <div
            className="max-w-3xl space-y-8"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <div className="break-inside-avoid">
              <FormatSection section={data.performance_analysis} />
              {returnsChart && (
                <div className="mt-6">
                  <LineChart
                    data={returnsChart.data}
                    colors={returnsChart.colors}
                    title={returnsChart.title}
                    description={returnsChart.description}
                  />
                </div>
              )}
            </div>
          </div>
        </PageLayout>
      )}

      <Actionables pgNo={1} />

      {/* Summary */}
      {shouldRenderSection("summary") && (
        <Summary
          summary={data.summary?.content}
          pgNo={1}
        />
      )}

      {/* Recommendation */}
      {shouldRenderSection("recommendation") && (
        <PageLayout pgNo={1}>
          <FormatSection section={data.recommendation} />
        </PageLayout>
      )}

      {/* Portfolio Overview */}
      {shouldRenderSection("portfolio_overview") &&
        pfItemsArr.map((chunk, idx) => (
          <PageLayout
            pgNo={1}
            key={`portfolio-overview-${idx}`}
          >
            <PortfolioOverviewSection
              section={data.portfolio_overview}
              portfolio={chunk}
              isFirstChunk={idx === 0}
            />
          </PageLayout>
        ))}

      {/* 3. Risk Assessment */}
      {shouldRenderSection("risk_assessment") && (
        <PageLayout pgNo={1}>
          <FormatSection section={data.risk_assessment} />
        </PageLayout>
      )}
      {/* 4. Risk-Adjusted Returns */}
      {shouldRenderSection("risk_adjusted_returns") && (
        <PageLayout pgNo={1}>
          <FormatSection section={data.risk_adjusted_returns} />
        </PageLayout>
      )}
      {/* 5. Drawdown Analysis */}
      {shouldRenderSection("drawdown_analysis") && (
        <div className="break-inside-avoid">
          <PageLayout pgNo={1}>
            <FormatSection section={data.drawdown_analysis} />
          </PageLayout>
          <PageLayout pgNo={1}>
            {drawdownChart && (
              <div className="mt-6">
                <DrawdownChart
                  data={drawdownChart}
                  returnsData={returnsChart?.data}
                />
              </div>
            )}
          </PageLayout>
        </div>
      )}
      {/* Correlation Analysis */}
      {shouldRenderSection("correlation_analysis") && (
        <PageLayout pgNo={1}>
          <FormatSection section={data.correlation_analysis} />
        </PageLayout>
      )}

      {/* Personal Comment Section */}
      {personalComment && (
        <PageLayout pgNo={1}>
          <div className="mt-8" />
          <hr className="border-t-2 border-gray-800" />
          <div className="mt-8" />
          <div className="space-y-4">
            <h3 className="text-3xl font-semibold tracking-tight">
              Personal Comment
            </h3>
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {personalComment}
              </p>
            </div>
          </div>
        </PageLayout>
      )}

      <div
        className="mx-12 max-w-3xl space-y-8 pt-12"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <h3 className="text-3xl font-semibold tracking-tight">
          Data Sources and In-depth Analysis
        </h3>
        <span className="report-compact-table">
          {[
            {
              section: {
                ...data.portfolio_overview,
                sources: convertToMarkdownTable(analysis.portfolio || []),
              },
              key: "portfolio_overview",
            },
            { section: data.performance_analysis, key: "performance_analysis" },
            { section: data.risk_assessment, key: "risk_assessment" },
            {
              section: data.risk_adjusted_returns,
              key: "risk_adjusted_returns",
            },
            { section: data.drawdown_analysis, key: "drawdown_analysis" },
            { section: data.correlation_analysis, key: "correlation_analysis" },
            ...(data.finsharpe_analysis
              ? [
                  {
                    section: data.finsharpe_analysis.analysis,
                    key: "finsharpe_analysis",
                  },
                ]
              : []),
            { section: data.summary, key: "summary" },
            { section: data.recommendation, key: "recommendation" },
          ]
            .filter(({ key, section }) => section && shouldRenderSection(key))
            .map(({ section, key }, idx, arr) => (
              <div key={key}>
                <FormatSectionSourcesAndInDepthAnalysis section={section} />
                {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
              </div>
            ))}
        </span>
      </div>
    </TotalPageCtxProvider>
  );
}

function FormatSectionSourcesAndInDepthAnalysis({
  section,
}: {
  section: Section;
}) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const anchorId = formatter.getAnchorId();
  const in_depth_analysis = section.in_depth_analysis;
  const sources = section.sources;
  const sourcesMarkdown = formatter.getSource();

  if (!in_depth_analysis && !sources) {
    return null;
  }

  return (
    <div
      id={`refs-${anchorId}`}
      className="space-y-2 text-sm"
    >
      <h6>
        <a
          className="text-primary font-medium underline underline-offset-4"
          href={`#${anchorId}`}
        >
          {section.title}
        </a>
      </h6>
      {in_depth_analysis && (
        <MarkdownText>{`<details open><summary>In-depth Analysis</summary>\n\n${in_depth_analysis}\n</details>\n`}</MarkdownText>
      )}
      {sourcesMarkdown && (
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${splitMarkdownTables(sourcesMarkdown)}\n</details>\n`}</MarkdownText>
      )}
      {sources && typeof sources === "object" && !Array.isArray(sources) && (
        <SourcesDisplay sources={sources} />
      )}
    </div>
  );
}

function PortfolioOverviewSection({
  section,
  portfolio,
  isFirstChunk,
}: {
  section: Section;
  portfolio?: Record<string, any>[];
  isFirstChunk?: boolean;
}) {
  if (!section) {
    return null;
  }

  const portfolioTable = getPortfolioDisplayTable(portfolio);

  // First chunk: show section content + table; subsequent chunks: table only
  const content = portfolioTable || "";

  const _section: Section = {
    title: isFirstChunk ? section.title : "",
    content,
    sources: isFirstChunk ? convertToMarkdownTable(portfolio || []) : undefined,
  };

  return <FormatSection section={_section} />;
}

function FormatSection({ section }: { section: Section }) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}`;
  const anchorId = formatter.getAnchorId();
  const hasRefs = Boolean(section.in_depth_analysis || section.sources);

  return (
    <div className="space-y-4">
      <div id={anchorId} />
      <MarkdownText>{title}</MarkdownText>
      {hasRefs && (
        <div className="text-xs">
          <a
            className="text-primary font-medium underline underline-offset-4"
            href={`#refs-${anchorId}`}
          >
            Sources & In-depth Analysis
          </a>
        </div>
      )}
      <MarkdownText>{content}</MarkdownText>
    </div>
  );
}

function SourcesDisplay({ sources }: { sources: Record<string, any> }) {
  return (
    <details
      open
      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
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

  // If it's an object, render as a table or nested structure
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

  return (
    <PageLayout pgNo={1}>
      {/* Main Analysis Section */}
      <FormatSection section={data.analysis} />
    </PageLayout>
  );
}

function AllocationsPage({ data }: { data: PFFinSharpeAnalysisData }) {
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
    <PageLayout pgNo={1}>
      {/* Score Charts Grid */}
      <div className="space-y-6">
        {/* Industry Distribution */}
        {industryWithColors.length > 0 && (
          <ChartContainer
            Icon={BulbIcon}
            containerClasses="mt-4"
            desc={
              data.industry_allocation_summary ||
              "Industry allocation shows how your investments are distributed across different sectors. A well-diversified portfolio typically has allocations spread across multiple industries, which can help reduce risk and improve potential returns over time."
            }
            context="Having a well-diversified portfolio across industries helps mitigates concentration risk, i.e., the potential for loss when a group of securities move in an unfavorable direction."
          >
            <div className="p-4">
              <h4 className="mb-4 text-center font-medium text-gray-900">
                Industry Wise Allocation
              </h4>
              <div className="flex items-center gap-4">
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
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2">
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
                        {industry.value.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ChartContainer>
        )}
        {/* Size Distribution */}
        {sizeWithColors.length > 0 && (
          <ChartContainer
            Icon={BulbIcon}
            containerClasses="mt-4"
            desc={
              data.market_cap_allocation_summary ||
              "Market cap allocation shows how your investments are distributed across companies of different sizes (large-cap, mid-cap, small-cap). A balanced allocation across market caps can help optimize growth potential while managing risk."
            }
            context="Large-cap stocks are typically more stable but may offer lower growth, while small-cap stocks can offer higher growth potential but with increased volatility. A diversified allocation across market caps can help balance risk and return in your portfolio."
          >
            <div className="p-4">
              <h4 className="mb-4 text-center font-medium text-gray-900">
                Market Cap Allocation
              </h4>
              <div className="space-y-3">
                {sizeWithColors.map((size, index) => (
                  <div key={index}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{size.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {size.value.toFixed(2)}%
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
          </ChartContainer>
        )}
      </div>
    </PageLayout>
  );
}
