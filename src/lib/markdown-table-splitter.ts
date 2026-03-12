/**
 * Utility to split wide markdown tables into multiple smaller tables.
 * Used in PDF rendering to prevent tables from overflowing page boundaries.
 */

interface TableParts {
  headerRow: string[];
  separatorRow: string[];
  dataRows: string[][];
}

/**
 * Parses a markdown table block into its components.
 */
function parseTable(tableLines: string[]): TableParts | null {
  if (tableLines.length < 2) return null;

  const parseRow = (line: string): string[] => {
    // Remove leading/trailing pipes and split by pipe
    const trimmed = line.trim();
    const withoutEdgePipes = trimmed.replace(/^\||\|$/g, "");
    return withoutEdgePipes.split("|").map((cell) => cell.trim());
  };

  const headerRow = parseRow(tableLines[0]);
  const separatorRow = parseRow(tableLines[1]);

  // Validate separator row (should contain dashes, colons for alignment)
  const isSeparator = separatorRow.every((cell) => /^:?-+:?$/.test(cell));
  if (!isSeparator) return null;

  const dataRows = tableLines.slice(2).map(parseRow);

  return { headerRow, separatorRow, dataRows };
}

/**
 * Formats a table back into markdown format.
 */
function formatTable(
  headerRow: string[],
  separatorRow: string[],
  dataRows: string[][]
): string {
  const formatRow = (cells: string[]): string => {
    return "| " + cells.join(" | ") + " |";
  };

  const lines: string[] = [];
  lines.push(formatRow(headerRow));
  lines.push(formatRow(separatorRow));
  dataRows.forEach((row) => {
    lines.push(formatRow(row));
  });

  return lines.join("\n");
}

/**
 * Splits a table with many columns into multiple tables.
 * If `indexColumn` is provided, that column is repeated as the first column
 * in every split part so rows remain identifiable.
 */
function splitTable(
  table: TableParts,
  maxCols: number,
  indexColumn?: string
): string[] {
  const totalCols = table.headerRow.length;

  if (totalCols <= maxCols) {
    return [formatTable(table.headerRow, table.separatorRow, table.dataRows)];
  }

  // Find the index column position (case-insensitive)
  const indexColIdx =
    indexColumn != null
      ? table.headerRow.findIndex(
          (h) => h.toLowerCase() === indexColumn.toLowerCase()
        )
      : -1;

  // Build the list of non-index column indices
  const dataCols = Array.from({ length: totalCols }, (_, i) => i).filter(
    (i) => i !== indexColIdx
  );

  // How many data columns fit per part (reserve 1 slot for the index column)
  const dataColsPerPart = indexColIdx >= 0 ? maxCols - 1 : maxCols;
  const numParts = Math.ceil(dataCols.length / dataColsPerPart);

  const tables: string[] = [];

  for (let part = 0; part < numParts; part++) {
    const startCol = part * dataColsPerPart;
    const endCol = Math.min(startCol + dataColsPerPart, dataCols.length);
    const colIndices = dataCols.slice(startCol, endCol);

    // Prepend the index column if it exists
    const allIndices =
      indexColIdx >= 0 ? [indexColIdx, ...colIndices] : colIndices;

    const partHeader = allIndices.map((i) => table.headerRow[i]);
    const partSeparator = allIndices.map((i) => table.separatorRow[i]);
    const partDataRows = table.dataRows.map((row) =>
      allIndices.map((i) => row[i])
    );

    const tableMarkdown = formatTable(partHeader, partSeparator, partDataRows);
    if (indexColIdx >= 0) {
      tables.push(tableMarkdown);
    } else {
      tables.push(`**(Part ${part + 1}/${numParts})**\n\n${tableMarkdown}`);
    }
  }

  return tables;
}

/**
 * Identifies table blocks in markdown text.
 * A table block is a sequence of consecutive lines starting with '|'.
 */
function identifyTableBlocks(
  lines: string[]
): { start: number; end: number }[] {
  const blocks: { start: number; end: number }[] = [];
  let inTable = false;
  let tableStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableLine = line.startsWith("|");

    if (isTableLine && !inTable) {
      inTable = true;
      tableStart = i;
    } else if (!isTableLine && inTable) {
      inTable = false;
      blocks.push({ start: tableStart, end: i });
    }
  }

  // Handle table at end of content
  if (inTable) {
    blocks.push({ start: tableStart, end: lines.length });
  }

  return blocks;
}

/**
 * Splits wide markdown tables in the given markdown text.
 *
 * @param markdown - The markdown text containing tables
 * @param maxCols - Maximum number of columns per table (default: 8)
 * @param indexColumn - Optional column name to repeat as first column in every split part
 * @returns Modified markdown with wide tables split into multiple tables
 */
export function splitMarkdownTables(
  markdown: string,
  maxCols: number = 8,
  indexColumn?: string
): string {
  if (!markdown) return markdown;

  const lines = markdown.split("\n");
  const tableBlocks = identifyTableBlocks(lines);

  if (tableBlocks.length === 0) {
    return markdown;
  }

  // Process blocks in reverse order to preserve line indices
  const resultLines = [...lines];

  for (let i = tableBlocks.length - 1; i >= 0; i--) {
    const block = tableBlocks[i];
    const tableLines = lines.slice(block.start, block.end);
    const table = parseTable(tableLines);

    if (!table) continue;

    const splitTables = splitTable(table, maxCols, indexColumn);

    if (splitTables.length > 1) {
      // Replace original table with split tables (joined by blank line)
      const replacement = splitTables.join("\n\n");
      resultLines.splice(
        block.start,
        block.end - block.start,
        ...replacement.split("\n")
      );
    }
  }

  return resultLines.join("\n");
}
