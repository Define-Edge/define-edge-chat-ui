# Middleware: Switch from access_token to refresh_token check

**Date:** 2026-03-17
**Status:** Approved

## Problem

The middleware (`src/middleware.ts`) currently verifies the `access_token` JWT on every page navigation. Since the access token is short-lived (15 minutes), users with a valid session (7-day refresh token) get redirected to `/login` when their access token expires — even though `fetchWithRefresh` in API routes would seamlessly refresh it.

## Decision

Replace the access_token JWT verification in middleware with a simple refresh_token **presence check**. The middleware is a lightweight gate, not a security boundary. Real token validation happens in API routes via `fetchWithRefresh`, and the global 401 interceptor in `AuthProvider` handles revoked/expired sessions.

## Approach: Presence check only

- Middleware checks if `refresh_token` cookie exists
- Present → allow through
- Absent → redirect to `/login`
- No cryptographic verification, no backend calls

**Why not JWT verify the refresh token?** The refresh token format is backend-determined (may be opaque, not JWT). Even if it were JWT, middleware can't detect server-side revocation. The 401 interceptor already covers that case.

**Why not call the backend from middleware?** Adds network latency to every page load. Over-engineered given the existing 401 interceptor.

## Changes

### 1. `src/middleware.ts`

- Remove `jose` import and `JWT_SECRET` constant (no more cryptographic verification)
- Remove `access_token` cookie read entirely
- Read `refresh_token` cookie instead
- If present → `NextResponse.next()`
- If absent → redirect to `/login`
- Keep `PUBLIC_PATHS`, `PUBLIC_PREFIXES`, `isPublicPath()`, and `config.matcher` unchanged

### 2. `src/lib/auth/cookies.ts`

- Change `refresh_token` cookie path from `/api/` to `/` in `setAuthCookies`
- Change `refresh_token` cookie path from `/api/` to `/` in `clearAuthCookies`

### 3. `src/lib/auth/server-refresh.ts`

- Update manually-built Set-Cookie header for `refresh_token` path from `/api/` to `/`

## Security considerations

- `refresh_token` remains HttpOnly + SameSite=strict + Secure (prod)
- **CSRF analysis:** Widening path to `/` means the cookie is sent on all same-site page navigations, but `SameSite=strict` prevents cross-origin requests from including it. The refresh_token is only consumed by POST endpoints (`/api/auth/refresh`, `/api/auth/logout`) which validate origin. Additionally, `fetchWithRefresh` sends the token to the backend via the `X-Refresh-Token` header, not as a cookie — so even if the browser sends the cookie, the backend doesn't accept it as a cookie-based credential. Practical CSRF risk: negligible.
- **Flash of protected content:** With the access_token check, the maximum window before redirect was 15 minutes (access_token lifetime). With the refresh_token presence check, this window increases to 7 days (refresh_token cookie lifetime). In practice, the flash is bounded by the first API call on page mount — `AuthProvider` calls `/api/auth/me` on mount, and no user-specific data is in the SSR HTML (client-rendered SPA). The user sees the page shell briefly before the 401 interceptor redirects.
- The actual security boundary stays in API routes via `fetchWithRefresh`

## Files unchanged

- `AuthProvider` — no changes needed
- `/api/auth/refresh/route.ts` — reads `refresh_token` cookie; still works because `Path=/` is a superset of the old `Path=/api/`
- `/api/auth/logout/route.ts` — same reasoning as above
- `fetchWithRefresh` logic — no changes needed
- LangGraph/utilities proxy routes — no changes needed
