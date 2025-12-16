"use client";

import { MfAnalysis, Section } from "@/types/mf-analysis";
import { MarkdownText } from "../../markdown-text";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";

export default function MfAnalysisComponent(analysis: MfAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/download-message", {
        method: "POST",
        body: JSON.stringify({
          threadId: threadId,
          analysisId: analysis.id,
          analysisType: "mf_analysis",
        }),
      });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${analysis.scheme_name}_analysis.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    },
  });

  return (
    <div>
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
      <div className="flex justify-end">
        <Button
          variant="outline"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <DownloadIcon className="h-4 w-4" />
              Download Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function FormatSection({ section }: { section: Section }) {
  const title = `## ${section.title}\n`;
  const content = `${section.content}\n`;
  const in_depth_analysis = section.in_depth_analysis
    ? `<details open><summary>In-depth Analysis</summary>\n\n${section.in_depth_analysis}\n</details>\n`
    : "";

  const sources = formatSources(section.sources);

  const markdown = `${title}${content}${in_depth_analysis}${sources}\n---\n`;

  return (
    <div>
      <MarkdownText>{markdown}</MarkdownText>
      {section.sources &&
        typeof section.sources === "object" &&
        !Array.isArray(section.sources) && (
          <JsonSourcesDisplay sources={section.sources} />
        )}
    </div>
  );
}

function formatSources(
  sources: string | string[] | Record<string, any> | undefined
): string {
  if (!sources) {
    return "";
  }

  // If sources is a string, wrap it in details
  if (typeof sources === "string") {
    return `<details open><summary>Sources</summary>\n\n${sources}\n</details>\n`;
  }

  // If sources is an array of strings (URLs)
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
      return `<details open><summary>Sources</summary>\n\n${sourcesMarkdown}\n</details>\n`;
    }
  }

  // If sources is an object (JSON), it will be rendered separately
  return "";
}

function JsonSourcesDisplay({ sources }: { sources: Record<string, any> }) {
  return (
    <details
      open
      className="mb-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
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
          <li key={idx} className="text-gray-700 dark:text-gray-300">
            <JsonDataDisplay data={item} />
          </li>
        ))}
      </ul>
    );
  }

  // If it's an object, render as a table
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
