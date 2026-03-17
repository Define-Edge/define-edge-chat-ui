import { NextRequest } from "next/server";
import {
  fetchWithRefresh,
  mergeSetCookieHeaders,
} from "@/lib/auth/server-refresh";

const LANGGRAPH_API_URL =
  process.env.LANGGRAPH_API_URL || "http://localhost:2024";
const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY;

async function handler(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api/, "");
  const url = new URL(path, LANGGRAPH_API_URL);
  url.search = request.nextUrl.search;

  const { response, refreshSetCookieHeaders } = await fetchWithRefresh(
    request,
    (accessToken, fingerprint) => {
      const headers = new Headers(request.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      if (fingerprint) headers.set("X-Fgp", fingerprint);
      if (LANGSMITH_API_KEY) headers.set("X-Api-Key", LANGSMITH_API_KEY);

      return fetch(url, {
        method: request.method,
        headers,
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? request.body
            : undefined,
        // @ts-expect-error - duplex is needed for streaming request bodies
        duplex: "half",
      });
    },
  );

  return mergeSetCookieHeaders(
    new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }),
    refreshSetCookieHeaders,
  );
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
