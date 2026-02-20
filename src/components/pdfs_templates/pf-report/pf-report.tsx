"use client";
import type { ScreenerCoverage } from "@/api/generated/report-apis/models";
import BulbIcon from "@/components/icons/BulbIcon";
import CompassIcon from "@/components/icons/CompassIcon";
import DrawdownIcon from "@/components/icons/DrawdownIcon";
import { MarkdownText } from "@/components/thread/markdown-text";
import DataTable from "@/components/ui/data-table/DataTable";
import {
  chunkArray,
  formatKey,
  getPortfolioDisplayTable,
} from "@/lib/format-utils";
import groupSmallFragments, { shuffleArray } from "@/lib/groupSmallFragments";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { SectionFormatter } from "@/lib/section-formatter";
import type {
  ChartData,
  CorrelationHeatmapRow,
  DrawdownChartData,
  MonthlyReturnsHeatmapData,
  PfAnalysis,
  PFFinSharpeAnalysisData,
  Section,
} from "@/types/pf-analysis";
import dynamic from "next/dynamic";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartContainer from "../layout/ChartContainer";
import Disclaimer from "../layout/Disclaimer";
import FinancialFitness from "../layout/FinancialFitness";
import InsightContainer from "../layout/InsightContainer";
import IntroPageContainer from "../layout/IntroPageContainer";
import PageLayout from "../layout/PageLayout";
import SectionDivider from "../layout/SectionDivider";
import Summary from "../layout/Summary/Summary";
import TotalPageCtxProvider from "../stock-report/TotalPageCtx";
import CorrelationHeatmap from "./CorrelationHeatmap";
import MonthlyReturnsHeatmap from "./MonthlyReturnsHeatmap";
import PfWelcome from "./PfWelcome";
import ScreenerCoverageBadge from "./ScreenerCoverageBadge";

const ScoreCard = dynamic(() => import("../layout/ScoreCard"), { ssr: false });
const DrawdownChart = dynamic(
  () => import("@/components/thread/messages/client-components/DrawdownChart"),
  { ssr: false },
);
const LineChart = dynamic(
  () => import("@/components/thread/messages/client-components/LineChart"),
  { ssr: false },
);
const StockWiseAllocationPie = dynamic(() => import("./StockWiseAllocation"), {
  ssr: false,
});
const FinSharpeScoresRadarChart = dynamic(
  () => import("./FinSharpeScoresRadarChart"),
  { ssr: false },
);

