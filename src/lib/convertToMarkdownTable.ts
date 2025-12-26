export const convertToMarkdownTable = (data: Record<string, any>[]) => {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = data
    .map((row) => {
      const values = headers.map((header) => row[header]);
      return `| ${values.join(" | ")} |`;
    })
    .join("\n");

  return `${headerRow}\n${separatorRow}\n${bodyRows}`;
}; 