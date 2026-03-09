"use client";
import type {
  FundamentalChartData,
  PeerChartData,
  ScoreSection,
} from "@/api/generated/report-apis/models";
import BulbIcon from "@/components/icons/BulbIcon";
import DrawdownIcon from "@/components/icons/DrawdownIcon";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import ScreenerCoverageBadge from "@/components/pdfs_templates/pf-report/ScreenerCoverageBadge";
import { MarkdownText } from "@/components/thread/markdown-text";
import { FormatNewsSentiment } from "@/components/thread/messages/client-components/format-news-sentiment";
import RiskMetricsTable from "@/components/thread/messages/client-components/RiskMetricsTable";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { SectionFormatter } from "@/lib/section-formatter";
import {
  NewsSource,
  NewsSourcesContent,
  Section,
  StockAnalysis,
} from "@/types/stock-analysis";
import { ChevronRightIcon } from "lucide-react";
import dynamic from "next/dynamic";
import ChartContainer from "../layout/ChartContainer";
import Disclaimer from "../layout/Disclaimer";
import FinancialFitness from "../layout/FinancialFitness";
import InsightContainer from "../layout/InsightContainer";
import IntroPageContainer from "../layout/IntroPageContainer";
import PageLayout from "../layout/PageLayout";
import SectionDivider from "../layout/SectionDivider";
import TotalPageCtxProvider from "./TotalPageCtx";
import Welcome from "../Welcome";

const ScoreCard = dynamic(() => import("../layout/ScoreCard"), { ssr: false });
const DrawdownChart = dynamic(
  () => import("@/components/thread/messages/client-components/DrawdownChart"),
  { ssr: false },
);
const LineChart = dynamic(
  () => import("@/components/thread/messages/client-components/LineChart"),
  { ssr: false },
);
const SimulationChart = dynamic(
  () =>
    import("@/components/thread/messages/client-components/SimulationChart"),
  { ssr: false },
);
const FundamentalChart = dynamic(
  () =>
    import("@/components/thread/messages/client-components/FundamentalChart"),
  { ssr: false },
);
const PeerComparisonChart = dynamic(
  () =>
    import(
      "@/components/thread/messages/client-components/PeerComparisonChart"
    ),
  { ssr: false },
);
const FinSharpeScoresRadarChart = dynamic(
  () => import("../pf-report/FinSharpeScoresRadarChart"),
  { ssr: false },
);

