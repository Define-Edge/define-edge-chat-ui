# Middleware: Switch to refresh_token presence check — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace access_token JWT verification in middleware with a refresh_token presence check so users with valid sessions aren't bounced to /login when their short-lived access token expires.

**Architecture:** Middleware becomes a lightweight gate — check if refresh_token cookie exists, allow through or redirect. Real auth validation stays in API routes via fetchWithRefresh. Cookie path for refresh_token widened from /api/ to / so middleware can read it.

**Tech Stack:** Next.js middleware, HTTP cookies

**Spec:** `docs/superpowers/specs/2026-03-17-middleware-refresh-token-design.md`

---

> **Deployment note:** All changes below MUST be deployed together. The middleware reads refresh_token at path `/`, which requires the cookie path widening. Partial deployment will break auth.

> **Existing sessions:** After deployment, users with active sessions will have their refresh_token cookie scoped to the old `Path=/api/`. The middleware at `/` won't see it, so they'll be redirected to `/login` once. After re-login, the new `Path=/` cookie is set and everything works. The old `/api/`-scoped cookie lingers (harmless, HttpOnly) until it expires in 7 days.

---

### Task 1: Switch middleware to refresh_token presence check and widen cookie path

**Files:**
- Modify: `src/middleware.ts` (entire file — remove jose, switch to presence check)
- Modify: `src/lib/auth/cookies.ts:29` (setAuthCookies — change path)
- Modify: `src/lib/auth/cookies.ts:55` (clearAuthCookies — simplify path)
- Modify: `src/lib/auth/server-refresh.ts:39` (buildRefreshSetCookieHeaders — change path)
- Remove dependency: `jose` from `package.json`

- [ ] **Step 1: Replace middleware implementation**

Replace the entire `src/middleware.ts`. Remove `jose` import and `JWT_SECRET`. Change from access_token JWT verification to refresh_token presence check:

```typescript
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/welcome"];
const PUBLIC_PREFIXES = ["/api/", "/_next/", "/favicon.ico"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Note: function is no longer `async` since there's no `await`.

- [ ] **Step 2: Update setAuthCookies in cookies.ts**

In `src/lib/auth/cookies.ts` line 29, change:
```typescript
      path: "/api/",
```
to:
```typescript
      path: "/",
```

- [ ] **Step 3: Update clearAuthCookies in cookies.ts**

In `src/lib/auth/cookies.ts` line 55, change:
```typescript
  for (const name of ["access_token", "refresh_token", FGP_COOKIE_NAME, "user_info"]) {
    response.cookies.set(name, "", { maxAge: 0, path: name === "refresh_token" ? "/api/" : "/" });
  }
```
to:
```typescript
  for (const name of ["access_token", "refresh_token", FGP_COOKIE_NAME, "user_info"]) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
```

- [ ] **Step 4: Update buildRefreshSetCookieHeaders in server-refresh.ts**

In `src/lib/auth/server-refresh.ts` line 39, change:
```typescript
    `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/api/; Max-Age=604800; SameSite=Strict${secure}`,
```
to:
```typescript
    `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${secure}`,
```

- [ ] **Step 5: Remove jose dependency**

Run: `pnpm remove jose`

- [ ] **Step 6: Verify the app builds**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add src/middleware.ts src/lib/auth/cookies.ts src/lib/auth/server-refresh.ts package.json pnpm-lock.yaml
git commit -m "feat(auth): switch middleware to refresh_token presence check, widen cookie path"
```