import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";
import { JsonDataDisplay } from "../shared/JsonDataDisplay";

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

  // Drawdown section (nested: { analysis, chart })
  const drawdownSection = data.drawdown as
    | { analysis?: Section; chart?: DrawdownChartData | null }
    | undefined;
  const drawdownChart = drawdownSection?.chart ?? null;

  // Correlation section (nested: { analysis, heatmap })
  const correlationSection = data.correlation as
    | { analysis?: Section; heatmap?: CorrelationHeatmapRow[] | null }
    | undefined;
  const correlationHeatmap = correlationSection?.heatmap ?? null;

  // Monthly returns section (nested: { heatmap, summary })
  const monthlyReturnsSection = data.monthly_returns as
    | { heatmap?: MonthlyReturnsHeatmapData; summary?: string }
    | undefined;
  const monthlyReturnsHeatmap = monthlyReturnsSection?.heatmap ?? null;
  const monthlyReturnsSummary = monthlyReturnsSection?.summary;

  // Helper function to check if a section should be rendered
  const shouldRenderSection = (sectionKey: string) => {
    // If no selectedSections provided, render all sections
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  const portfolio = analysis.portfolio;

  const pfItemsArr = chunkArray(portfolio, MAX_ROWS_PER_PAGE);

  // Calculate total pages dynamically
  let totalPages = 0;
  totalPages++; // IntroPageContainer
  if (
    data.sector_allocation?.items?.length ||
    data.market_cap_allocation?.items?.length
  )
    totalPages++; // AllocationsPage
  totalPages++; // Stock Wise Allocation
  if (shouldRenderSection("finsharpe_analysis") && data.finsharpe_analysis)
    totalPages++; // FinSharpe Analysis
  if (shouldRenderSection("performance_analysis")) totalPages++; // Performance
  if (shouldRenderSection("monthly_returns")) totalPages++; // Monthly Returns
  totalPages++; // Financial Fitness
  totalPages++; // Actionables
  if (shouldRenderSection("summary")) totalPages++; // Summary
  if (shouldRenderSection("recommendation")) totalPages++; // Recommendation
  if (shouldRenderSection("portfolio_overview"))
    totalPages += pfItemsArr.length; // Portfolio Overview (multiple pages)
  totalPages++; // Advanced Analysis intro
  if (
    shouldRenderSection("risk_assessment") ||
    shouldRenderSection("risk_adjusted_returns")
  )
    totalPages++; // Risk Assessment + Risk-Adjusted Returns
  if (shouldRenderSection("drawdown")) totalPages++; // Drawdown Analysis
  if (shouldRenderSection("correlation")) totalPages++; // Correlation
  if (personalComment) totalPages++; // Personal Comment
  totalPages++; // Disclaimer

  let pgNum = 1;

  return (
    <TotalPageCtxProvider value={totalPages}>
      <PfWelcome analysis={analysis} />
      <IntroPageContainer pgNo={pgNum++}>
        <div className="flex gap-6">
          {(data.finsharpe_analysis?.sections || [])
            .filter((s) => s.chart_type === "gauge" && s.chart_data?.length)
            .map((section) => (
              <ScoreCard
                key={section.title}
                label={section.title}
                data={section.chart_data || []}
                desc={section.summary || ""}
              />
            ))}
        </div>
        <ScreenerCoverageBadge
          showMissing={true}
          className="mt-2"
          coverage={data.finsharpe_analysis?.screener_coverage}
        />
      </IntroPageContainer>
      {(data.sector_allocation?.items?.length ||
        data.market_cap_allocation?.items?.length) && (
        <AllocationsPage
          sectorDistribution={data.sector_allocation?.items}
          marketCapDistribution={data.market_cap_allocation?.items}
          sectorAllocationSummary={data.sector_allocation?.summary}
          marketCapAllocationSummary={data.market_cap_allocation?.summary}
          pgNo={pgNum++}
        />
      )}
      <PageLayout pgNo={pgNum++}>
        {" "}
        <ChartContainer
          Icon={BulbIcon}
          containerClasses="mt-4"
          desc={
            data.weight_allocation_summary ||
            (analysis.portfolio_type === "mutual_fund"
              ? "Fund wise allocation shows how your investments are distributed across different mutual funds in your portfolio. A well-diversified fund allocation can help reduce risk and improve potential returns."
              : "Stock wise allocation shows how your investments are distributed across different stocks in your portfolio. A well-diversified stock allocation can help reduce risk and improve potential returns by spreading investments across multiple companies.")
          }
          context="Diversification across multiple stocks reduces the portfolio's overall level of volatility and potential risk. When one stock performs poorly, others in the portfolio can offset the losses."
        >
          <StockWiseAllocationPie
            data={shuffleArray(
              groupSmallFragments(portfolio, {
                id:
                  analysis.portfolio_type === "mutual_fund"
                    ? "Scheme_Name"
                    : "Ticker",
                maxFragments: 6,
              }),
            )}
            label={
              analysis.portfolio_type === "mutual_fund"
                ? "Fund Wise Allocations"
                : "Stock Wise Allocations"
            }
            labelKey={
              analysis.portfolio_type === "mutual_fund"
                ? "Scheme_Name"
                : "Ticker"
            }
          />
        </ChartContainer>
      </PageLayout>
      {/* FinSharpe Analysis (if present) */}
      {shouldRenderSection("finsharpe_analysis") && data.finsharpe_analysis && (
        <>
          <FinSharpeAnalysisSection
            data={data.finsharpe_analysis}
            screenerCoverage={data.finsharpe_analysis.screener_coverage}
            pgNo={pgNum++}
          />
        </>
      )}

      {/* Performance Analysis */}
      {shouldRenderSection("performance_analysis") && (
        <PageLayout pgNo={pgNum++}>
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
                    disableAnimation
                  />
                </div>
              )}
            </div>
          </div>
        </PageLayout>
      )}

      {/* Monthly Returns */}
      {shouldRenderSection("monthly_returns") && (
        <PageLayout pgNo={pgNum++}>
          <MonthlyReturnsHeatmap
            heatmap={monthlyReturnsHeatmap}
            summary={monthlyReturnsSummary}
          />
        </PageLayout>
      )}

      <PageLayout pgNo={pgNum++}>
        <FinancialFitness />
      </PageLayout>

      <SectionDivider
        title="ACTIONABLES"
        pgNo={pgNum++}
      />

      {/* Summary */}
      {shouldRenderSection("summary") && (
        <Summary
          summary={data.summary?.content}
          pgNo={pgNum++}
        />
      )}

      {/* Recommendation */}
      {shouldRenderSection("recommendation") && (
        <PageLayout pgNo={pgNum++}>
          <div className="flex h-full flex-col">
            <RecommendationSection section={data.recommendation} />
          </div>
        </PageLayout>
      )}

      {/* Portfolio Overview */}
      {shouldRenderSection("portfolio_overview") &&
        pfItemsArr.map((chunk, idx) => (
          <PageLayout
            pgNo={pgNum++}
            key={`portfolio-overview-${idx}`}
          >
            <PortfolioOverviewSection
              section={data.portfolio_overview}
              portfolio={chunk}
              isFirstChunk={idx === 0}
              portfolioType={analysis.portfolio_type}
            />
          </PageLayout>
        ))}

      <SectionDivider
        title="ADVANCED ANALYSIS"
        pgNo={pgNum++}
      />

      {/* Risk Assessment + Risk-Adjusted Returns */}
      {(shouldRenderSection("risk_assessment") ||
        shouldRenderSection("risk_adjusted_returns")) && (
        <PageLayout pgNo={pgNum++}>
          {shouldRenderSection("risk_assessment") && (
            <FormatSection section={data.risk_assessment} />
          )}
          {shouldRenderSection("risk_adjusted_returns") && (
            <FormatSection section={data.risk_adjusted_returns} />
          )}
        </PageLayout>
      )}
      {/* Drawdown Analysis */}
      {shouldRenderSection("drawdown") && (
        <PageLayout pgNo={pgNum++}>
          <DrawdownAnalysisSection
            section={drawdownSection?.analysis}
            data={drawdownChart}
            returnsData={returnsChart}
          />
        </PageLayout>
      )}
      {/* Correlation Analysis */}
      {shouldRenderSection("correlation") && (
        <PageLayout pgNo={pgNum++}>
          <CorrelationAnalysisSection
            section={correlationSection?.analysis}
            heatmapData={correlationHeatmap}
          />
        </PageLayout>
      )}

      {/* Personal Comment Section */}
      {personalComment && (
        <PageLayout pgNo={pgNum++}>
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

      <PageLayout pgNo={pgNum++}>
        <Disclaimer />
      </PageLayout>

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
                sources: getPortfolioDisplayTable(
                  portfolio,
                  analysis.portfolio_type,
                ),
              },
              key: "portfolio_overview",
            },
            { section: data.performance_analysis, key: "performance_analysis" },
            { section: data.risk_assessment, key: "risk_assessment" },
            {
              section: data.risk_adjusted_returns,
              key: "risk_adjusted_returns",
            },
            { section: drawdownSection?.analysis, key: "drawdown" },
            { section: correlationSection?.analysis, key: "correlation" },
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
  section?: Section;
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
  portfolioType,
}: {
  section: Section;
  portfolio?: Record<string, any>[];
  isFirstChunk?: boolean;
  portfolioType?: string;
}) {
  if (!section) {
    return null;
  }

  const items = portfolio || [];
  const firstItem = items[0] as Record<string, any> | undefined;
  const isMF = portfolioType === "mutual_fund";

  // Build columns dynamically based on available keys
  const columns: {
    Header: string;
    accessor: (row: Record<string, any>) => React.ReactNode;
    meta?: { column?: { align?: "left" | "center" | "right" } };
  }[] = [];

  if (isMF) {
    // Mutual fund columns - show Scheme_Name with fallback to symbol/ISIN
    columns.push({
      Header: "Scheme Name",
      accessor: (row) => row.Scheme_Name ?? row.symbol ?? row.ISIN ?? "",
      meta: { column: { align: "left" } },
    });
    // Support both Category (new) and Sebi_Category (legacy)
    if (items.some((item) => "Category" in item || "Sebi_Category" in item)) {
      columns.push({
        Header: "Category",
        accessor: (row) => row.Category ?? row.Sebi_Category ?? "",
        meta: { column: { align: "left" } },
      });
    }

    // Weight column
    columns.push({
      Header: "Weight",
      accessor: (row) =>
        typeof row.weight === "number"
          ? `${row.weight.toFixed(2)}%`
          : row.weight,
      meta: { column: { align: "right" } },
    });

    // MF metric columns
    const mfScoreCols = [
      { key: "Sharpe_Ratio", header: "Sharpe Ratio" },
      { key: "Sortino_Ratio", header: "Sortino Ratio" },
      { key: "Alpha", header: "Alpha" },
      { key: "Beta", header: "Beta" },
      { key: "Expense_Ratio", header: "Expense Ratio" },
      // Legacy fields
      { key: "PerformanceScore", header: "Performance" },
      { key: "RiskAdjReturn", header: "Risk-Adj Return" },
      { key: "RiskScore", header: "Risk Score" },
    ] as const;
    for (const { key, header } of mfScoreCols) {
      if (items.some((item) => key in item)) {
        columns.push({
          Header: header,
          accessor: (row) =>
            row[key] != null ? Number(row[key]).toFixed(3) : "N/A",
          meta: { column: { align: "right" } },
        });
      }
    }
  } else {
    // Stock columns (existing logic)
    const tickerKey = firstItem
      ? "symbol" in firstItem
        ? "symbol"
        : "Ticker" in firstItem
          ? "Ticker"
          : null
      : null;
    if (tickerKey) {
      columns.push({
        Header: tickerKey === "symbol" ? "Symbol" : "Ticker",
        accessor: (row) => row[tickerKey] ?? "",
        meta: { column: { align: "left" } },
      });
    }

    // Weight column
    columns.push({
      Header: "Weight",
      accessor: (row) =>
        typeof row.weight === "number"
          ? `${row.weight.toFixed(2)}%`
          : row.weight,
      meta: { column: { align: "right" } },
    });

    // Quantity column (if present)
    if (firstItem && "quantity" in firstItem) {
      columns.push({
        Header: "Qty",
        accessor: (row) => row.quantity,
        meta: { column: { align: "right" } },
      });
    }

    // Action column (if present)
    if (items.some((item) => "Action" in item)) {
      columns.push({
        Header: "Action",
        accessor: (row) => row.Action ?? "",
        meta: { column: { align: "left" } },
      });
    }

    // FinSharpe score columns (if present)
    const finsharpeScoreCols = [
      { key: "FinSharpe_Overall_Score", header: "FinSharpe Overall" },
      { key: "FinSharpe_Growth_Score", header: "FinSharpe Growth" },
      { key: "FinSharpe_Performance_Score", header: "FinSharpe Perf." },
      { key: "FinSharpe_Value_Score", header: "FinSharpe Value" },
      { key: "FinSharpe_Risk_Score", header: "FinSharpe Risk" },
    ] as const;

    for (const { key, header } of finsharpeScoreCols) {
      if (items.some((item) => key in item)) {
        columns.push({
          Header: header,
          accessor: (row) =>
            row[key] != null ? Number(row[key]).toFixed(1) : "N/A",
          meta: { column: { align: "right" } },
        });
      }
    }
  }

  // Section header with sources link (first chunk only)
  const sectionForTitle: Section | null = isFirstChunk
    ? {
        title: section.title,
        content: "",
        sources: getPortfolioDisplayTable(items, portfolioType),
      }
    : null;

  return (
    <div className="space-y-4">
      {sectionForTitle && <FormatSection section={sectionForTitle} />}
      <DataTable
        columns={columns}
        data={items}
      />
    </div>
  );
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

function DrawdownAnalysisSection({
  section,
  data,
  returnsData,
}: {
  section?: Section;
  data?: DrawdownChartData | null;
  returnsData?: ChartData | null | undefined;
}) {
  if (!section) return null;

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
      <ChartContainer
        Icon={DrawdownIcon}
        desc={
          content ? (
            <span className="text-xs leading-snug [&_ul]:!my-0 [&_ul>li:first-child]:!mt-0">
              <MarkdownText>{content}</MarkdownText>
            </span>
          ) : (
            "Drawdown analysis measures the decline from a portfolio's peak value to its lowest point before recovering. Understanding drawdowns helps assess the risk tolerance needed and the potential impact of market downturns on your investments."
          )
        }
        context="Maximum drawdown is one of the most important risk metrics as it shows the worst-case scenario an investor would have experienced. Lower drawdowns indicate more stable portfolio performance."
        DescComp="div"
      >
        {data && (
          <DrawdownChart
            data={data}
            returnsData={returnsData?.data}
            disableAnimation
          />
        )}
      </ChartContainer>
    </div>
  );
}

