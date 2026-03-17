import { NextRequest, NextResponse } from "next/server";
import {
  fetchWithRefresh,
  mergeSetCookieHeaders,
} from "@/lib/auth/server-refresh";

export const runtime = "edge";

async function handleRequest(
  request: NextRequest,
  params: { _slug: string[] },
) {
  try {
    const backendUrl = process.env.LANGGRAPH_API_URL;
    const apiKey = process.env.LANGSMITH_API_KEY;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 },
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const path = params._slug.join("/");
    const targetUrl = `${backendUrl.replace(/\/$/, "")}/api/${path}`;

    const searchParams = new URL(request.url).searchParams;
    const url = new URL(targetUrl);
    searchParams.forEach((value, key) => {
      if (key !== "_slug") {
        url.searchParams.append(key, value);
      }
    });

    const { response, refreshSetCookieHeaders } = await fetchWithRefresh(
      request,
      (accessToken, fingerprint) => {
        const headers: Record<string, string> = {};
        headers["apiKey"] = apiKey;
        headers["Accept"] = "application/json";
        headers["Authorization"] = `Bearer ${accessToken}`;
        if (fingerprint) headers["X-Fgp"] = fingerprint;

        if (request.headers.get("content-type")) {
          headers["Content-Type"] = request.headers.get("content-type")!;
        }

        return fetch(url.toString(), {
          method: request.method,
          headers,
          body:
            request.method !== "GET" && request.method !== "HEAD"
              ? request.body
              : undefined,
        });
      },
    );

    const text = await response.text();

    if (!text.trim()) {
      return mergeSetCookieHeaders(
        NextResponse.json({ data: null }, { status: response.status }),
        refreshSetCookieHeaders,
      );
    }

    return mergeSetCookieHeaders(
      new Response(text, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") || "application/json",
          "Cache-Control":
            response.headers.get("Cache-Control") || "no-cache",
        },
      }),
      refreshSetCookieHeaders,
    );
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
