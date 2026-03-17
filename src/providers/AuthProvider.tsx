"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { UserResponse } from "@/api/generated/auth-apis/models";

/**
 * Minimal user data available from the user_info cookie.
 * Cookie only has id, name, roles (PII stripped in setAuthCookies — see cookies.ts line 43).
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

interface AuthContextType {
  user: CookieUser | UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateUser: (user: CookieUser | UserResponse) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function getUserFromCookie(): CookieUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)user_info=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CookieUser | UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, logout, refreshAuth, updateUser: setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
