import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/cookies";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:2024";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  try {
    await fetch(`${BACKEND_URL}/auth/logout-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    // Ignore
  }

  const response = NextResponse.json({ message: "All sessions logged out" });
  clearAuthCookies(response);
  return response;
}
