"use client";

import type { ScreenerCoverage } from "@/api/generated/report-apis/models";
import ScreenerCoverageBadge from "@/components/pdfs_templates/pf-report/ScreenerCoverageBadge";
import { Button } from "@/components/ui/button";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { formatKey, getPortfolioDisplayTable } from "@/lib/format-utils";
import groupSmallFragments from "@/lib/groupSmallFragments";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import type {
  ChartData,
  CorrelationHeatmapRow,
  DrawdownChartData,
  MonthlyReturnsHeatmapData,
  PfAnalysis,
  PFFinSharpeAnalysisData,
  Section,
} from "@/types/pf-analysis";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MarkdownText } from "../../markdown-text";
import CorrelationHeatmap from "@/components/pdfs_templates/pf-report/CorrelationHeatmap";
import FinSharpeScoresRadarChart from "@/components/pdfs_templates/pf-report/FinSharpeScoresRadarChart";
import MonthlyReturnsHeatmap from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import DrawdownChart from "./DrawdownChart";
import LineChart from "./LineChart";
import { PfAnalysisDownloadDialog } from "./pf-analysis-download-dialog";

import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";

// Full class names so Tailwind JIT can detect them
const ACCENT_BORDER: Record<string, string> = {
  indigo: "border-l-indigo-500",
  rose: "border-l-rose-500",
  amber: "border-l-amber-500",
  cyan: "border-l-cyan-500",
  emerald: "border-l-emerald-500",
  violet: "border-l-violet-500",
  slate: "border-l-slate-400",
};

export default function PfAnalysisComponent(analysis: PfAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const returnsChart = data.returns_chart as ChartData | null | undefined;

  const drawdownSection = data.drawdown as
    | { analysis?: Section; chart?: DrawdownChartData | null }
    | undefined;
  const drawdownChart = drawdownSection?.chart ?? null;

  const correlationSection = data.correlation as
    | { analysis?: Section; heatmap?: CorrelationHeatmapRow[] | null }
    | undefined;

  const monthlyReturnsSection = data.monthly_returns as
    | { heatmap?: MonthlyReturnsHeatmapData; summary?: string }
    | undefined;

  const topRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: "overview", label: "Overview", show: !!data.portfolio_overview },
    {
      id: "performance",
      label: "Performance",
      show: !!data.performance_analysis,
    },
    { id: "risk", label: "Risk", show: !!data.risk_assessment },
    {
      id: "risk-adj",
      label: "Risk-Adjusted",
      show: !!data.risk_adjusted_returns,
    },
    { id: "drawdown", label: "Drawdown", show: !!drawdownSection?.analysis },
    {
      id: "correlation",
      label: "Correlation",
      show: !!correlationSection?.analysis,
    },
    {
      id: "monthly",
      label: "Monthly",
      show: !!(
        monthlyReturnsSection?.summary || monthlyReturnsSection?.heatmap
      ),
    },
    { id: "finsharpe", label: "FinSharpe", show: !!data.finsharpe_analysis },
    {
      id: "allocation",
      label: "Allocation",
      show: !!(
        data.sector_allocation?.items?.length ||
        data.market_cap_allocation?.items?.length
      ),
    },
    { id: "summary", label: "Summary", show: !!data.summary },
    {
      id: "recommendation",
      label: "Recommendation",
      show: !!data.recommendation,
    },
  ].filter((n) => n.show);

  return (
    <div
      ref={topRef}
      className="space-y-5"
    >
      {/* Header */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-indigo-300 uppercase">
                {analysis.portfolio_type === "mutual_fund"
                  ? "Mutual Fund"
                  : "Stock"}
              </span>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {analysis.holdings_count} holdings
              </span>
              {analysis.date && (
                <span className="text-[11px] text-slate-500">
                  {analysis.date}
                </span>
              )}
            </div>
            <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
              {analysis.portfolio_name}
            </h1>
          </div>
          <div className="shrink-0">
            <PfAnalysisDownloadDialog
              threadId={threadId}
              analysisId={analysis.id}
              portfolioName={analysis.portfolio_name}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-none overflow-x-auto">
        <div className="flex gap-1.5 pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                document
                  .getElementById(`pf-${item.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.97]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 1. Portfolio Overview */}
      <div id="pf-overview">
        <PortfolioOverviewSection
          section={data.portfolio_overview}
          portfolio={analysis.portfolio}
          portfolioType={analysis.portfolio_type}
        />
      </div>

      {/* 2. Performance Analysis + Returns Chart */}
      <div id="pf-performance">
        <SectionCard
          section={data.performance_analysis}
          accent="indigo"
        />
        {returnsChart && (
          <div className="mt-3">
            <LineChart
              data={returnsChart.data}
              colors={returnsChart.colors}
              title={returnsChart.title}
              description={returnsChart.description}
            />
          </div>
        )}
      </div>

      {/* 3. Risk Assessment */}
      <div id="pf-risk">
        <SectionCard
          section={data.risk_assessment}
          accent="rose"
        />
      </div>

      {/* 4. Risk-Adjusted Returns */}
      <div id="pf-risk-adj">
        <SectionCard
          section={data.risk_adjusted_returns}
          accent="amber"
        />
      </div>

      {/* 5. Drawdown Analysis + Chart */}
      {drawdownSection?.analysis && (
        <div id="pf-drawdown">
          <SectionCard
            section={drawdownSection.analysis}
            accent="rose"
          />
          {drawdownChart && (
            <div className="mt-3">
              <div className="mx-auto grid min-w-[calc(100dvw-2rem)] grid-rows-[auto] gap-6 md:min-w-3xl">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                    <h3 className="text-sm font-semibold text-slate-800">
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
        </div>
      )}

      {/* 6. Correlation Analysis */}
      {correlationSection?.analysis && (
        <div id="pf-correlation">
          <SectionCard
            section={correlationSection.analysis}
            accent="cyan"
          />
          {correlationSection.heatmap &&
            correlationSection.heatmap.length > 0 && (
              <ChartContainer className="mt-3">
                <CorrelationHeatmap data={correlationSection.heatmap} />
              </ChartContainer>
            )}
        </div>
      )}

      {/* 7. Monthly Returns */}
      {(monthlyReturnsSection?.summary || monthlyReturnsSection?.heatmap) && (
        <div id="pf-monthly">
          {monthlyReturnsSection.heatmap ? (
            <MonthlyReturnsHeatmap
              heatmap={monthlyReturnsSection.heatmap}
              summary={monthlyReturnsSection.summary}
            />
          ) : (
            <AccentCard accent="violet">
              <MarkdownText>{`## Monthly Returns\n${monthlyReturnsSection.summary}`}</MarkdownText>
            </AccentCard>
          )}
        </div>
      )}

      {/* 8. FinSharpe Analysis (stock portfolios) */}
      {data.finsharpe_analysis && (
        <div id="pf-finsharpe">
          <FinSharpeAnalysisSection
            data={data.finsharpe_analysis}
            screenerCoverage={data.finsharpe_analysis.screener_coverage}
          />
        </div>
      )}

      {/* 9. Allocation Charts */}
      <div id="pf-allocation">
        <DistributionChartsSection
          sectorDistribution={data.sector_allocation?.items}
          marketCapDistribution={data.market_cap_allocation?.items}
          sectorAllocationSummary={data.sector_allocation?.summary}
          marketCapAllocationSummary={data.market_cap_allocation?.summary}
        />
      </div>

      {/* 10. Summary */}
      <div id="pf-summary">
        <SectionCard
          section={data.summary}
          accent="emerald"
        />
      </div>

      {/* 11. Recommendation */}
      <div id="pf-recommendation">
        <SectionCard
          section={data.recommendation}
          accent="indigo"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={() =>
            topRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          <ArrowUp className="mr-1 h-3 w-3" />
          Top
        </Button>
      </div>
    </div>
  );
}

