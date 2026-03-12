"use client";
import { MarkdownText } from "@/components/thread/markdown-text";
import { JsonDataDisplay } from "@/components/pdfs_templates/shared/JsonDataDisplay";
import type {
  MFAnalysis,
  PeerChartData,
  ScoreSection,
} from "@/api/generated/report-apis/models";
import type { Section } from "@/types/mf-analysis";
import MfWelcome from "./MfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";
import { formatKey } from "@/lib/format-utils";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import type { MonthlyReturnsHeatmapData } from "@/types/pf-analysis";
import dynamic from "next/dynamic";

import BulbIcon from "@/components/icons/BulbIcon";
import Disclaimer from "../layout/Disclaimer";
import FinancialFitness from "../layout/FinancialFitness";
import InsightContainer from "../layout/InsightContainer";
import IntroPageContainer from "../layout/IntroPageContainer";
import PageLayout from "../layout/PageLayout";
import SectionDivider from "../layout/SectionDivider";
import TotalPageCtxProvider from "../stock-report/TotalPageCtx";

const ScoreCard = dynamic(() => import("../layout/ScoreCard"), { ssr: false });
const DrawdownChart = dynamic(
  () => import("@/components/thread/messages/client-components/DrawdownChart"),
  { ssr: false },
);
const LineChart = dynamic(
  () => import("@/components/thread/messages/client-components/LineChart"),
  { ssr: false },
);
const PeerComparisonChart = dynamic(
  () =>
    import(
      "@/components/thread/messages/client-components/PeerComparisonChart"
    ),
  { ssr: false },
);
const DistributionPieChart = dynamic(
  () =>
    import(
      "@/components/thread/messages/client-components/DistributionPieChart"
    ),
  { ssr: false },
);
const FinSharpeScoresRadarChart = dynamic(
  () => import("../pf-report/FinSharpeScoresRadarChart"),
  { ssr: false },
);

