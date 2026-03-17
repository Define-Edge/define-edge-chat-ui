import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function handleRequest(
  request: NextRequest,
  params: { _slug: string[] }
) {
  try {
    // Use LANGGRAPH_API_URL as the backend
    const backendUrl = process.env.LANGGRAPH_API_URL;
    const apiKey = process.env.LANGSMITH_API_KEY;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Reconstruct the path from the slug
    const path = params._slug.join("/");
    const targetUrl = `${backendUrl.replace(/\/$/, "")}/api/${path}`;

    // Copy query parameters from the original request
    const searchParams = new URL(request.url).searchParams;
    const url = new URL(targetUrl);
    searchParams.forEach((value, key) => {
      if (key !== "_slug") {
        url.searchParams.append(key, value);
      }
    });

    // Create headers for the proxy request
    const headers: Record<string, string> = {};
    headers["apiKey"] = apiKey;
    headers["Accept"] = "application/json";

    // Forward auth cookies as headers
    const IS_PROD = process.env.NODE_ENV === "production";
    const fgpName = IS_PROD ? "__Secure-Fgp" : "fgp";
    const accessToken = request.cookies.get("access_token")?.value;
    const fingerprint = request.cookies.get(fgpName)?.value;
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    if (fingerprint) headers["X-Fgp"] = fingerprint;

    // Copy relevant headers from original request
    if (request.headers.get("content-type")) {
      headers["Content-Type"] = request.headers.get("content-type")!;
    }

    // Forward the request to the backend
    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
    });

    // Get response text
    const text = await response.text();

    // Return empty response if no content
    if (!text.trim()) {
      return NextResponse.json({ data: null }, { status: response.status });
    }

    // Return the response
    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Cache-Control": response.headers.get("Cache-Control") || "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected exception";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ _slug: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}
