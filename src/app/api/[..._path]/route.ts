import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL;

async function proxyRequest(request: NextRequest): Promise<NextResponse> {
  if (!LANGGRAPH_API_URL) {
    return NextResponse.json(
      { error: "LANGGRAPH_API_URL is not configured" },
      { status: 502 },
    );
  }

  // Extract the subpath after /api/
  const url = new URL(request.url);
  const subpath = url.pathname.replace(/^\/api/, "");
  const targetUrl = `${LANGGRAPH_API_URL}${subpath}${url.search}`;

  // Forward relevant headers, including the client's Authorization header
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.set("Authorization", authorization);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const accept = request.headers.get("accept");
  if (accept) {
    headers.set("Accept", accept);
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  // Stream the response back
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
