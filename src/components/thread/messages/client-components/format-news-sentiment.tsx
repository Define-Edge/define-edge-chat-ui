import { MarkdownText } from "@/components/thread/markdown-text";
import { SectionFormatter } from "@/lib/section-formatter";
import { Section, NewsSource, NewsSourcesContent } from "@/types/stock-analysis";
import { ChevronRightIcon } from "lucide-react";

type FormatNewsSentimentProps = {
  section: Section;
  variant?: "default" | "pdf";
  displaySources?: boolean;
};

export function FormatNewsSentiment({
  section,
  variant = "default",
  displaySources = false,
}: FormatNewsSentimentProps) {
  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = variant === "pdf"
    ? `${formatter.getContentMarkdown()}\n---\n`
    : formatter.getContentMarkdown();
  const in_depth_analysis = formatter.getInDepthAnalysisMarkdown();
  const anchorId = variant === "pdf" ? formatter.getAnchorId() : undefined;
  const hasRefs = Boolean(section.in_depth_analysis || formatter.getSource());

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

  const renderNewsSources = () => {
    if (!section.sources || !isNewsSourcesContent(section.sources)) {
      // Fall back to default formatter if not news sources format
      return <MarkdownText>{formatter.getSourcesMarkdown()}</MarkdownText>;
    }

    const newsSources = section.sources.content;

    if (newsSources.length === 0) {
      return null;
    }

    if (variant === "pdf") {
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            Sources ({newsSources.length} articles)
          </p>
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
      );
    }

    // Default interactive variant
    return (
      <div className="markdown-content">
        <details
          open
          className="rounded-lg border border-gray-200 bg-gray-50"
        >
          <summary className="mb-2 flex cursor-pointer items-center text-lg font-medium hover:bg-gray-100">
            <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
            Sources ({newsSources.length} articles)
          </summary>
          <div className="mt-3 space-y-3">
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
                <div className="flex gap-3 text-sm text-gray-600">
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

  if (variant === "pdf") {
    return (
      <div className="space-y-4">
        {anchorId && <div id={anchorId} />}
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
        {displaySources && renderNewsSources()}
      </div>
    );
  }

  // Default variant
  return (
    <div>
      <MarkdownText>{title}</MarkdownText>
      <MarkdownText>{content}</MarkdownText>
      <MarkdownText>{in_depth_analysis}</MarkdownText>
      {renderNewsSources()}
    </div>
  );
}
