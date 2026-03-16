/** Extract a human-readable error message from a FastAPI error response. */
export function extractApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const obj = data as Record<string, unknown>;

  // FastAPI validation error: { detail: [{ msg, type, loc, input }] }
  if (Array.isArray(obj.detail)) {
    return obj.detail
      .map((e: Record<string, unknown>) =>
        typeof e.msg === "string" ? e.msg : JSON.stringify(e),
      )
      .join(". ");
  }

  // FastAPI HTTPException: { detail: "string" }
  if (typeof obj.detail === "string") return obj.detail;

  // Generic: { error: "string" } or { message: "string" }
  if (typeof obj.error === "string") return obj.error;
  if (typeof obj.message === "string") return obj.message;

  return fallback;
}
