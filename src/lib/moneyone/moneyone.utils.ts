import isEmpty from "lodash/isEmpty";

export function getErrMsgKey(e: unknown, key: string) {
  return typeof e === "object" &&
    !isEmpty(e) &&
    key in e &&
    typeof e[key] === "string"
    ? e[key]
    : null;
}

/**
 * Extract a meaningful error message from an unknown error object.
 * Checks multiple common error message fields used by MoneyOne and other APIs.
 */
export function extractErrorMessage(e: unknown): string | null {
  if (typeof e !== "object" || isEmpty(e)) return null;

  const fields = ["errorMsg", "message", "error", "detail", "error_description"];
  for (const field of fields) {
    const value = getErrMsgKey(e, field);
    if (value) return value;
  }

  return null;
}
