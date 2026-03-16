import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.LANGGRAPH_API_URL || "http://localhost:2024";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
