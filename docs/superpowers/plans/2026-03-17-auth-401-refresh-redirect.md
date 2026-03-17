# Auth 401 Refresh & Redirect Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically refresh expired auth tokens server-side in API proxies and redirect to `/login` client-side when refresh fails.

**Architecture:** A shared `fetchWithRefresh` helper intercepts 401 responses in all three API proxy routes, attempts a token refresh against the backend, retries the original request with new tokens, and returns updated `Set-Cookie` headers. A global `window.fetch` interceptor in `AuthProvider` redirects to `/login` when any `/api/*` call (excluding `/api/auth/*`) returns 401.

**Tech Stack:** Next.js API routes, `NextRequest`/`NextResponse`, `Set-Cookie` header construction, `window.fetch` monkey-patching.

**Spec:** `docs/superpowers/specs/2026-03-17-auth-401-refresh-redirect-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/auth/server-refresh.ts` | Create | Shared `fetchWithRefresh` helper — 401 detection, token refresh, retry, `Set-Cookie` header construction, concurrent refresh deduplication |
| `src/lib/auth/cookies.ts` | Modify (lines 29, 55) | Change `refresh_token` cookie path from `/api/auth/` to `/api/` |
| `src/app/api/auth/me/route.ts` | Modify (full rewrite) | Use `fetchWithRefresh`, forward fingerprint header (bug fix), merge refresh cookies |
| `src/app/api/[..._path]/route.ts` | Modify (lines 10-39) | Use `fetchWithRefresh`, delegate token reading to helper, merge refresh cookies |
| `src/app/api/utilities/[..._slug]/route.ts` | Modify (lines 41-85) | Use `fetchWithRefresh`, delegate token reading to helper, merge refresh cookies |
| `src/providers/AuthProvider.tsx` | Modify (lines 58-102) | Add global `window.fetch` 401 interceptor, remove `useRouter` if unused elsewhere |

---

### Task 1: Change `refresh_token` cookie path

**Files:**
- Modify: `src/lib/auth/cookies.ts:29` and `src/lib/auth/cookies.ts:55`

This must be done first — all subsequent tasks depend on the refresh token being available to all `/api/*` routes.

- [ ] **Step 1: Update `setAuthCookies` — change refresh_token path**

In `src/lib/auth/cookies.ts`, change line 29:

```typescript
// Before
path: "/api/auth/",

// After
path: "/api/",
```

- [ ] **Step 2: Update `clearAuthCookies` — change refresh_token path**

In `src/lib/auth/cookies.ts`, change line 55:

```typescript
// Before
response.cookies.set(name, "", { maxAge: 0, path: name === "refresh_token" ? "/api/auth/" : "/" });

// After
response.cookies.set(name, "", { maxAge: 0, path: name === "refresh_token" ? "/api/" : "/" });
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth/cookies.ts
git commit -m "fix(auth): widen refresh_token cookie path to /api/"
```

---

### Task 2: Create `fetchWithRefresh` helper

**Files:**
- Create: `src/lib/auth/server-refresh.ts`

This is the core of the feature — a shared helper used by all three proxy routes.

- [ ] **Step 1: Create the helper file with types and constants**

Create `src/lib/auth/server-refresh.ts`:

```typescript
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
```

- [ ] **Step 2: Add Set-Cookie header builder**

This function builds raw `Set-Cookie` header strings matching the parameters in `cookies.ts`. It must produce all four cookies: `access_token`, `refresh_token`, fingerprint, and `user_info`.

```typescript
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
```

- [ ] **Step 3: Add concurrent refresh deduplication**

Module-level in-flight promise. First caller stores its promise; concurrent callers await the same one.

```typescript
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
```

- [ ] **Step 4: Add JWT expiry check helper**

Decode the JWT payload (base64, no signature verification needed) and check the `exp` claim. This avoids a wasted backend RTT when the token is expired — we refresh first, then make the original call once.

```typescript
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
```

- [ ] **Step 5: Add the main `fetchWithRefresh` function**

The flow: check if the access token is expired → if so, try refresh before making the backend call → make the original call once with valid tokens. If the call still returns 401 (rare — token revoked), return 401 as-is (client interceptor handles redirect).