export default function StockAnalysisReportMessageComponent({
  analysis,
  selectedSections,
  personalComment,
}: {
  analysis: StockAnalysis;
  selectedSections?: string[];
  personalComment?: string;
}) {
  const { data } = analysis;

  if (!data) {
    console.error("No data in analysis object!");
    return <div>No analysis data available</div>;
  }

  // Helper function to check if a section should be rendered
  const shouldRenderSection = (sectionKey: string) => {
    // If no selectedSections provided, render all sections
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  const fa = data.finsharpe_analysis as any;
  const radarSections: ScoreSection[] = fa
    ? (fa.sections || []).filter(
        (s: ScoreSection) => s.chart_type === "radar",
      )
    : [];

  // Calculate total pages dynamically (Welcome page excluded — no footer)
  let totalPages = 0;
  totalPages++; // IntroPageContainer
  if (shouldRenderSection("company_overview")) totalPages++;
  if (shouldRenderSection("technical_analysis")) totalPages += 2; // Charts + Metrics
  if (shouldRenderSection("fundamental_analysis")) totalPages++;
  if (shouldRenderSection("peer_comparison")) totalPages++;
  if (shouldRenderSection("market_sentiment")) totalPages++;
  if (shouldRenderSection("finsharpe_analysis") && fa) totalPages++;
  totalPages++; // SectionDivider "OUTLOOK"
  if (shouldRenderSection("outlook")) totalPages++; // Summary + red flags
  if (shouldRenderSection("outlook") && data.outlook.simulation_chart)
    totalPages++; // Simulation
  totalPages++; // Financial Fitness
  if (personalComment) totalPages++;
  totalPages++; // Disclaimer

  // Build flat list of sections that have sources for the Data Sources section
  const sourceSections = [
    {
      section: data.company_overview.business_overview,
      key: "company_overview",
    },
    {
      section: data.company_overview.management_strategy as Section | null,
      key: "company_overview",
    },
    { section: data.company_overview.sector_outlook, key: "company_overview" },
    { section: data.technical_analysis.analysis, key: "technical_analysis" },
    {
      section: data.fundamental_analysis.analysis,
      key: "fundamental_analysis",
    },
    { section: data.peer_comparison.analysis, key: "peer_comparison" },
    {
      section: data.market_sentiment.news_sentiment,
      key: "market_sentiment",
      isNews: true,
    },
    {
      section: data.market_sentiment.conference_call as Section | null,
      key: "market_sentiment",
    },
    {
      section: data.market_sentiment.corporate_actions as Section | null,
      key: "market_sentiment",
    },
    {
      section: data.market_sentiment.shareholding_pattern,
      key: "market_sentiment",
    },
    {
      section: fa ? fa.analysis : null,
      key: "finsharpe_analysis",
    },
  ].filter(({ key, section }) => section && shouldRenderSection(key));

  let pgNum = 1;

  return (
    <TotalPageCtxProvider value={totalPages}>
      <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Welcome analysis={analysis} />

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

        {/* Company Overview */}
        {shouldRenderSection("company_overview") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.company_overview.business_overview} />
            {data.company_overview.management_strategy && (
              <FormatSection
                section={data.company_overview.management_strategy as Section}
              />
            )}
            <FormatSection section={data.company_overview.sector_outlook} />
          </PageLayout>
        )}

        {/* Technical Analysis - Charts */}
        {shouldRenderSection("technical_analysis") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.technical_analysis.analysis} />
            {data.technical_analysis.returns_chart && (
              <ChartContainer
                Icon={BulbIcon}
                desc="Historical performance and returns comparison, showing how the stock has performed over time."
              >
                <LineChart
                  {...(data.technical_analysis.returns_chart as any)}
                  className="!min-w-0"
                  disableAnimation
                />
              </ChartContainer>
            )}
            {data.technical_analysis.drawdown_chart && (
              <ChartContainer
                Icon={DrawdownIcon}
                desc="Drawdown analysis showing peak-to-trough declines, measuring the stock's downside risk."
              >
                <DrawdownChart
                  data={data.technical_analysis.drawdown_chart as any}
                  returnsData={
                    (data.technical_analysis.returns_chart as any)?.data
                  }
                  disableAnimation
                />
              </ChartContainer>
            )}
          </PageLayout>
        )}

        {/* Technical Analysis - Metrics */}
        {shouldRenderSection("technical_analysis") && (
          <PageLayout pgNo={pgNum++}>
            {data.technical_analysis.monthly_returns &&
              (data.technical_analysis.monthly_returns as any)?.heatmap && (
                <MonthlyReturnsHeatmapTables
                  heatmap={
                    (data.technical_analysis.monthly_returns as any).heatmap
                  }
                />
              )}
            {data.technical_analysis.rolling_sortino_chart && (
              <LineChart
                {...(data.technical_analysis.rolling_sortino_chart as any)}
                className="!min-w-0"
                disableAnimation
              />
            )}
            {data.technical_analysis.risk_metrics && (
              <div className="report-native-table max-w-3xl">
                <RiskMetricsTable
                  data={data.technical_analysis.risk_metrics as any}
                />
              </div>
            )}
          </PageLayout>
        )}

        {/* Fundamental Analysis */}
        {shouldRenderSection("fundamental_analysis") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.fundamental_analysis.analysis} />
            {data.fundamental_analysis.revenue_profit_chart && (
              <FundamentalChart
                data={
                  data.fundamental_analysis
                    .revenue_profit_chart as FundamentalChartData
                }
                disableAnimation
              />
            )}
            {data.fundamental_analysis.margin_chart && (
              <FundamentalChart
                data={
                  data.fundamental_analysis.margin_chart as FundamentalChartData
                }
                disableAnimation
              />
            )}
          </PageLayout>
        )}

        {/* Peer Comparison */}
        {shouldRenderSection("peer_comparison") && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={data.peer_comparison.analysis} />
            {data.peer_comparison.valuation_chart && (
              <PeerComparisonChart
                data={data.peer_comparison.valuation_chart as PeerChartData}
                disableAnimation
              />
            )}
            {data.peer_comparison.profitability_chart && (
              <PeerComparisonChart
                data={
                  data.peer_comparison.profitability_chart as PeerChartData
                }
                disableAnimation
              />
            )}
          </PageLayout>
        )}

        {/* Market Sentiment */}
        {shouldRenderSection("market_sentiment") && (
          <PageLayout pgNo={pgNum++}>
            <FormatNewsSentiment
              section={data.market_sentiment.news_sentiment}
              variant="pdf"
            />
            {data.market_sentiment.conference_call && (
              <FormatSection
                section={data.market_sentiment.conference_call as Section}
              />
            )}
            {data.market_sentiment.corporate_actions && (
              <FormatSection
                section={data.market_sentiment.corporate_actions as Section}
              />
            )}
            <FormatSection
              section={data.market_sentiment.shareholding_pattern}
            />
          </PageLayout>
        )}

        {/* FinSharpe Analysis */}
        {shouldRenderSection("finsharpe_analysis") && fa && (
          <PageLayout pgNo={pgNum++}>
            <FormatSection section={fa.analysis} />
            {radarSections.map((s: ScoreSection, idx: number) => (
              <FinSharpeScoresRadarChart
                key={`radar-${idx}`}
                data={s.scores_comparison}
              />
            ))}
            <ScreenerCoverageBadge
              coverage={fa.screener_coverage}
              showMissing={true}
            />
          </PageLayout>
        )}

        {/* Outlook Section Divider */}
        <SectionDivider title="OUTLOOK" pgNo={pgNum++} />

        {/* Outlook - Summary */}
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
            <FormatSection section={data.outlook.red_flags} />
          </PageLayout>
        )}

        {/* Outlook - Simulation */}
        {shouldRenderSection("outlook") && data.outlook.simulation_chart && (
          <PageLayout pgNo={pgNum++}>
            <SimulationChart
              {...(data.outlook.simulation_chart as any)}
              disableAnimation
            />
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
            Data Sources
          </h3>
          <span className="report-compact-table">
            {sourceSections.map(({ section, key, isNews }, idx, arr) => (
              <div key={`${key}-${idx}`}>
                {isNews ? (
                  <FormatNewsSentimentSourcesAndInDepthAnalysis
                    section={section as Section}
                  />
                ) : (
                  <FormatSectionSourcesAndInDepthAnalysis
                    section={section as Section}
                  />
                )}
                {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
              </div>
            ))}
          </span>
        </div>
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
  const source = formatter.getSource();
  const title = section.title;
  const in_depth_analysis = section.in_depth_analysis;
  const anchorId = formatter.getAnchorId();

  if (!in_depth_analysis && !source) {
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
          {title}
        </a>
      </h6>
      {in_depth_analysis && (
        <MarkdownText>{`<details open><summary>In-depth Analysis</summary>\n\n${in_depth_analysis}\n</details>\n`}</MarkdownText>
      )}
      {source && (
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${splitMarkdownTables(source)}\n</details>\n`}</MarkdownText>
      )}
    </div>
  );
}

function FormatNewsSentimentSourcesAndInDepthAnalysis({
  section,
}: {
  section: Section;
}) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const title = section.title;
  const in_depth_analysis = section.in_depth_analysis;
  const anchorId = formatter.getAnchorId();

  // Check if sources is NewsSourcesContent format
  const isNewsSourcesContent = (
    sources: any,
  ): sources is NewsSourcesContent => {
    return (
      sources &&
      typeof sources === "object" &&
      "content" in sources &&
      Array.isArray(sources.content)
    );
  };

  const hasNewsSources =
    section.sources && isNewsSourcesContent(section.sources);

  if (!in_depth_analysis && !hasNewsSources) {
    return null;
  }

  const renderNewsSources = () => {
    if (!hasNewsSources) return null;

    const sources = section.sources as NewsSourcesContent;
    const newsSources = sources.content;

    if (newsSources.length === 0) {
      return null;
    }

    return (
      <div className="markdown-content chat-container overflow-hidden">
        <details
          open
          className="rounded-lg border border-gray-200 bg-gray-50"
        >
          <summary className="flex cursor-pointer items-center font-medium hover:bg-gray-100">
            <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
            Sources ({newsSources.length} articles)
          </summary>
          <div className="mt-2 space-y-3">
            {newsSources.map((newsItem: NewsSource) => (
              <div
                key={newsItem.dbId}
                className="border-l-2 border-gray-300 py-2 pl-3"
              >
                <a
                  href={newsItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-1 block font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {newsItem.title}
                </a>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span>
                    {new Date(newsItem.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {newsItem.sentimentScore !== 0 && (
                    <span
                      className={
                        newsItem.sentimentScore > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Sentiment: {newsItem.sentimentScore > 0 ? "+" : ""}
                      {newsItem.sentimentScore}
                    </span>
                  )}
                  {newsItem.company?.nse && (
                    <span className="uppercase">{newsItem.company.nse}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  };

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
          {title}
        </a>
      </h6>
      {in_depth_analysis && (
        <MarkdownText>{`<details open><summary>In-depth Analysis</summary>\n\n${in_depth_analysis}\n</details>\n`}</MarkdownText>
      )}
      {renderNewsSources()}
    </div>
  );
}

function FormatSection({
  section,
  displaySources = false,
}: {
  section: Section;
  displaySources?: boolean;
}) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
  const sources = formatter.getSourcesMarkdown();
  const anchorId = formatter.getAnchorId();

  // Check if sources is NewsSourcesContent format
  const isNewsSourcesContent = (
    sources: any,
  ): sources is NewsSourcesContent => {
    return (
      sources &&
      typeof sources === "object" &&
      "content" in sources &&
      Array.isArray(sources.content)
    );
  };

  const hasNewsSources =
    section.sources && isNewsSourcesContent(section.sources);
  const hasRefs = Boolean(
    section.in_depth_analysis || formatter.getSource() || hasNewsSources,
  );

  return (
    <div className="space-y-4">
      <div id={anchorId} />
      <MarkdownText>{title}</MarkdownText>
      {hasRefs && !displaySources && (
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
      {displaySources && <MarkdownText>{sources}</MarkdownText>}
    </div>
  );
}
