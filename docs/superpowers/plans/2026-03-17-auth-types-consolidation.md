# Auth Types Consolidation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate auth types to use orval-generated models as single source of truth, eliminating 3 layers of hand-written type duplication.

**Architecture:** Replace hand-written `AuthResponse`, `AuthTokens`, and `CookieUser` types with imports from orval-generated `src/api/generated/auth-apis/models/`. Delete 4 manual mutation hooks; pages use inline `useMutation` with generated request types and proxy response types. Add `isHydratedUser` type guard for progressive hydration.

**Tech Stack:** TypeScript, React, @tanstack/react-query, orval-generated types, Next.js API routes

**Spec:** `docs/superpowers/specs/2026-03-17-auth-types-consolidation-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/modules/auth/types/auth.types.ts` | MODIFY | Remove `AuthResponse`, add proxy response types (`AuthLoginResponse`, `AuthUserResponse`) |
| `src/modules/auth/index.ts` | MODIFY | Remove hook exports, keep type + utility exports |
| `src/modules/auth/hooks/useLoginMutation.ts` | DELETE | — |
| `src/modules/auth/hooks/useRegisterMutation.ts` | DELETE | — |
| `src/modules/auth/hooks/useVerifyEmailMutation.ts` | DELETE | — |
| `src/modules/auth/hooks/useResendOtpMutation.ts` | DELETE | — |
| `src/providers/AuthProvider.tsx` | MODIFY | Change `CookieUser` to `Pick`-only, widen state type to `CookieUser \| UserResponse \| null`, add `isHydratedUser` |
| `src/lib/auth/cookies.ts` | MODIFY | Replace `AuthTokens` with `AuthTokenResponse \| GracePeriodTokenResponse` |
| `src/app/(auth)/login/page.tsx` | MODIFY | Inline `useMutation` replacing `useLoginMutation` |
| `src/app/(auth)/register/page.tsx` | MODIFY | Inline `useMutation` replacing `useRegisterMutation` |
| `src/app/(auth)/verify-email/page.tsx` | MODIFY | Inline `useMutation` replacing `useVerifyEmailMutation` + `useResendOtpMutation` |
| `src/components/layouts/UserMenu.tsx` | MODIFY | Use `isHydratedUser` to narrow before accessing `email`/`image` (no longer on `CookieUser`) |

---

### Task 1: Update proxy response types in `auth.types.ts`

**Files:**
- Modify: `src/modules/auth/types/auth.types.ts`

- [ ] **Step 1: Replace `AuthResponse` with proxy response types**

Open `src/modules/auth/types/auth.types.ts`. Remove the `AuthResponse` interface (lines 29-39) and replace with proxy response types composed from generated models:

```ts
import type { UserResponse } from "@/api/generated/auth-apis/models";

// --- Proxy response types ---
// These describe what the Next.js proxy routes return to the browser.
// They differ from backend types because the proxy strips tokens into httpOnly cookies.

// POST /api/auth/login — proxy returns { user } on success, or verification-required.
// Flattened interface (not discriminated union) so call sites can check both fields directly.
export interface AuthLoginResponse {
  user?: UserResponse;
  requires_verification?: boolean;
  message?: string;
}

// POST /api/auth/verify-email, POST /api/auth/refresh — proxy returns { user }
export interface AuthUserResponse {
  user: UserResponse;
}
```

Keep all Zod schemas (`loginSchema`, `registerSchema`, `verifyEmailSchema`) and form value types (`LoginFormValues`, `RegisterFormValues`, `VerifyEmailFormValues`) unchanged.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors from `auth.types.ts`

- [ ] **Step 3: Commit**

```bash
git add src/modules/auth/types/auth.types.ts
git commit -m "refactor(auth): replace AuthResponse with proxy response types from generated models"
```

---

### Task 2: Update `AuthProvider.tsx` — types and type guard

**Files:**
- Modify: `src/providers/AuthProvider.tsx`

- [ ] **Step 1: Change `CookieUser` to `Pick`-only and add `isHydratedUser`**

In `src/providers/AuthProvider.tsx`:

1. The `UserResponse` import (line 12) stays as-is.

2. Replace the `CookieUser` type definition (lines 14-20):

```ts
/**
 * Minimal user data available from the user_info cookie.
 * Cookie only has id, name, roles (PII stripped in setAuthCookies — see cookies.ts line 51).
 * IMPORTANT: this must stay in sync with the fields written to user_info cookie.
 * If email is ever added to the cookie, isHydratedUser must be updated.
 */
export type CookieUser = Pick<UserResponse, "id" | "name" | "roles">;

/**
 * Type guard: narrows CookieUser | UserResponse to UserResponse.
 * Works because email is required in UserResponse but absent from CookieUser (Pick excludes it).
 */
export function isHydratedUser(user: CookieUser | UserResponse): user is UserResponse {
  return "email" in user;
}
```

