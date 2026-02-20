import { formatKey } from "@/lib/format-utils";

export function JsonDataDisplay({ data }: { data: any }) {
  if (data === null || data === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (typeof data !== "object") {
    return (
      <span className="text-gray-700 dark:text-gray-300">{String(data)}</span>
    );
  }

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

export function formatSources(
  sources: string | string[] | Record<string, any> | null | undefined,
): string {
  if (!sources) return "";

  if (typeof sources === "string") {
    return `<details><summary>Sources</summary>\n\n${sources}\n</details>\n`;
  }

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
      return `<details><summary>Sources</summary>\n\n${sourcesMarkdown}\n</details>\n`;
    }
  }

  return "";
}
