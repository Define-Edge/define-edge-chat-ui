import { NextRequest } from 'next/server';

const DEFINE_EDGE_BASE_URL = process.env.DEFINE_EDGE_FUNDAMENTAL_APIS_BASE_URL;
const DEFINE_EDGE_API_KEY = process.env.DEFINE_EDGE_API_KEY;

export const runtime = 'edge';

async function handleRequest(request: NextRequest, params: { _path: string[] }) {
  // Validate environment variables
  if (!DEFINE_EDGE_BASE_URL || !DEFINE_EDGE_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'DefineEdge API configuration missing. Please check environment variables.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Reconstruct the path
    const path = params._path.join('/');
    const proxyURL = new URL(path, DEFINE_EDGE_BASE_URL.endsWith('/') ? DEFINE_EDGE_BASE_URL : `${DEFINE_EDGE_BASE_URL}/`);

    // Copy query parameters from the original request (excluding _path)
    const searchParams = new URL(request.url).searchParams;
    searchParams.forEach((value, key) => {
      // Skip the _path parameter that Next.js automatically adds from route segments
      if (key !== '_path') {
        proxyURL.searchParams.append(key, value);
      }
    });

    // Create headers for the proxy request
    const headers = new Headers();
    headers.set('apiKey', DEFINE_EDGE_API_KEY);
    headers.set('Accept', 'application/json');

    // Copy relevant headers from original request (if needed)
    if (request.headers.get('content-type')) {
      headers.set('Content-Type', request.headers.get('content-type')!);
    }

    // Create the proxy request
    const proxyRequest = new Request(proxyURL.toString(), {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    // Make the request
    const response = await fetch(proxyRequest);

    // Check if response has content
    const text = await response.text();
    if (!text.trim()) {
      return new Response(JSON.stringify({ data: null }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the response with proper headers
    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Cache-Control': response.headers.get('Cache-Control') || 'no-cache',
      }
    });
  } catch (error) {
    console.error('DefineEdge API Proxy Error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected exception';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}

export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ _path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams);
}
