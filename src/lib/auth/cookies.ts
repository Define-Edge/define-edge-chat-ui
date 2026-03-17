import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenResponse, GracePeriodTokenResponse } from "@/api/generated/auth-apis/models";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// __Secure- prefix requires Secure flag (HTTPS). In dev (HTTP), use plain name.
const FGP_COOKIE_NAME = IS_PRODUCTION ? "__Secure-Fgp" : "fgp";

export { FGP_COOKIE_NAME };

export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokenResponse | GracePeriodTokenResponse
): void {
  response.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: 900,
  });

  if ("refresh_token" in tokens && tokens.refresh_token) {
    response.cookies.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "strict",
      path: "/api/auth/",
      maxAge: 604800,
    });
  }

  response.cookies.set(FGP_COOKIE_NAME, tokens.fingerprint, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/",
    maxAge: 604800,
  });

  // Non-httpOnly cookie for frontend hydration — strip PII (email, institutionId)
  const userInfo = { id: tokens.user.id, name: tokens.user.name, roles: tokens.user.roles };
  response.cookies.set("user_info", JSON.stringify(userInfo), {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: 900,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  for (const name of ["access_token", "refresh_token", FGP_COOKIE_NAME, "user_info"]) {
    response.cookies.set(name, "", { maxAge: 0, path: name === "refresh_token" ? "/api/auth/" : "/" });
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getFingerprint(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(FGP_COOKIE_NAME)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}
