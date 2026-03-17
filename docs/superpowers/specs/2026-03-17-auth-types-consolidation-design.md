# Auth Types Consolidation

**Date**: 2026-03-17
**Status**: Approved
**Scope**: Consolidate auth types to use orval-generated models as single source of truth; delete manual mutation hooks in favor of inline `useMutation` at call sites.

## Problem

Three layers of type duplication exist across the auth system:

| Layer | Types | Location |
|-------|-------|----------|
| Generated (orval) | `UserResponse`, `AuthTokenResponse`, `LoginRequest`, etc. | `src/api/generated/auth-apis/models/` |
| Manual module | `AuthResponse` (hand-written), Zod schemas | `src/modules/auth/types/auth.types.ts` |
| Server-side | `AuthTokens` (hand-written, loose) | `src/lib/auth/cookies.ts` |
| AuthProvider | `CookieUser` (derived from `UserResponse`) | `src/providers/AuthProvider.tsx` |

Additionally, orval generates mutation hooks (`useLoginAuthLoginPost`, etc.) in `src/api/generated/auth-apis/auth/auth.ts`, but these are unused. Instead, manual hooks in `src/modules/auth/hooks/` duplicate the same functionality with hand-written types.

**Key constraint**: The generated hooks cannot be used directly because they type responses against the backend OpenAPI spec (`AuthTokenResponse` with tokens), but the client hits Next.js proxy routes that strip tokens into cookies and return simplified shapes (e.g., `{ user: UserResponse }`).

## Design Decisions

1. **Use generated model types as single source of truth** — all types trace back to the OpenAPI spec via orval
2. **Delete manual mutation hooks** — replace with inline `useMutation` at call sites
3. **Define proxy response types** composed from generated models to describe what the Next.js proxy routes actually return
4. **Type guard for progressive hydration** — `isHydratedUser()` narrows `CookieUser | UserResponse` to `UserResponse` using `email` as discriminant

## Type System

### Generated types (unchanged, source of truth)

From `src/api/generated/auth-apis/models/`:
- `UserResponse` — `{ id: string, name: string | null, email: string, image?: string | null, roles: string[], institutionId?: string | null }`
  - Note: `name`, `image`, `institutionId` use wrapper types (`UserResponseName`, etc.) which resolve to `string | null`
- `AuthTokenResponse` — `{ access_token, refresh_token, fingerprint, user: UserResponse }`
- `GracePeriodTokenResponse` — `{ access_token, fingerprint, user: UserResponse }` (no refresh_token)
- `LoginRequest`, `RegisterRequest`, `VerifyEmailRequest`, `ResendOtpRequest`
- `VerificationRequiredResponse` — `{ message?, requires_verification? }`
- `MessageResponse` — `{ message }`
- `LoginAuthLoginPost200` — `AuthTokenResponse | VerificationRequiredResponse` (backend union, not used — proxy reshapes)
- `RefreshAuthRefreshPost200` — `AuthTokenResponse | GracePeriodTokenResponse` (backend union, not used — proxy reshapes)

### Proxy response types (new, in `auth.types.ts`)

Composed from generated models to type what the Next.js proxy routes return to the browser.
Note: these differ from backend response types because the proxy strips tokens into httpOnly cookies.

```ts
import type { UserResponse, VerificationRequiredResponse } from "@/api/generated/auth-apis/models";

// POST /api/auth/login — proxy returns { user } on success, or verification-required
// This is a flattened interface (not a discriminated union) so call sites can check
// both data.user and data.requires_verification without narrowing.
export interface AuthLoginResponse {
  user?: UserResponse;
  requires_verification?: boolean;
  message?: string;
}

// POST /api/auth/verify-email, POST /api/auth/refresh — proxy returns { user }
export interface AuthUserResponse { user: UserResponse }

// GET /api/auth/me — proxy passes through bare UserResponse (no wrapping)
// Used directly as UserResponse in AuthProvider.

// POST /api/auth/register, POST /api/auth/resend-otp → VerificationRequiredResponse (no new type needed)
// POST /api/auth/logout, /logout-all → MessageResponse (no new type needed)
// Register route passes backend response verbatim because register returns
// VerificationRequiredResponse (no tokens to strip).
```

### AuthProvider types (modified)

**Breaking change**: `CookieUser` changes from `Partial<UserResponse> & Pick<UserResponse, "id" | "roles" | "name">`
to `Pick<UserResponse, "id" | "name" | "roles">`. The old definition included optional `email`, `image`, etc.
via `Partial<UserResponse>`, which would break the `isHydratedUser` type guard (since `"email" in user`
could be true on the partial type). The new `Pick`-only definition ensures cookie users genuinely lack `email`.

