const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
  "https://app.finsharpe.com",
].filter(Boolean) as string[];

export function validateOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    throw new Error("Forbidden origin");
  }
}
