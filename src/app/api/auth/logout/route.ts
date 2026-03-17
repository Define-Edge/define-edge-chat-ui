import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:2024";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    if (refreshToken) headers["X-Refresh-Token"] = refreshToken;
    await fetch(`${BACKEND_URL}/auth/logout`, { method: "POST", headers });
  } catch {
    // Ignore — cookies will be cleared regardless
  }

  const response = NextResponse.json({ message: "Logged out" });
  clearAuthCookies(response);
  return response;
}
