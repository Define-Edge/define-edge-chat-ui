import { MarkdownText } from "@/components/thread/markdown-text";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import { SectionFormatter } from "@/lib/section-formatter";
import {
  Section,
  StockAnalysis,
  NewsSource,
  NewsSourcesContent,
} from "@/types/stock-analysis";
import Welcome from "../Welcome";
import SimulationChart from "@/components/thread/messages/client-components/SimulationChart";
import { ChevronRightIcon } from "lucide-react";

export default function StockAnalysisReportMessageComponent({
  analysis,
}: {
  analysis: StockAnalysis;
}) {
  const { data } = analysis;
  return (
    <>
      <Welcome analysis={analysis} />
      <div className="report-compact-table mx-12 max-w-3xl space-y-8 pt-12">
        <FormatSection section={data.business_overview} />
        <FormatSection
          section={data.management_strategy}
          displaySources
        />
        <FormatSection section={data.sector_outlook} />
        <FormatTechnicalSection section={data.technical_analysis} />
        <FormatSection section={data.fundamental_analysis} />
        {/* <FormatSection section={data.stats_analysis} /> */}
        <FormatSection section={data.peer_comparison} />
        <FormatSection
          section={data.conference_call_analysis}
          displaySources
        />
        <FormatSection
          section={data.shareholding_pattern}
          displaySources
        />
        <FormatSection section={data.corporate_actions} />
        <FormatSection section={data.news_sentiment} />
        <FormatSection section={data.red_flags} />
        <FormatSection section={data.summary} />
        <SimulationChart {...data.simulation_chart} />

        <div className="mt-8" />
        <hr className="border-t-2 border-gray-800" />
        <div className="mt-8" />
        <h3 className="text-3xl font-semibold tracking-tight">Data Sources</h3>
        {[
          data.technical_analysis,
          data.fundamental_analysis,
          // data.stats_analysis,
          data.peer_comparison,
          data.corporate_actions,
          data.news_sentiment,
        ].map((section, idx, arr) => {
          const isNewsSentiment = section.title === data.news_sentiment.title;
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
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${source}\n</details>\n`}</MarkdownText>
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
}: {
  section: Section;
  returns_line_chart?: Record<string, any>;
}) {
  const formatter = new SectionFormatter(section);
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
}: {
  section: Section;
  displaySources?: boolean;
}) {
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