```ts
import type { UserResponse } from "@/api/generated/auth-apis/models";

// Cookie only has id, name, roles (PII stripped in setAuthCookies — see cookies.ts line 51).
// IMPORTANT: this must stay in sync with the fields written to user_info cookie.
// If email is ever added to the cookie, isHydratedUser must be updated.
export type CookieUser = Pick<UserResponse, "id" | "name" | "roles">;

// Type guard: email is required in UserResponse but absent from CookieUser (Pick excludes it).
export function isHydratedUser(user: CookieUser | UserResponse): user is UserResponse {
  return "email" in user;
}

// Provider state progression:
// 1. null (initial)
// 2. CookieUser (cookie hydration — instant, no loading)
// 3. UserResponse (after GET /api/auth/me — returns bare UserResponse, no wrapping)
```

Context type:
```ts
interface AuthContextType {
  user: CookieUser | UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateUser: (user: CookieUser | UserResponse) => void;
}
```

### Server-side types (`cookies.ts`)

Replace hand-written `AuthTokens` with generated types:

```ts
import type { AuthTokenResponse, GracePeriodTokenResponse } from "@/api/generated/auth-apis/models";

export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokenResponse | GracePeriodTokenResponse
): void { ... }
```

## Module Structure

### Before

```
src/modules/auth/
  hooks/
    useLoginMutation.ts         # DELETE
    useRegisterMutation.ts      # DELETE
    useVerifyEmailMutation.ts   # DELETE
    useResendOtpMutation.ts     # DELETE
  types/
    auth.types.ts               # MODIFY (remove AuthResponse, add proxy types)
  utils/
    extract-api-error.ts        # KEEP
  index.ts                      # MODIFY (update exports)
```

### After

```
src/modules/auth/
  types/
    auth.types.ts     # Zod schemas, form types, proxy response types
  utils/
    extract-api-error.ts
  index.ts            # Re-exports types, extractApiError
```

Note: `isHydratedUser` and `CookieUser` are defined in and exported from `src/providers/AuthProvider.tsx`
(not re-exported through the auth module) since they are part of the auth context, not the auth module.

## Call Site Changes

### Login page (`src/app/(auth)/login/page.tsx`)

Before:
```ts
import { useLoginMutation } from "@/modules/auth";
const mutation = useLoginMutation();
```

After:
```ts
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginFormValues, type AuthLoginResponse, extractApiError } from "@/modules/auth";

const mutation = useMutation<AuthLoginResponse, Error, LoginFormValues>({
  mutationFn: async (body) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Request failed"));
    return data;
  },
});
```

Mutation generic uses `LoginFormValues` (Zod-inferred), not `LoginRequest` (generated). They are structurally identical; no cast needed.

### Register page — same pattern with `RegisterFormValues` and `VerificationRequiredResponse`

### Verify-email page — same pattern with `VerifyEmailFormValues` and `AuthUserResponse`

### Resend OTP (in verify-email page)

```ts
const resendMutation = useMutation<VerificationRequiredResponse, Error, string>({
  mutationFn: async (email) => {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Request failed"));
    return data;
  },
});
```

## Files Changed

| File | Action | What |
|------|--------|------|
| `src/modules/auth/hooks/useLoginMutation.ts` | DELETE | Manual hook |
| `src/modules/auth/hooks/useRegisterMutation.ts` | DELETE | Manual hook |
| `src/modules/auth/hooks/useVerifyEmailMutation.ts` | DELETE | Manual hook |
| `src/modules/auth/hooks/useResendOtpMutation.ts` | DELETE | Manual hook |
| `src/modules/auth/types/auth.types.ts` | MODIFY | Remove `AuthResponse`, add proxy response types |
| `src/modules/auth/index.ts` | MODIFY | Update exports (remove hook exports, add type exports) |
| `src/providers/AuthProvider.tsx` | MODIFY | Union state type, add `isHydratedUser`, export both |
| `src/lib/auth/cookies.ts` | MODIFY | Replace `AuthTokens` with `AuthTokenResponse \| GracePeriodTokenResponse` |
| `src/app/(auth)/login/page.tsx` | MODIFY | Inline `useMutation` replacing `useLoginMutation` |
| `src/app/(auth)/register/page.tsx` | MODIFY | Inline `useMutation` replacing `useRegisterMutation` |
| `src/app/(auth)/verify-email/page.tsx` | MODIFY | Inline `useMutation` replacing `useVerifyEmailMutation` and `useResendOtpMutation` |
| `src/components/layouts/UserMenu.tsx` | MODIFY | Use `isHydratedUser` to narrow before accessing `email`/`image` (no longer on `CookieUser` after Pick-only change) |
| `src/app/api/auth/*/route.ts` | OPTIONAL | Routes can simplify `setAuthCookies(response, data)` instead of manual destructuring now that `tokens` param accepts generated types |

## Not In Scope

- Changing API route implementations
- Using generated orval hooks (response types mismatch with proxy layer)
- Modifying orval config or OpenAPI spec
- Adding a proxy-level OpenAPI spec
