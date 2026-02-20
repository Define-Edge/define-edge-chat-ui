import { MarkdownText } from "@/components/thread/markdown-text";
import { JsonDataDisplay } from "@/components/pdfs_templates/shared/JsonDataDisplay";
import { Section, MfAnalysis } from "@/types/mf-analysis";
import MfWelcome from "./MfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";
import { formatKey } from "@/lib/format-utils";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";

export default function MfAnalysisReportMessageComponent({
  analysis,
  selectedSections,
  personalComment,
}: {
  analysis: MfAnalysis;
  selectedSections?: string[];
  personalComment?: string;
}) {
  const { data } = analysis;

  // Helper function to check if a section should be rendered
  const shouldRenderSection = (sectionKey: string) => {
    // If no selectedSections provided, render all sections
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  return (
    <>
      <MfWelcome analysis={analysis} />
      <div
        className="mx-12 max-w-3xl space-y-8 pt-12"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {shouldRenderSection("scheme_overview") && (
          <FormatSection section={data.scheme_overview} />
        )}
        {shouldRenderSection("performance_analysis") && (
          <FormatSection section={data.performance_analysis} />
        )}
        {shouldRenderSection("risk_metrics") && (
          <FormatSection section={data.risk_metrics} />
        )}
        {shouldRenderSection("asset_allocation") && (
          <FormatSection section={data.asset_allocation} />
        )}
        {shouldRenderSection("portfolio_holdings") && (
          <FormatSection section={data.portfolio_holdings} />
        )}
        {shouldRenderSection("sector_distribution") && (
          <FormatSection section={data.sector_distribution} />
        )}
        {shouldRenderSection("fund_manager_profile") && (
          <FormatSection section={data.fund_manager_profile} />
        )}
        {shouldRenderSection("cost_analysis") && (
          <FormatSection section={data.cost_analysis} />
        )}
        {shouldRenderSection("peer_comparison") && (
          <FormatSection section={data.peer_comparison} />
        )}
        {shouldRenderSection("valuation_metrics") && (
          <FormatSection section={data.valuation_metrics} />
        )}
        {shouldRenderSection("conclusion") && (
          <FormatSection section={data.conclusion} />
        )}
        {shouldRenderSection("summary") && (
          <FormatSection section={data.summary} />
        )}
        {shouldRenderSection("finsharpe_scores") && (
          <FormatSection section={data.finsharpe_scores} />
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
        <h3 className="text-3xl font-semibold tracking-tight">
          Data Sources and In-depth Analysis
        </h3>
        <span className="report-compact-table">
          {[
            { section: data.scheme_overview, key: "scheme_overview" },
            { section: data.performance_analysis, key: "performance_analysis" },
            { section: data.risk_metrics, key: "risk_metrics" },
            { section: data.asset_allocation, key: "asset_allocation" },
            { section: data.portfolio_holdings, key: "portfolio_holdings" },
            { section: data.sector_distribution, key: "sector_distribution" },
            { section: data.cost_analysis, key: "cost_analysis" },
            { section: data.peer_comparison, key: "peer_comparison" },
            { section: data.valuation_metrics, key: "valuation_metrics" },
            { section: data.finsharpe_scores, key: "finsharpe_scores" },
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
  // Render JSON data sources nicely
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

