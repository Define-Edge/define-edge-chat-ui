import { z } from "zod";

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

export interface AuthResponse {
  user?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
    roles: string[];
  };
  requires_verification?: boolean;
  message?: string;
}
