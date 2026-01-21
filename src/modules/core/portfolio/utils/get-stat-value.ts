import { PortfolioMetric } from "../constants/portfolio-metrics";

/**
 * Extract a statistic value from the stats array
 * @param stats Array of stats objects
 * @param metric The metric to extract (from PortfolioMetric enum)
 * @param key The key to look up in the stats object (default: "PORTFOLIO")
 * @returns The value of the statistic or null if not found
 */
export function getStatValue(
  stats: Array<{ [key: string]: unknown }> | undefined,
  metric: PortfolioMetric,
  key: string = "PORTFOLIO",
): number | string | null {
  if (!stats) return null;
  const stat = stats.find((s) => s.Stats === metric);
  return stat ? (stat[key] as number | string) : null;
}