```typescript
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
```

- [ ] **Step 6: Add a utility to merge Set-Cookie headers into a Response**

This is used by all three proxy routes to attach refresh cookies to their response.

```typescript
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
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/auth/server-refresh.ts
git commit -m "feat(auth): add fetchWithRefresh helper with dedup and cookie builder"
```

---

### Task 3: Integrate `fetchWithRefresh` into `/api/auth/me`

**Files:**
- Modify: `src/app/api/auth/me/route.ts` (full rewrite — 21 lines)

- [ ] **Step 1: Rewrite the route handler**

Replace the entire file with:

```typescript
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
```

Note: this also fixes the missing `X-Fgp` fingerprint forwarding.

- [ ] **Step 2: Verify the dev server starts without errors**

Run: `pnpm dev` — check for compilation errors on the `/api/auth/me` route.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/me/route.ts
git commit -m "feat(auth): use fetchWithRefresh in /api/auth/me, forward fingerprint"
```

---

### Task 4: Integrate `fetchWithRefresh` into `/api/[..._path]`

**Files:**
- Modify: `src/app/api/[..._path]/route.ts:10-39`

- [ ] **Step 1: Refactor the handler to use `fetchWithRefresh`**

The handler currently reads cookies directly (lines 18-19) and builds the fetch. Refactor so the factory function receives tokens from the helper.

**Important:** `request.body` is a `ReadableStream` that can only be consumed once. Since `fetchWithRefresh` may call the factory function twice (first attempt + retry after refresh), we must buffer the body as `ArrayBuffer` before the first call. This also removes the need for `duplex: "half"`.

Replace the entire file with:

```typescript
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

  // Buffer the body so it can be re-sent on refresh retry.
  // ReadableStream can only be consumed once.
  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

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
        body,
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
```

Note: the `IS_PROD` and `FGP_NAME` constants are removed — token reading is now delegated to `fetchWithRefresh`. The `duplex: "half"` workaround is no longer needed since we buffer the body as `ArrayBuffer`.

- [ ] **Step 2: Verify the dev server starts without errors**

Run: `pnpm dev` — check for compilation errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/[..._path]/route.ts"
git commit -m "feat(auth): use fetchWithRefresh in LangGraph passthrough proxy"
```

---

### Task 5: Integrate `fetchWithRefresh` into `/api/utilities/[..._slug]`

**Files:**
- Modify: `src/app/api/utilities/[..._slug]/route.ts:41-85`

- [ ] **Step 1: Refactor `handleRequest` to use `fetchWithRefresh`**

Replace the auth header construction (lines 41-67) and response handling (lines 69-85) with `fetchWithRefresh`. The `runtime = "edge"` export stays.

**Important:** Same as Task 4 — buffer `request.body` as `ArrayBuffer` before passing to `fetchWithRefresh` so it can be re-sent on retry.

Replace the entire file with (keeping the exported handlers at the bottom unchanged):

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  fetchWithRefresh,
  mergeSetCookieHeaders,
} from "@/lib/auth/server-refresh";

export const runtime = "edge";

async function handleRequest(
  request: NextRequest,
  params: { _slug: string[] },
) {
  try {
    const backendUrl = process.env.LANGGRAPH_API_URL;
    const apiKey = process.env.LANGSMITH_API_KEY;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 },
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const path = params._slug.join("/");
    const targetUrl = `${backendUrl.replace(/\/$/, "")}/api/${path}`;

    const searchParams = new URL(request.url).searchParams;
    const url = new URL(targetUrl);
    searchParams.forEach((value, key) => {
      if (key !== "_slug") {
        url.searchParams.append(key, value);
      }
    });

    // Buffer the body so it can be re-sent on refresh retry.
    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : undefined;

    const { response, refreshSetCookieHeaders } = await fetchWithRefresh(
      request,
      (accessToken, fingerprint) => {
        const headers: Record<string, string> = {};
        headers["apiKey"] = apiKey;
        headers["Accept"] = "application/json";
        headers["Authorization"] = `Bearer ${accessToken}`;
        if (fingerprint) headers["X-Fgp"] = fingerprint;

        if (request.headers.get("content-type")) {
          headers["Content-Type"] = request.headers.get("content-type")!;
        }

        return fetch(url.toString(), {
          method: request.method,
          headers,
          body,
        });
      },
    );

    const text = await response.text();

    if (!text.trim()) {
      return mergeSetCookieHeaders(
        NextResponse.json({ data: null }, { status: response.status }),
        refreshSetCookieHeaders,
      );
    }

    return mergeSetCookieHeaders(
      new Response(text, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") || "application/json",
          "Cache-Control":
            response.headers.get("Cache-Control") || "no-cache",
        },
      }),
      refreshSetCookieHeaders,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected exception";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

