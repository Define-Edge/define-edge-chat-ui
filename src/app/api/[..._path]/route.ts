import { NextRequest } from "next/server";

const LANGGRAPH_API_URL =
  process.env.LANGGRAPH_API_URL || "http://localhost:2024";
const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY;

const IS_PROD = process.env.NODE_ENV === "production";
const FGP_NAME = IS_PROD ? "__Secure-Fgp" : "fgp";

async function handler(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api/, "");
  const url = new URL(path, LANGGRAPH_API_URL);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);

  // Forward auth cookies as headers
  const accessToken = request.cookies.get("access_token")?.value;
  const fingerprint = request.cookies.get(FGP_NAME)?.value;
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (fingerprint) headers.set("X-Fgp", fingerprint);
  if (LANGSMITH_API_KEY) headers.set("X-Api-Key", LANGSMITH_API_KEY);

  const res = await fetch(url, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
    // @ts-expect-error - duplex is needed for streaming request bodies
    duplex: "half",
  });

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
