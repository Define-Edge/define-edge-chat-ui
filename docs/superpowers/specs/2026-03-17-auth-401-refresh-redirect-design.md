# Auth 401 Refresh & Redirect Design

## Problem

When `/api/auth/me` returns 401 (backend session invalidated, token expired server-side, etc.), the user is not redirected to the login page and the user menu disappears. The middleware passes the request through because the JWT is locally valid, but the backend rejects it. There is no client-side or server-side recovery mechanism.

## Solution

Server-side auto-refresh in all API proxies, plus a client-side global 401 interceptor that redirects to `/login` when recovery fails.

## Design

### 1. Shared `fetchWithRefresh` helper

**File:** `src/lib/auth/server-refresh.ts` (new)

```typescript
type BackendFetchFn = (accessToken: string, fingerprint?: string) => Promise<Response>;

async function fetchWithRefresh(
  request: NextRequest,
  fetchFn: BackendFetchFn
): Promise<{ response: Response; refreshSetCookieHeaders?: string[] }>
```

**Flow:**

1. Read `access_token` and `fingerprint` cookies from the incoming request.
2. If no access token, return 401 immediately.
3. Call `fetchFn(accessToken, fingerprint)` to hit the backend.
4. If response is not 401, return it as-is.
5. If 401, read `refresh_token` from request cookies and call backend `POST /auth/refresh`.
6. If refresh fails, return the original 401.
7. If refresh succeeds, retry `fetchFn` with the new tokens, build `Set-Cookie` headers for the new tokens (matching the cookie parameters in `cookies.ts`), and return both.

The helper constructs `Set-Cookie` headers directly rather than depending on `NextResponse.cookies`, since the proxy routes return raw `Response` objects. The headers must include all four cookies that `setAuthCookies` sets: `access_token`, `refresh_token`, fingerprint, and `user_info` (with user data from the refresh response). This ensures the client-side `getUserFromCookie()` in AuthProvider continues to work after a transparent refresh.

**Concurrent refresh deduplication:** When multiple API calls fail with 401 simultaneously, each proxy handler would independently trigger `fetchWithRefresh`. If the backend's refresh endpoint is single-use (invalidates the old refresh token), the second refresh attempt would fail. To prevent this, the helper uses a module-level in-flight promise: the first caller to attempt a refresh stores its promise, and concurrent callers await the same promise instead of issuing duplicate refresh requests. The promise is cleared once the refresh completes (success or failure).

**Note:** Deduplication is per-runtime-instance. The `[..._path]` route (Node.js runtime) and `utilities/[..._slug]` route (Edge runtime) do not share module-level state. If both get 401 simultaneously, they may issue separate refresh calls. This is acceptable — the second refresh will fail and the server returns the original 401, which the client-side interceptor handles with a redirect to `/login`.

**Edge runtime constraint:** The `utilities/[..._slug]` route uses `export const runtime = "edge"`. The helper must use only edge-compatible APIs — `NextRequest.cookies` for reading cookies and raw `Set-Cookie` header construction (no Node.js-only APIs like `node:crypto`). Since the helper receives `NextRequest` and constructs string headers, this is naturally satisfied.

### 2. Cookie path change

**File:** `src/lib/auth/cookies.ts`

Change `refresh_token` cookie path from `/api/auth/` to `/api/` in both `setAuthCookies` and `clearAuthCookies`.

**Reason:** The `refresh_token` cookie with `path: "/api/auth/"` is only sent by the browser for `/api/auth/*` URLs. The proxies at `/api/[..._path]` and `/api/utilities/*` never receive it. Widening to `/api/` makes the token available to all API route handlers while still restricting it from page navigations. Since all API routes proxy to the same trusted backend, this is a minimal security trade-off.

### 3. Proxy integration

All three proxy route handlers adopt the same pattern: delegate to `fetchWithRefresh`, then merge any refresh `Set-Cookie` headers into the response.

**`src/app/api/auth/me/route.ts`**

- Replace the manual access token check and backend fetch with `fetchWithRefresh`.
- The factory function calls `BACKEND_URL/auth/me` with the provided access token via `Authorization` header. The fingerprint (`X-Fgp`) is not forwarded here since the current implementation does not send it and the backend does not require it for this endpoint.
- If refresh happened, merge `Set-Cookie` headers into the JSON response.

**`src/app/api/[..._path]/route.ts`**

- Wrap the existing `fetch(url, ...)` inside `fetchWithRefresh`.
- The factory function builds headers the same way it does now, but uses the tokens provided by the helper instead of reading cookies directly.
- Merge refresh `Set-Cookie` headers into the streamed `Response` before returning.
- Streaming still works: `response.status` is checked before piping `response.body`.

**`src/app/api/utilities/[..._slug]/route.ts`**

- Same pattern as `[..._path]`: wrap the backend fetch, use provided tokens, merge cookie headers.

### 4. Global client-side 401 redirect

**File:** `src/providers/AuthProvider.tsx`

Add a global `window.fetch` interceptor on mount that catches 401 from any `/api/*` route and redirects to `/login` via `window.location.href = "/login"`.

```
window.fetch interceptor:
  - Call original fetch
  - If response.status === 401 AND url starts with "/api/"
    AND url does NOT start with "/api/auth/":
      window.location.href = "/login"
  - Return response
```

The entire `/api/auth/` prefix is excluded rather than individual endpoints. All auth endpoints either are unauthenticated (login, register, verify-email) or have their own explicit error handling (refresh, logout). This is simpler and future-proof.

Hard navigation (`window.location.href`) is used instead of `router.push` to clear all client-side state (React Query cache, context providers, stale auth data) when a session dies.

The interceptor is cleaned up on unmount by restoring the original `window.fetch`.

The existing `refreshAuth()` method stays available for manual use (e.g., retry buttons) but is not called during initial hydration since the server already handles refresh.

## Files changed

| File | Change |
|------|--------|
| `src/lib/auth/server-refresh.ts` | New: shared `fetchWithRefresh` helper |
| `src/lib/auth/cookies.ts` | Change `refresh_token` path from `/api/auth/` to `/api/` |
| `src/app/api/auth/me/route.ts` | Use `fetchWithRefresh`, merge cookie headers |
| `src/app/api/[..._path]/route.ts` | Use `fetchWithRefresh`, merge cookie headers |
| `src/app/api/utilities/[..._slug]/route.ts` | Use `fetchWithRefresh`, merge cookie headers |
| `src/providers/AuthProvider.tsx` | Global fetch 401 interceptor, redirect to `/login` |

## What does NOT change

- `src/middleware.ts` — still does local JWT validation
- `UserMenu` — still returns null when user is null (user gets redirected before noticing)
- Login/register/verify-email pages — untouched
- `refreshAuth()` on AuthProvider — stays available for manual use

## Future considerations

- **Middleware-level refresh:** Currently, if the JWT has genuinely expired (past the 900s maxAge), middleware redirects to `/login` before any proxy gets a chance to refresh. A future improvement could have middleware attempt a refresh when `jwtVerify` fails and the `refresh_token` cookie is present, avoiding unnecessary login redirects when only the access token has expired.
