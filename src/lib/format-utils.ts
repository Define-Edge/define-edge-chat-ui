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
 * Filters portfolio items to only display-relevant entries.
 * For mutual_fund portfolios, removes NAV-level tracking items (identifier_type === "symbol").
 * For stock portfolios (or undefined type), returns as-is.
 */
export function getDisplayPortfolio(
  portfolio: Record<string, any>[],
  portfolioType?: string,
): Record<string, any>[] {
  if (portfolioType === "mutual_fund") {
    return portfolio.filter((item) => item.identifier_type !== "symbol");
  }
  return portfolio;
}

/**
 * Filters portfolio to display columns and converts to a markdown table.
 * Display columns: symbol/Ticker, weight, and optionally quantity, CMP, value.
 * For mutual_fund portfolios: shows Scheme_Name, Sebi_Category, weight, and MF score columns.
 */
export function getPortfolioDisplayTable(
  portfolio?: Record<string, any>[],
  portfolioType?: string,
): string {
  if (!portfolio || portfolio.length === 0) return "";

  // Filter to display items only
  const displayItems =
    portfolioType === "mutual_fund"
      ? portfolio.filter((item) => item.identifier_type !== "symbol")
      : portfolio;

  if (displayItems.length === 0) return "";

  const firstItem = displayItems[0];

  // Mutual fund flow
  if (portfolioType === "mutual_fund") {
    const mfScoreCols = [
      { key: "PerformanceScore", display: "Performance" },
      { key: "RiskAdjReturn", display: "Risk-Adj Return" },
      { key: "RiskScore", display: "Risk Score" },
    ] as const;
    const presentMfScoreCols = mfScoreCols.filter((col) =>
      displayItems.some((item) => col.key in item),
    );

    const filteredData = displayItems.map((item) => {
      const filtered: Record<string, any> = {};
      if ("Scheme_Name" in item) filtered["Scheme Name"] = item.Scheme_Name;
      if ("Sebi_Category" in item)
        filtered["SEBI Category"] = item.Sebi_Category;
      if ("weight" in item) filtered["Weight"] = `${item.weight.toFixed(2)}%`;
      for (const col of presentMfScoreCols) {
        filtered[col.display] =
          item[col.key] != null ? Number(item[col.key]).toFixed(1) : "N/A";
      }
      return filtered;
    });

    return convertToMarkdownTable(filteredData);
  }

  // Stock flow (existing logic)
  const displayCols: string[] = [];

  // Select symbol/ticker column
  if ("symbol" in firstItem) displayCols.push("symbol");
  else if ("Ticker" in firstItem) displayCols.push("Ticker");

  displayCols.push("weight");

  if ("quantity" in firstItem) displayCols.push("quantity");

  // FinSharpe score columns – include if any stock in the portfolio has them
  const finsharpeScoreCols = [
    "FinSharpe_Overall_Score",
    "FinSharpe_Growth_Score",
    "FinSharpe_Performance_Score",
    "FinSharpe_Value_Score",
    "FinSharpe_Risk_Score",
  ] as const;
  const finsharpeDisplayNames: Record<string, string> = {
    FinSharpe_Overall_Score: "FinSharpe Overall",
    FinSharpe_Growth_Score: "FinSharpe Growth",
    FinSharpe_Performance_Score: "FinSharpe Performance",
    FinSharpe_Value_Score: "FinSharpe Value",
    FinSharpe_Risk_Score: "FinSharpe Risk",
  };
  const presentFsColumns = finsharpeScoreCols.filter((col) =>
    displayItems.some((item) => col in item),
  );

  const filteredData = displayItems.map((item) => {
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
    for (const col of presentFsColumns) {
      const displayName = finsharpeDisplayNames[col];
      filtered[displayName] =
        item[col] != null ? Number(item[col]).toFixed(1) : "N/A";
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