export default function MfAnalysisReportMessageComponent({
  analysis,
  selectedSections,
  personalComment,
}: {
  analysis: MFAnalysis;
  selectedSections?: string[];
  personalComment?: string;
}) {
  const { data } = analysis;

  const shouldRenderSection = (sectionKey: string) => {
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  const fa = data.finsharpe_analysis as any;
  const radarSections: ScoreSection[] = fa
    ? (fa.sections || []).filter((s: ScoreSection) => s.chart_type === "radar")
    : [];

  // Calculate total pages dynamically (Welcome page excluded — no footer)
  let totalPages = 0;
  totalPages++; // IntroPageContainer
  if (shouldRenderSection("fund_overview")) totalPages++; // Scheme Overview + Fund Manager
  if (shouldRenderSection("performance")) totalPages++; // Analysis text + Trailing Returns chart
  if (
    shouldRenderSection("performance") &&
    (data.performance.returns_chart || data.performance.drawdown_chart)
  )
    totalPages++; // Returns + Drawdown charts
  if (shouldRenderSection("performance") && data.performance.monthly_returns)
    totalPages++; // Monthly Returns heatmap
  if (shouldRenderSection("ratios")) totalPages++; // Risk Metrics + Cost Analysis
  if (shouldRenderSection("ratios") && data.ratios.valuation_metrics)
    totalPages++; // Valuation Metrics
  if (shouldRenderSection("portfolio")) totalPages++; // Asset Allocation
  if (shouldRenderSection("portfolio")) totalPages++; // Top Holdings text
  if (
    shouldRenderSection("portfolio") &&
    (data.portfolio.sector_chart ||
      data.portfolio.mcap_chart ||
      data.portfolio.top_holdings_chart)
  )
    totalPages++; // Sector + Market Cap pies + Top Holdings chart
  if (shouldRenderSection("peer_comparison")) totalPages++; // Analysis text
  if (
    shouldRenderSection("peer_comparison") &&
    (data.peer_comparison.returns_chart ||
      data.peer_comparison.risk_adjusted_chart)
  )
    totalPages++; // Returns + Risk-adjusted charts
  if (shouldRenderSection("finsharpe_analysis") && fa) totalPages++;
  totalPages++; // SectionDivider "OUTLOOK"
  if (shouldRenderSection("outlook")) totalPages++; // Summary
  if (shouldRenderSection("outlook")) totalPages++; // Conclusion
  totalPages++; // Financial Fitness
  if (personalComment) totalPages++;
  totalPages++; // Disclaimer

  let pgNum = 1;

  return (
    <TotalPageCtxProvider value={totalPages}>
      <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <MfWelcome analysis={analysis as any} />

        {/* Intro Page with Score Cards */}
        <IntroPageContainer pgNo={pgNum++}>
          <div className="flex gap-6">
            {(fa?.sections || [])
              .filter(
                (s: ScoreSection) =>
                  s.chart_type === "gauge" && s.chart_data?.length,
              )
              .map((section: ScoreSection) => (
                <ScoreCard
                  key={section.title}
                  label={section.title}
                  data={section.chart_data || []}
                  desc={section.summary || ""}
                />
              ))}
          </div>
        </IntroPageContainer>

        {/* 1. Fund Overview — Scheme Overview + Fund Manager */}
        {shouldRenderSection("fund_overview") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.fund_overview.scheme_overview} />
            {data.fund_overview.fund_manager && (
              <FormatSection
                section={data.fund_overview.fund_manager as Section}
              />
            )}
          </PageLayout>
        )}

        {/* 2. Performance — Analysis text + Trailing Returns chart */}
        {shouldRenderSection("performance") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.performance.analysis} />
            {data.performance.trailing_returns_chart && (
              <PeerComparisonChart
                data={data.performance.trailing_returns_chart as PeerChartData}
                labelKey="period"
                disableAnimation
              />
            )}
          </PageLayout>
        )}

        {/* Performance — Returns + Drawdown charts */}
        {shouldRenderSection("performance") &&
          (data.performance.returns_chart ||
            data.performance.drawdown_chart) && (
            <PageLayout pgNo={pgNum++}>
              <div className="space-y-4">
                {data.performance.returns_chart && (
                  <LineChart
                    {...(data.performance.returns_chart as Record<string, any>)}
                    className="!min-w-0"
                    disableAnimation
                  />
                )}
                {data.performance.drawdown_chart && (
                  <DrawdownChart
                    data={data.performance.drawdown_chart as any}
                    returnsData={(data.performance.returns_chart as any)?.data}
                    disableAnimation
                  />
                )}
              </div>
            </PageLayout>
          )}

        {/* Performance — Monthly Returns heatmap */}
        {shouldRenderSection("performance") &&
          data.performance.monthly_returns && (
            <PageLayout pgNo={pgNum++}>
              <div className="space-y-2">
                {(data.performance.monthly_returns as any)?.heatmap && (
                  <div className="overflow-x-auto">
                    <MonthlyReturnsHeatmapTables
                      heatmap={
                        (data.performance.monthly_returns as any)
                          .heatmap as MonthlyReturnsHeatmapData
                      }
                    />
                  </div>
                )}
                {(data.performance.monthly_returns as any)?.summary && (
                  <MarkdownText>
                    {(data.performance.monthly_returns as any).summary}
                  </MarkdownText>
                )}
              </div>
            </PageLayout>
          )}

        {/* 3. Ratios — Risk Metrics + Cost Analysis */}
        {shouldRenderSection("ratios") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.ratios.risk_metrics} />
            <FormatSection section={data.ratios.cost_analysis} />
          </PageLayout>
        )}

        {/* Ratios — Valuation Metrics */}
        {shouldRenderSection("ratios") && data.ratios.valuation_metrics && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.ratios.valuation_metrics as Section} />
          </PageLayout>
        )}

        {/* 4. Portfolio — Asset Allocation */}
        {shouldRenderSection("portfolio") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.portfolio.asset_allocation} />
          </PageLayout>
        )}

        {/* Portfolio — Top Holdings text */}
        {shouldRenderSection("portfolio") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.portfolio.top_holdings} />
          </PageLayout>
        )}

        {/* Portfolio — Sector Distribution + Market Cap pies + Top Holdings chart */}
        {shouldRenderSection("portfolio") &&
          (data.portfolio.sector_chart ||
            data.portfolio.mcap_chart ||
            data.portfolio.top_holdings_chart) && (
            <PageLayout pgNo={pgNum++}>
              <div className="space-y-4">
                {data.portfolio.sector_chart && (
                  <DistributionPieChart
                    title="Sector Distribution"
                    data={
                      data.portfolio.sector_chart as {
                        name: string;
                        value: number;
                      }[]
                    }
                    useGrouping
                    disableAnimation
                    className="flex flex-row items-center gap-4"
                  />
                )}
                {data.portfolio.mcap_chart && (
                  <DistributionPieChart
                    title="Market Cap Distribution"
                    data={
                      data.portfolio.mcap_chart as {
                        name: string;
                        value: number;
                      }[]
                    }
                    useSizeColors
                    disableAnimation
                    className="flex flex-row items-center gap-4"
                  />
                )}
                {data.portfolio.top_holdings_chart && (
                  <PeerComparisonChart
                    data={data.portfolio.top_holdings_chart as PeerChartData}
                    hideLegend
                    disableAnimation
                  />
                )}
              </div>
            </PageLayout>
          )}

        {/* 5. Peer Comparison — Analysis text */}
        {shouldRenderSection("peer_comparison") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.peer_comparison.analysis} />
          </PageLayout>
        )}

        {/* Peer Comparison — Returns + Risk-adjusted charts */}
        {shouldRenderSection("peer_comparison") &&
          (data.peer_comparison.returns_chart ||
            data.peer_comparison.risk_adjusted_chart) && (
            <PageLayout pgNo={pgNum++}>
              <div className="space-y-4">
                {data.peer_comparison.returns_chart && (
                  <PeerComparisonChart
                    data={data.peer_comparison.returns_chart as PeerChartData}
                    labelKey="fund"
                    disableAnimation
                  />
                )}
                {data.peer_comparison.risk_adjusted_chart && (
                  <PeerComparisonChart
                    data={
                      data.peer_comparison.risk_adjusted_chart as PeerChartData
                    }
                    labelKey="fund"
                    disableAnimation
                  />
                )}
              </div>
            </PageLayout>
          )}

        {/* 6. FinSharpe Analysis */}
        {shouldRenderSection("finsharpe_analysis") && fa && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={fa.analysis} />
            {radarSections.map((s: ScoreSection, idx: number) => (
              <FinSharpeScoresRadarChart
                key={`radar-${idx}`}
                data={s.scores_comparison}
              />
            ))}
          </PageLayout>
        )}

        {/* Outlook Section Divider */}
        <SectionDivider
          title="OUTLOOK"
          pgNo={pgNum++}
        />

        {/* 7. Outlook — Summary */}
        {shouldRenderSection("outlook") && (
          <PageLayout pgNo={pgNum++}>
            <InsightContainer
              header="AI-Powered Insights"
              subHeader="Concise Clear Impactful"
              Icon={BulbIcon}
              gradientDirection="summary"
            >
              <div className="summary-container">
                <MarkdownText>
                  {data.outlook.summary?.content || ""}
                </MarkdownText>
              </div>
            </InsightContainer>
          </PageLayout>
        )}

        {/* Outlook — Conclusion */}
        {shouldRenderSection("outlook") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.outlook.conclusion} />
          </PageLayout>
        )}

        {/* Financial Fitness */}
        <PageLayout pgNo={pgNum++}>
          <FinancialFitness />
        </PageLayout>

        {/* Personal Comment */}
        {personalComment && (
          <PageLayout pgNo={pgNum++}>
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold tracking-tight">
                Personal Comment
              </h3>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
                <p className="whitespace-pre-wrap text-gray-700">
                  {personalComment}
                </p>
              </div>
            </div>
          </PageLayout>
        )}

        {/* Disclaimer */}
        <PageLayout pgNo={pgNum++}>
          <Disclaimer />
        </PageLayout>

        {/* Data Sources (unpaginated) */}
        <div
          className="mx-12 max-w-3xl space-y-8 pt-12"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <h3 className="text-3xl font-semibold tracking-tight">
            Data Sources and In-depth Analysis
          </h3>
          <span className="report-compact-table">
            {getAllSections(data)
              .filter(({ key, section }) => section && shouldRenderSection(key))
              .map(({ section, key }, idx, arr) => (
                <div key={`${key}-${idx}`}>
                  <FormatSectionSourcesAndInDepthAnalysis section={section} />
                  {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
                </div>
              ))}
          </span>
        </div>
      </div>
    </TotalPageCtxProvider>
  );
}

/** Extract all Section objects from the grouped data, with their parent group key for filtering. */
function getAllSections(
  data: MFAnalysis["data"],
): { section: Section; key: string }[] {
  return [
    { section: data.fund_overview.scheme_overview, key: "fund_overview" },
    {
      section: data.fund_overview.fund_manager as Section,
      key: "fund_overview",
    },
    { section: data.performance.analysis, key: "performance" },
    { section: data.ratios.risk_metrics, key: "ratios" },
    { section: data.ratios.cost_analysis, key: "ratios" },
    { section: data.ratios.valuation_metrics as Section, key: "ratios" },
    { section: data.portfolio.asset_allocation, key: "portfolio" },
    { section: data.portfolio.top_holdings, key: "portfolio" },
    { section: data.portfolio.sector_distribution, key: "portfolio" },
    { section: data.peer_comparison.analysis, key: "peer_comparison" },
    {
      section: (data.finsharpe_analysis as any)?.analysis,
      key: "finsharpe_analysis",
    },
  ];
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
        <SourcesDisplay sources={sources as Record<string, any>} />
      )}
    </div>
  );
}

function FormatSection({ section }: { section: Section }) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
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
