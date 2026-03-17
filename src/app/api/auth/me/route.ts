import { NextRequest, NextResponse } from "next/server";
import {
  fetchWithRefresh,
  mergeSetCookieHeaders,
} from "@/lib/auth/server-refresh";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:2024";

export async function GET(request: NextRequest) {
  const { response, refreshSetCookieHeaders } = await fetchWithRefresh(
    request,
    (accessToken, fingerprint) => {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
      };
      if (fingerprint) headers["X-Fgp"] = fingerprint;
      return fetch(`${BACKEND_URL}/auth/me`, { headers });
    },
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await response.json();
  const jsonResponse = NextResponse.json(data);
  return mergeSetCookieHeaders(jsonResponse, refreshSetCookieHeaders);
}
