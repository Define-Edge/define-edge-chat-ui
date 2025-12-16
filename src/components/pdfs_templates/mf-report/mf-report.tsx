import { MarkdownText } from "@/components/thread/markdown-text";
import { Section, MfAnalysis } from "@/types/mf-analysis";
import MfWelcome from "./MfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";

export default function MfAnalysisReportMessageComponent({
  analysis,
}: {
  analysis: MfAnalysis;
}) {
  const { data } = analysis;
  return (
    <>
      <MfWelcome analysis={analysis} />
      <div className="report-compact-table mx-12 max-w-3xl space-y-8 pt-12">
        <FormatSection section={data.scheme_overview} />
        <FormatSection section={data.performance_analysis} />
        <FormatSection section={data.risk_metrics} />
        <FormatSection section={data.asset_allocation} />
        <FormatSection section={data.portfolio_holdings} />
        <FormatSection section={data.sector_distribution} />
        <FormatSection section={data.fund_manager_profile} />
        <FormatSection section={data.cost_analysis} />
        <FormatSection section={data.peer_comparison} />
        <FormatSection section={data.valuation_metrics} />
        <FormatSection section={data.conclusion} />
        <FormatSection section={data.summary} />

        <div className="mt-8" />
        <hr className="border-t-2 border-gray-800" />
        <div className="mt-8" />
        <h3 className="text-3xl font-semibold tracking-tight">
          Data Sources and In-depth Analysis
        </h3>
        {[
          data.scheme_overview,
          data.performance_analysis,
          data.risk_metrics,
          data.asset_allocation,
          data.portfolio_holdings,
          data.sector_distribution,
          data.cost_analysis,
          data.peer_comparison,
          data.valuation_metrics,
        ].map((section, idx, arr) => (
          <div key={section.title}>
            <FormatSectionSourcesAndInDepthAnalysis section={section} />
            {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
          </div>
        ))}
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
    <div id={`refs-${anchorId}`} className="space-y-2 text-sm">
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
    <details open className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100">
        Sources (Data)
      </summary>
      <div className="mt-4 space-y-4">
        {Object.entries(sources).map(([key, value]) => (
          <div key={key} className="space-y-2">
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
    return <span className="text-gray-700 dark:text-gray-300">{String(data)}</span>;
  }

  // If it's an array
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500">Empty</span>;
    }
    return (
      <ul className="list-inside list-disc space-y-1 text-sm">
        {data.map((item, idx) => (
          <li key={idx} className="text-gray-700 dark:text-gray-300">
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
            <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
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

