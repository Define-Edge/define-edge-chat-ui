import { z } from "zod";
import type { UserResponse } from "@/api/generated/auth-apis/models";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  token: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

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