3. Update `AuthContextType` (lines 22-29) — change `user` and `updateUser` types:

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

4. Update `useState` (line 51) — widen the state type:

```ts
const [user, setUser] = useState<CookieUser | UserResponse | null>(null);
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors from `AuthProvider.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/providers/AuthProvider.tsx
git commit -m "refactor(auth): use Pick-only CookieUser, add isHydratedUser type guard"
```

---

### Task 3: Update `UserMenu.tsx` — narrow with `isHydratedUser`

**Files:**
- Modify: `src/components/layouts/UserMenu.tsx`

- [ ] **Step 1: Add `isHydratedUser` import and narrow before accessing `email`/`image`**

After Task 2, `CookieUser` no longer has `email` or `image` (it's `Pick`-only). `UserMenu.tsx` accesses `user.image` (line 36) and `user.email` (line 53), which will fail to compile.

In `src/components/layouts/UserMenu.tsx`:

1. Update import (line 10) to also import `isHydratedUser`:

```ts
import { useAuth, isHydratedUser } from "@/providers/AuthProvider";
```

2. Replace the avatar and user details section. Wrap `image` and `email` access behind the type guard. Change the `<Avatar>` block (line 35-39) to:

```ts
            {isHydratedUser(user) && user.image && (
              <AvatarImage src={user.image} alt={user.name || ""} />
            )}
```

3. Change the email display (line 52-55) to:

```ts
          {isHydratedUser(user) && user.email && (
            <p className="text-muted-foreground mt-1 text-xs">{user.email}</p>
          )}
```

This means during cookie hydration (before `/api/auth/me` returns), the avatar shows initials only and email is hidden — both gracefully degrade.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "UserMenu"`
Expected: No errors from `UserMenu.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/UserMenu.tsx
git commit -m "refactor(auth): use isHydratedUser in UserMenu for type-safe email/image access"
```

---

### Task 4: Update `cookies.ts` — use generated `AuthTokenResponse`

**Files:**
- Modify: `src/lib/auth/cookies.ts`

- [ ] **Step 1: Replace `AuthTokens` with generated types**

In `src/lib/auth/cookies.ts`:

1. Add import at top:

```ts
import type { AuthTokenResponse, GracePeriodTokenResponse } from "@/api/generated/auth-apis/models";
```

2. Delete the `AuthTokens` interface (lines 11-21).

3. Update `setAuthCookies` signature:

```ts
export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokenResponse | GracePeriodTokenResponse
): void {
```

The body requires one change: `refresh_token` does not exist on `GracePeriodTokenResponse`, so the existing `if (tokens.refresh_token)` guard (line 32) must be narrowed. Change it to:

```ts
if ("refresh_token" in tokens && tokens.refresh_token) {
```

All other field accesses (`tokens.access_token`, `tokens.fingerprint`, `tokens.user`) exist on both generated types and stay the same.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors from `cookies.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth/cookies.ts
git commit -m "refactor(auth): use generated AuthTokenResponse in cookies.ts, delete AuthTokens"
```

---

### Task 5: Delete manual hooks and update module index

**Files:**
- Delete: `src/modules/auth/hooks/useLoginMutation.ts`
- Delete: `src/modules/auth/hooks/useRegisterMutation.ts`
- Delete: `src/modules/auth/hooks/useVerifyEmailMutation.ts`
- Delete: `src/modules/auth/hooks/useResendOtpMutation.ts`
- Modify: `src/modules/auth/index.ts`

- [ ] **Step 1: Delete the 4 hook files**

```bash
rm src/modules/auth/hooks/useLoginMutation.ts
rm src/modules/auth/hooks/useRegisterMutation.ts
rm src/modules/auth/hooks/useVerifyEmailMutation.ts
rm src/modules/auth/hooks/useResendOtpMutation.ts
rmdir src/modules/auth/hooks
```

- [ ] **Step 2: Update `src/modules/auth/index.ts`**

Replace entire contents with:

```ts
export { extractApiError } from "./utils/extract-api-error";
export * from "./types/auth.types";
```

Note: must use `export *` (not `export type *`) because `loginSchema`, `registerSchema`, and `verifyEmailSchema` are runtime values (Zod objects), not just types. `export type *` would silently drop them.