function CorrelationAnalysisSection({
  section,
  heatmapData,
}: {
  section?: Section;
  heatmapData?: CorrelationHeatmapRow[] | null;
}) {
  if (!section) return null;

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
      <ChartContainer
        Icon={BulbIcon}
        desc={
          content ? (
            <span className="text-xs leading-snug [&_ul]:!my-0 [&_ul>li:first-child]:!mt-0">
              <MarkdownText>{content}</MarkdownText>
            </span>
          ) : (
            "Correlation analysis measures how different stocks in your portfolio move in relation to each other. Lower correlation between holdings indicates better diversification, which can help reduce overall portfolio risk."
          )
        }
        context="A well-diversified portfolio typically has low average correlation between its holdings. When stocks are less correlated, losses in one position are less likely to be accompanied by losses in others."
        DescComp="div"
      >
        {heatmapData && heatmapData.length > 0 ? (
          <CorrelationHeatmap data={heatmapData} />
        ) : null}
      </ChartContainer>
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

// FinSharpe Analysis Section Component
function FinSharpeAnalysisSection({
  data,
  screenerCoverage,
  pgNo,
}: {
  data: PFFinSharpeAnalysisData;
  screenerCoverage?: ScreenerCoverage | null;
  pgNo: number;
}) {
  if (!data) {
    return null;
  }

  const radarSections = (data.sections || []).filter(
    (s) => s.chart_type === "radar" && s.scores_comparison?.length,
  );

  return (
    <PageLayout pgNo={pgNo}>
      <div className="space-y-6">
        {/* Main Analysis Section */}
        <FormatSection section={data.analysis} />
        {radarSections.map((section) => (
          <div key={section.title}>
            {section.summary && (
              <p className="mb-2 text-sm text-gray-600">{section.summary}</p>
            )}
            <FinSharpeScoresRadarChart data={section.scores_comparison} />
          </div>
        ))}
        <ScreenerCoverageBadge
          coverage={screenerCoverage}
          showMissing={true}
        />
      </div>
    </PageLayout>
  );
}

function RecommendationSection({ section }: { section: Section }) {
  if (!section) return null;

  const formatter = new SectionFormatter(section);
  const anchorId = formatter.getAnchorId();
  const hasRefs = Boolean(section.in_depth_analysis || section.sources);

  return (
    <InsightContainer
      header="Expert Recommendations"
      subHeader="Clear Directed Actionable"
      Icon={CompassIcon}
      gradientDirection="recommendation"
    >
      <div className="space-y-3">
        <div id={anchorId} />
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
        <div className="summary-container">
          <MarkdownText>{section.content}</MarkdownText>
        </div>
      </div>
    </InsightContainer>
  );
}

function AllocationsPage({
  sectorDistribution,
  marketCapDistribution,
  sectorAllocationSummary,
  marketCapAllocationSummary,
  pgNo,
}: {
  sectorDistribution?: { name: string; value: number }[];
  marketCapDistribution?: { name: string; value: number }[];
  sectorAllocationSummary?: string;
  marketCapAllocationSummary?: string;
  pgNo: number;
}) {
  // Cast distribution items to typed arrays with colors
  const industryWithColors = groupSmallFragments(sectorDistribution || [], {
    id: "name",
    value: "value",
    maxFragments: 15,
  }).map((item, index) => ({
    name: item.name,
    value: item.value,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const sizeWithColors = (marketCapDistribution || []).map((item) => ({
    name: item.name,
    value: item.value,
    color: SIZE_COLORS[item.name] || PIE_COLORS[0],
  }));
  return (
    <PageLayout pgNo={pgNo}>
      {/* Score Charts Grid */}
      <div className="space-y-6">
        {/* Industry Distribution */}
        {industryWithColors.length > 0 && (
          <ChartContainer
            Icon={BulbIcon}
            containerClasses="mt-4"
            desc={
              sectorAllocationSummary ||
              "Sector allocation shows how your investments are distributed across different sectors. A well-diversified portfolio typically has allocations spread across multiple sectors, which can help reduce risk and improve potential returns over time."
            }
            context="Having a well-diversified portfolio across sectors helps mitigate concentration risk, i.e., the potential for loss when a group of securities move in an unfavorable direction."
          >
            <div className="p-4">
              <h4 className="mb-4 text-center font-medium text-gray-900">
                Sector Wise Allocation
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
                        isAnimationActive={false}
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
              marketCapAllocationSummary ||
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
