import { NextRequest } from "next/server";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:2024";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const FGP_COOKIE_NAME = IS_PRODUCTION ? "__Secure-Fgp" : "fgp";

/**
 * A function that makes the backend request given auth tokens.
 * Receives the access token and optional fingerprint so callers don't
 * read cookies directly — the helper manages token state.
 */
export type BackendFetchFn = (
  accessToken: string,
  fingerprint?: string,
) => Promise<Response>;

export interface FetchWithRefreshResult {
  response: Response;
  /** Set-Cookie headers to merge into the final response when tokens were refreshed. */
  refreshSetCookieHeaders?: string[];
}

interface RefreshTokens {
  access_token: string;
  refresh_token: string;
  fingerprint: string;
  user: { id: string; name: string; roles: string[] };
}

function buildRefreshSetCookieHeaders(tokens: RefreshTokens): string[] {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  const headers: string[] = [];

  headers.push(
    `access_token=${tokens.access_token}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax${secure}`,
  );

  headers.push(
    `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/api/; Max-Age=604800; SameSite=Strict${secure}`,
  );

  headers.push(
    `${FGP_COOKIE_NAME}=${tokens.fingerprint}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${secure}`,
  );

  const userInfo = JSON.stringify({
    id: tokens.user.id,
    name: tokens.user.name,
    roles: tokens.user.roles,
  });
  headers.push(
    `user_info=${encodeURIComponent(userInfo)}; Path=/; Max-Age=900; SameSite=Lax${secure}`,
  );

  return headers;
}

let inflightRefresh: Promise<RefreshTokens | null> | null = null;

async function refreshTokens(refreshToken: string): Promise<RefreshTokens | null> {
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Refresh-Token": refreshToken,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    fingerprint: data.fingerprint,
    user: data.user,
  };
}

async function deduplicatedRefresh(refreshToken: string): Promise<RefreshTokens | null> {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = refreshTokens(refreshToken).finally(() => {
    inflightRefresh = null;
  });

  return inflightRefresh;
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return false;
    // Consider expired if within 30s of expiry (clock skew buffer)
    return payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

export async function fetchWithRefresh(
  request: NextRequest,
  fetchFn: BackendFetchFn,
): Promise<FetchWithRefreshResult> {
  let accessToken = request.cookies.get("access_token")?.value;
  let fingerprint: string | undefined = request.cookies.get(FGP_COOKIE_NAME)?.value;
  let refreshSetCookieHeaders: string[] | undefined;

  // If no access token or token is expired, try refreshing first
  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return {
        response: new Response(JSON.stringify({ error: "Not authenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }

    const tokens = await deduplicatedRefresh(refreshToken);
    if (!tokens) {
      return {
        response: new Response(JSON.stringify({ error: "Session expired" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }

    accessToken = tokens.access_token;
    fingerprint = tokens.fingerprint;
    refreshSetCookieHeaders = buildRefreshSetCookieHeaders(tokens);
  }

  // Make the original call once with valid (or freshly refreshed) tokens
  const response = await fetchFn(accessToken, fingerprint);

  return { response, refreshSetCookieHeaders };
}

export function mergeSetCookieHeaders(
  response: Response,
  setCookieHeaders?: string[],
): Response {
  if (!setCookieHeaders?.length) return response;

  const newHeaders = new Headers(response.headers);
  for (const header of setCookieHeaders) {
    newHeaders.append("Set-Cookie", header);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
