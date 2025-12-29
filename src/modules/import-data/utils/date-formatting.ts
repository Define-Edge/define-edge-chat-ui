/**
 * Format a date string to a human-readable relative time string
 * Returns undefined if no date is provided
 */
export function formatLastUpdated(date?: string): string | undefined {
  if (!date) return undefined;

  const createdAt = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return "Just now";
}
