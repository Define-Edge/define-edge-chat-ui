/**
 * Format a metric value to 2 decimal places
 * @param value The value to format
 * @param fallback The fallback string to return if value is invalid (default: "--")
 * @returns The formatted string
 */
export const formatMetric = (
  value: number | string | null | undefined,
  fallback: string = "--",
): string => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num.toFixed(2);
};
