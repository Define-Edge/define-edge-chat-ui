import { MarkdownText } from "@/components/thread/markdown-text";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import SimulationChart from "@/components/thread/messages/client-components/SimulationChart";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { SectionFormatter } from "@/lib/section-formatter";
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
      key: "business_overview",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.business_overview}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "management_strategy",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.management_strategy}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "sector_outlook",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.sector_outlook}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "technical_analysis",
      render: (seqNumber: number) => (
        <FormatTechnicalSection
          section={data.technical_analysis}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "fundamental_analysis",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.fundamental_analysis}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "peer_comparison",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.peer_comparison}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "conference_call_analysis",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.conference_call_analysis}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "shareholding_pattern",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.shareholding_pattern}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "corporate_actions",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.corporate_actions}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "news_sentiment",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.news_sentiment}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "red_flags",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.red_flags}
          seqNumber={seqNumber}
        />
      ),
    },
    {
      key: "summary",
      render: (seqNumber: number) => (
        <FormatSection
          section={data.summary}
          seqNumber={seqNumber}
        />
      ),
    },
  ];

  // Filter sections based on selection and render with dynamic sequence numbers
  const renderedSections = sections
    .filter(({ key }) => shouldRenderSection(key))
    .map(({ render }, index) => <div key={index}>{render(index + 1)}</div>);

  return (
    <>
      <Welcome analysis={analysis} />
      <div
        className="report-compact-table mx-12 w-3xl space-y-8 pt-12"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {renderedSections}
        {shouldRenderSection("simulation_chart") &&
          Boolean(data.simulation_chart) && (
            <SimulationChart {...data.simulation_chart} />
          )}

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
          {[
            { section: data.business_overview, key: "business_overview" },
            { section: data.management_strategy, key: "management_strategy" },
            { section: data.sector_outlook, key: "sector_outlook" },
            { section: data.technical_analysis, key: "technical_analysis" },
            { section: data.fundamental_analysis, key: "fundamental_analysis" },
            { section: data.peer_comparison, key: "peer_comparison" },
            {
              section: data.conference_call_analysis,
              key: "conference_call_analysis",
            },
            { section: data.shareholding_pattern, key: "shareholding_pattern" },
            { section: data.corporate_actions, key: "corporate_actions" },
            { section: data.news_sentiment, key: "news_sentiment" },
          ]
            .filter(({ key }) => shouldRenderSection(key))
            .map(({ section }, idx, arr) => {
              const isNewsSentiment =
                section.title === data.news_sentiment.title;
              return (
                <div key={section.title}>
                  {isNewsSentiment ? (
                    <FormatNewsSentimentSourcesAndInDepthAnalysis
                      section={section}
                    />
                  ) : (
                    <FormatSectionSourcesAndInDepthAnalysis section={section} />
                  )}
                  {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
                </div>
              );
            })}
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

function FormatTechnicalSection({
  section,
  returns_line_chart,
  seqNumber,
}: {
  section: Section;
  returns_line_chart?: Record<string, any>;
  seqNumber?: number;
}) {
  const formatter = new SectionFormatter(section, seqNumber);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
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
      {returns_line_chart && (
        <ClientComponentsRegistry.line_chart {...returns_line_chart} />
      )}
      <MarkdownText>{content}</MarkdownText>
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
