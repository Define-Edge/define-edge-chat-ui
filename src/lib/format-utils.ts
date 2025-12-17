/**
 * Utility functions for formatting strings and data
 */

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
