import { MarkdownText } from "@/components/thread/markdown-text";
import { Section, MfAnalysis } from "@/types/mf-analysis";
import MfWelcome from "./MfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";

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
      <div className="mx-12 max-w-3xl space-y-8 pt-12">
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
          ]
            .filter(({ key }) => shouldRenderSection(key))
            .map(({ section }, idx, arr) => (
              <div key={section.title}>
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
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${sourcesMarkdown}\n</details>\n`}</MarkdownText>
      )}
      {sources && typeof sources === "object" && !Array.isArray(sources) && (
        <SourcesDisplay sources={sources} />
      )}
    </div>
  );
}

function FormatSection({ section }: { section: Section }) {
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

// Helper function to convert camelCase/snake_case to Title Case
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