/* ─── Reusable layout components ─────────────────────────────────── */

function AccentCard({
  accent = "slate",
  children,
  className = "",
}: {
  accent?: keyof typeof ACCENT_BORDER;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-l-4 border-slate-200 ${ACCENT_BORDER[accent]} bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function ChartContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-slate-50/60 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Section components ─────────────────────────────────────────── */

function PortfolioOverviewSection({
  section,
  portfolio,
  portfolioType,
}: {
  section: Section;
  portfolio?: Record<string, any>[];
  portfolioType?: string;
}) {
  if (!section) return null;

  const portfolioTable = getPortfolioDisplayTable(portfolio, portfolioType);

  const content = `${section.content}\n\n${portfolioTable ? `\n${portfolioTable}\n` : ""}`;

  const _section: Section = {
    title: section.title,
    content: content,
    sources: convertToMarkdownTable(portfolio || []),
  };

  return (
    <SectionCard
      section={_section}
      accent="slate"
    />
  );
}

function SectionCard({
  section,
  accent = "slate",
}: {
  section: Section;
  accent?: keyof typeof ACCENT_BORDER;
}) {
  if (!section) return null;

  const title = `## ${section.title}\n`;
  const content = `${section.content}\n`;
  const inDepth = section.in_depth_analysis
    ? `<details><summary>In-depth Analysis</summary>\n\n${section.in_depth_analysis}\n</details>\n`
    : "";
  const sources = formatSources(section.sources);
  const markdown = `${title}${content}${inDepth}${sources}`;

  return (
    <AccentCard accent={accent}>
      <MarkdownText>{markdown}</MarkdownText>
      {section.sources &&
        typeof section.sources === "object" &&
        !Array.isArray(section.sources) && (
          <JsonSourcesDisplay sources={section.sources} />
        )}
    </AccentCard>
  );
}

function FinSharpeAnalysisSection({
  data,
  screenerCoverage,
}: {
  data: PFFinSharpeAnalysisData;
  screenerCoverage?: ScreenerCoverage | null;
}) {
  if (!data) return null;

  const gaugeSections = (data.sections || []).filter(
    (s) => s.chart_type === "gauge" && s.chart_data?.length,
  );

  const radarSections = (data.sections || []).filter(
    (s) => s.chart_type === "radar" && s.scores_comparison?.length,
  );

  return (
    <div className="space-y-4">
      <SectionCard
        section={data.analysis}
        accent="violet"
      />

      {/* Radar chart: Portfolio vs Industry scores */}
      {radarSections.map((section) => (
        <div
          key={section.title}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <h4 className="text-sm font-semibold text-slate-800">
              {section.title}
            </h4>
          </div>
          <div className="max-w-full overflow-x-auto p-4">
            <FinSharpeScoresRadarChart data={section.scores_comparison} />
            {section.summary && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {section.summary}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Gauge charts: Overall Score & Risk Score */}
      {gaugeSections.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {gaugeSections.map((section) => {
            const isRisk = section.title.toLowerCase().includes("risk");
            return (
              <div
                key={section.title}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {section.title}
                  </h4>
                </div>
                <div className="p-4">
                  <div className="relative h-[28vh] w-full sm:h-[50vh] sm:max-h-[350px]">
                    {isRisk ? (
                      <RiskScorePie
                        data={section.chart_data as any}
                        shouldRenderActiveShapeLabel={true}
                      />
                    ) : (
                      <OverallScorePie
                        data={section.chart_data as any}
                        shouldRenderActiveShapeLabel={true}
                      />
                    )}
                  </div>
                  {section.summary && (
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      {section.summary}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ScreenerCoverageBadge
        coverage={screenerCoverage}
        showMissing={true}
        className="mt-2"
      />
    </div>
  );
}

function DistributionChartsSection({
  sectorDistribution,
  marketCapDistribution,
  sectorAllocationSummary,
  marketCapAllocationSummary,
}: {
  sectorDistribution?: { name: string; value: number }[];
  marketCapDistribution?: { name: string; value: number }[];
  sectorAllocationSummary?: string;
  marketCapAllocationSummary?: string;
}) {
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

  if (industryWithColors.length === 0 && sizeWithColors.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {/* Sector Distribution */}
      {industryWithColors.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <h4 className="text-sm font-semibold text-slate-800">
              Sector Allocation
            </h4>
          </div>
          <div className="p-5">
            {sectorAllocationSummary && (
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                {sectorAllocationSummary}
              </p>
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="h-48 shrink-0 md:w-48">
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
              <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {industryWithColors.map((industry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 py-0.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: industry.color }}
                      />
                      <span className="truncate text-xs text-slate-600">
                        {industry.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-800 tabular-nums">
                      {Number(industry.value).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Cap Distribution */}
      {sizeWithColors.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <h4 className="text-sm font-semibold text-slate-800">
              Market Cap Allocation
            </h4>
          </div>
          <div className="p-5">
            {marketCapAllocationSummary && (
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                {marketCapAllocationSummary}
              </p>
            )}
            <div className="space-y-3">
              {sizeWithColors.map((size, index) => (
                <div key={index}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">
                      {size.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 tabular-nums">
                      {Number(size.value).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
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
        </div>
      )}
    </div>
  );
}

/* ─── Source formatting helpers ───────────────────────────────────── */

function formatSources(
  sources: string | string[] | Record<string, any> | null | undefined,
): string {
  if (!sources) return "";

  if (typeof sources === "string") {
    return `<details><summary>Sources</summary>\n\n${sources}\n</details>\n`;
  }

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

  return "";
}

function JsonSourcesDisplay({ sources }: { sources: Record<string, any> }) {
  return (
    <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <summary className="cursor-pointer text-sm font-medium text-slate-700">
        Sources (Data)
      </summary>
      <div className="mt-4 space-y-4">
        {Object.entries(sources).map(([key, value]) => (
          <div
            key={key}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-slate-800">
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
    return <span className="text-xs text-slate-400">N/A</span>;
  }

  if (typeof data !== "object") {
    return <span className="text-sm text-slate-600">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-xs text-slate-400">Empty</span>;
    }
    return (
      <ul className="list-inside list-disc space-y-1 text-sm">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="text-slate-600"
          >
            <JsonDataDisplay data={item} />
          </li>
        ))}
      </ul>
    );
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <span className="text-xs text-slate-400">Empty object</span>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <tbody className="divide-y divide-slate-100">
          {entries.map(([key, value]) => (
            <tr
              key={key}
              className="hover:bg-slate-50"
            >
              <td className="px-4 py-2 text-xs font-medium whitespace-nowrap text-slate-800">
                {formatKey(key)}
              </td>
              <td className="px-4 py-2 text-xs text-slate-600">
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
