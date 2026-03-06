import type {
  FundamentalChartData,
  PeerChartData,
  ScoreSection,
} from "@/api/generated/report-apis/models";
import FinSharpeScoresRadarChart from "@/components/pdfs_templates/pf-report/FinSharpeScoresRadarChart";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import { MarkdownText } from "@/components/thread/markdown-text";
import DrawdownChart from "@/components/thread/messages/client-components/DrawdownChart";
import FundamentalChart from "@/components/thread/messages/client-components/FundamentalChart";
import { FormatNewsSentiment } from "@/components/thread/messages/client-components/format-news-sentiment";
import LineChart from "@/components/thread/messages/client-components/LineChart";
import PeerComparisonChart from "@/components/thread/messages/client-components/PeerComparisonChart";
import RiskMetricsTable from "@/components/thread/messages/client-components/RiskMetricsTable";
import SimulationChart from "@/components/thread/messages/client-components/SimulationChart";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { SectionFormatter } from "@/lib/section-formatter";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import {
  NewsSource,
  NewsSourcesContent,
  Section,
  StockAnalysis,
} from "@/types/stock-analysis";
import { ChevronRightIcon } from "lucide-react";
import Welcome from "../Welcome";

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

  // Define all sections with their rendering components
  const sections = [
    {
      key: "company_overview",
      render: (seqNumber: number) => (
        <>
          <FormatSection
            section={data.company_overview.business_overview}
            seqNumber={seqNumber}
          />
          {data.company_overview.management_strategy && (
            <FormatSection
              section={data.company_overview.management_strategy as Section}
            />
          )}
          <FormatSection section={data.company_overview.sector_outlook} />
        </>
      ),
    },
    {
      key: "technical_analysis",
      render: (seqNumber: number) => (
        <>
          <FormatSection
            section={data.technical_analysis.analysis}
            seqNumber={seqNumber}
          />
          {data.technical_analysis.returns_chart && (
            <LineChart
              {...(data.technical_analysis.returns_chart as any)}
              disableAnimation
            />
          )}
          {data.technical_analysis.drawdown_chart && (
            <DrawdownChart
              data={data.technical_analysis.drawdown_chart as any}
              disableAnimation
            />
          )}
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
              disableAnimation
            />
          )}
          {data.technical_analysis.risk_metrics && (
            <RiskMetricsTable
              data={data.technical_analysis.risk_metrics as any}
            />
          )}
        </>
      ),
    },
    {
      key: "fundamental_analysis",
      render: (seqNumber: number) => (
        <>
          <FormatSection
            section={data.fundamental_analysis.analysis}
            seqNumber={seqNumber}
          />
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
        </>
      ),
    },
    {
      key: "peer_comparison",
      render: (seqNumber: number) => (
        <>
          <FormatSection
            section={data.peer_comparison.analysis}
            seqNumber={seqNumber}
          />
          {data.peer_comparison.valuation_chart && (
            <PeerComparisonChart
              data={data.peer_comparison.valuation_chart as PeerChartData}
              disableAnimation
            />
          )}
          {data.peer_comparison.profitability_chart && (
            <PeerComparisonChart
              data={data.peer_comparison.profitability_chart as PeerChartData}
              disableAnimation
            />
          )}
        </>
      ),
    },
    {
      key: "market_sentiment",
      render: (seqNumber: number) => (
        <>
          <FormatNewsSentiment
            section={data.market_sentiment.news_sentiment}
            variant="pdf"
            seqNumber={seqNumber}
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
        </>
      ),
    },
    {
      key: "finsharpe_analysis",
      render: (seqNumber: number) => {
        if (!data.finsharpe_analysis) return null;
        const fa = data.finsharpe_analysis as any;
        return (
          <>
            <FormatSection section={fa.analysis} seqNumber={seqNumber} />
            {fa.sections?.map((s: ScoreSection, idx: number) => {
              if (s.chart_type === "radar") {
                return (
                  <FinSharpeScoresRadarChart
                    key={idx}
                    data={s.scores_comparison}
                  />
                );
              }
              if (s.chart_type === "gauge") {
                const isRisk = s.title?.toLowerCase().includes("risk");
                const PieComp = isRisk ? RiskScorePie : OverallScorePie;
                return (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-sm font-semibold">{s.title}</h5>
                    {s.summary && (
                      <p className="text-xs text-gray-500">{s.summary}</p>
                    )}
                    <PieComp data={s.chart_data} />
                  </div>
                );
              }
              return null;
            })}
          </>
        );
      },
    },
    {
      key: "outlook",
      render: (seqNumber: number) => (
        <>
          <FormatSection
            section={data.outlook.summary}
            seqNumber={seqNumber}
          />
          <FormatSection section={data.outlook.red_flags} />
          {data.outlook.simulation_chart && (
            <SimulationChart {...(data.outlook.simulation_chart as any)} />
          )}
        </>
      ),
    },
  ];

  // Filter sections based on selection and render with dynamic sequence numbers
  const renderedSections = sections
    .filter(({ key }) => shouldRenderSection(key))
    .map(({ render }, index) => <div key={index}>{render(index + 1)}</div>);

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
      section: data.finsharpe_analysis
        ? (data.finsharpe_analysis as any).analysis
        : null,
      key: "finsharpe_analysis",
    },
  ].filter(({ key, section }) => section && shouldRenderSection(key));

  return (
    <>
      <Welcome analysis={analysis} />
      <div
        className="report-compact-table mx-12 w-3xl space-y-8 pt-12"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {renderedSections}

        {/* Personal Comment Section */}
        {personalComment && (
          <>
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
          </>
        )}

        <div className="mt-8" />
        <hr className="border-t-2 border-gray-800" />
        <div className="mt-8" />
        <h3 className="text-3xl font-semibold tracking-tight">Data Sources</h3>
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
    </>
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
    <div id={`refs-${anchorId}`} className="space-y-2 text-sm">
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
    <div id={`refs-${anchorId}`} className="space-y-2 text-sm">
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
  seqNumber,
}: {
  section: Section;
  displaySources?: boolean;
  seqNumber?: number;
}) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section, seqNumber);
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