The exported GET/POST/PUT/PATCH/DELETE/OPTIONS functions (lines 93-139) stay exactly as they are.

- [ ] **Step 2: Verify the dev server starts without errors**

Run: `pnpm dev` — check for compilation errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/utilities/[..._slug]/route.ts"
git commit -m "feat(auth): use fetchWithRefresh in utilities proxy"
```

---

### Task 6: Add global 401 redirect in AuthProvider

**Files:**
- Modify: `src/providers/AuthProvider.tsx:58-102`

- [ ] **Step 1: Add the `window.fetch` interceptor**

Inside `AuthProvider`, add a `useEffect` that patches `window.fetch` and cleans up on unmount. Also update the existing mount `useEffect` to no longer need its own 401 handling (the interceptor covers it).

Replace the `AuthProvider` function (lines 58-102) with:

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CookieUser | UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Global 401 interceptor — redirect to /login when any /api/* call
  // (except /api/auth/*) returns 401. At this point the server-side
  // fetchWithRefresh has already attempted a token refresh, so 401
  // means the session is truly dead.
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);
      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof Request
            ? args[0].url
            : "";
      if (
        response.status === 401 &&
        url.startsWith("/api/") &&
        !url.startsWith("/api/auth/")
      ) {
        window.location.href = "/login";
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Hydrate user from cookie, then from /api/auth/me
  useEffect(() => {
    const cookieUser = getUserFromCookie();
    if (cookieUser) setUser(cookieUser);

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.user) setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshAuth,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

Key changes:
- New `useEffect` with `window.fetch` interceptor
- `logout` uses `window.location.href` instead of `router.push`
- `useRouter` import and `router` dependency removed (check if used elsewhere in file first — it is not)

- [ ] **Step 2: Remove the unused `useRouter` import**

Remove from the import block (line 11):
```typescript
// Remove this line:
import { useRouter } from "next/navigation";
```

- [ ] **Step 3: Verify the dev server starts without errors**

Run: `pnpm dev` — check for compilation errors.

- [ ] **Step 4: Commit**

```bash
git add src/providers/AuthProvider.tsx
git commit -m "feat(auth): add global 401 redirect interceptor in AuthProvider"
```

---

### Task 7: Manual integration test

No automated tests in this project for API routes. Verify manually.

- [ ] **Step 1: Test happy path — valid session**

1. Log in normally
2. Verify `/api/auth/me` returns 200
3. Verify user menu appears in sidebar and mobile nav
4. Verify LangGraph chat works (messages send/receive)

- [ ] **Step 2: Test refresh path — expired access token, valid refresh token**

1. Log in, then manually delete the `access_token` cookie from browser DevTools (keep `refresh_token`)
2. Refresh the page
3. Expected: `/api/auth/me` should succeed (server refreshes transparently), user menu appears, new `access_token` cookie is set

- [ ] **Step 3: Test redirect path — no valid tokens**

1. Log in, then delete ALL auth cookies from browser DevTools (`access_token`, `refresh_token`, `fgp`/`__Secure-Fgp`, `user_info`)
2. Refresh the page
3. Expected: redirected to `/login`

- [ ] **Step 4: Test utility API 401 redirect**

1. Log in, navigate to a page that calls `/api/utilities/*`
2. Delete all auth cookies
3. Trigger a utility API call
4. Expected: redirected to `/login`

- [ ] **Step 5: Run lint**

```bash
pnpm lint
```

- [ ] **Step 6: Run build**

```bash
pnpm build
```
