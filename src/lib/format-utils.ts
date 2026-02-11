/**
 * Utility functions for formatting strings and data
 */

import { convertToMarkdownTable } from "./convertToMarkdownTable";

/**
 * Converts camelCase or snake_case strings to Title Case
 * Example: "camelCase" -> "Camel Case", "snake_case" -> "Snake Case"
 */
export function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Filters portfolio to display columns and converts to a markdown table.
 * Display columns: symbol/Ticker, weight, and optionally quantity, CMP, value.
 */
export function getPortfolioDisplayTable(
  portfolio?: Record<string, any>[],
): string {
  if (!portfolio || portfolio.length === 0) return "";

  const firstItem = portfolio[0];
  const displayCols: string[] = [];

  // Select symbol/ticker column
  if ("symbol" in firstItem) displayCols.push("symbol");
  else if ("Ticker" in firstItem) displayCols.push("Ticker");

  displayCols.push("weight");

  if ("quantity" in firstItem) displayCols.push("quantity");
  if ("CMP" in firstItem) displayCols.push("CMP");
  if ("value" in firstItem) displayCols.push("value");

  const filteredData = portfolio.map((item) => {
    const filtered: Record<string, any> = {};
    for (const col of displayCols) {
      if (col in item) {
        if (typeof item[col] === "number" && col !== "quantity") {
          // Format weight and value columns as percentages or currency
          filtered[col] =
            col === "weight"
              ? `${item[col].toFixed(2)}%`
              : item[col].toFixed(2);
        } else {
          filtered[col] = item[col];
        }
      }
    }
    return filtered;
  });

  return convertToMarkdownTable(filteredData);
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!Array.isArray(array)) {
    throw new Error("First argument must be an array");
  }
  if (typeof chunkSize !== "number" || chunkSize <= 0) {
    throw new Error("Chunk size must be a positive number");
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