- [ ] **Step 3: Verify compilation (expect errors in pages — that's OK for now)**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -c "error TS"`
Expected: Errors in `login/page.tsx`, `register/page.tsx`, `verify-email/page.tsx` (they still import deleted hooks). No errors elsewhere.

- [ ] **Step 4: Commit**

```bash
git add -A src/modules/auth/
git commit -m "refactor(auth): delete manual mutation hooks, update module exports"
```

---

### Task 6: Update login page — inline `useMutation`

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Replace hook import and usage**

In `src/app/(auth)/login/page.tsx`:

1. Replace imports (lines 19-21):

```ts
import { useMutation } from "@tanstack/react-query";
import {
  extractApiError,
  loginSchema,
  type LoginFormValues,
  type AuthLoginResponse,
} from "@/modules/auth";
```

2. Replace `const mutation = useLoginMutation();` (line 26) with:

```ts
const mutation = useMutation<AuthLoginResponse, Error, LoginFormValues>({
  mutationFn: async (body) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Login failed"));
    return data;
  },
});
```

The `onSubmit` handler (lines 38-48) stays exactly the same — `data.requires_verification` and `data.user` are both accessible on `AuthLoginResponse`.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "login/page"`
Expected: No errors from `login/page.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/login/page.tsx
git commit -m "refactor(auth): inline useMutation in login page, use generated types"
```

---

### Task 7: Update register page — inline `useMutation`

**Files:**
- Modify: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Replace hook import and usage**

In `src/app/(auth)/register/page.tsx`:

1. Replace imports (lines 19-23):

```ts
import { useMutation } from "@tanstack/react-query";
import type { VerificationRequiredResponse } from "@/api/generated/auth-apis/models";
import {
  extractApiError,
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth";
```

2. Replace `const mutation = useRegisterMutation();` (line 27) with:

```ts
const mutation = useMutation<VerificationRequiredResponse, Error, RegisterFormValues>({
  mutationFn: async (body) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Registration failed"));
    return data;
  },
});
```

The `onSubmit` handler (lines 39-46) stays the same.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "register/page"`
Expected: No errors from `register/page.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/register/page.tsx
git commit -m "refactor(auth): inline useMutation in register page, use generated types"
```

---

### Task 8: Update verify-email page — inline both mutations

**Files:**
- Modify: `src/app/(auth)/verify-email/page.tsx`

- [ ] **Step 1: Replace hook imports and usage**

In `src/app/(auth)/verify-email/page.tsx`:

1. Replace imports (lines 17-22):

```ts
import { useMutation } from "@tanstack/react-query";
import type { VerificationRequiredResponse } from "@/api/generated/auth-apis/models";
import {
  extractApiError,
  verifyEmailSchema,
  type VerifyEmailFormValues,
  type AuthUserResponse,
} from "@/modules/auth";
```

2. Replace `const verifyMutation = useVerifyEmailMutation();` (line 32) with:

```ts
const verifyMutation = useMutation<AuthUserResponse, Error, VerifyEmailFormValues>({
  mutationFn: async (body) => {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Verification failed"));
    return data;
  },
});
```

3. Replace `const resendMutation = useResendOtpMutation();` (line 33) with:

```ts
const resendMutation = useMutation<VerificationRequiredResponse, Error, string>({
  mutationFn: async (email) => {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Failed to resend code"));
    return data;
  },
});
```

4. Update `onSubmit` handler (line 66-72) — `data.user` is now guaranteed (not optional) on `AuthUserResponse`:

```ts
const onSubmit = (values: VerifyEmailFormValues) => {
  verifyMutation.mutate(values, {
    onSuccess: (data) => {
      updateUser(data.user);
      router.push("/");
    },
  });
};
```

Note: the old code had `if (data.user) updateUser(data.user)` — the guard is no longer needed since `AuthUserResponse.user` is required.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "verify-email/page"`
Expected: No errors from `verify-email/page.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/(auth)/verify-email/page.tsx
git commit -m "refactor(auth): inline useMutation in verify-email page, use generated types"
```

---

### Task 9: Final type check and build verification

**Files:** None (verification only)

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit --pretty`
Expected: Zero errors

- [ ] **Step 2: Build check**

Run: `pnpm build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Verify no remaining references to deleted types/hooks**

Run these searches — all should return zero results:

```bash
# Deleted hook imports
grep -r "useLoginMutation\|useRegisterMutation\|useVerifyEmailMutation\|useResendOtpMutation" src/ --include="*.ts" --include="*.tsx"

# Deleted AuthResponse type
grep -r "AuthResponse" src/ --include="*.ts" --include="*.tsx"

# Deleted AuthTokens type
grep -r "AuthTokens" src/ --include="*.ts" --include="*.tsx"
```

Expected: No matches for any of the above.

- [ ] **Step 4: Commit (if any fixes were needed)**

Only if previous steps required fixes. Otherwise skip.
