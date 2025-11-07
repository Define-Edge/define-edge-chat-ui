/**
 * API client utilities for fetching resources from the backend
 */

/**
 * Validates filename to prevent path traversal attacks
 */
function validateFilename(filename: string): boolean {
  // Check for path traversal patterns
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  // Check for valid filename pattern (alphanumeric, dash, underscore, dot)
  const validPattern = /^[a-zA-Z0-9._-]+$/;
  return validPattern.test(filename);
}

/**
 * Fetches a PDF file from the backend
 * @param filename - The filename of the PDF to fetch
 * @returns Promise<Blob> - The PDF file as a blob
 * @throws Error if the request fails or filename is invalid
 */
export async function fetchPDF(filename: string): Promise<Blob> {
  // Validate filename
  if (!validateFilename(filename)) {
    throw new Error("Invalid filename format");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  // NEXT_PUBLIC_API_URL is http://localhost:3000/api
  // The [..._path] proxy strips /api and forwards to backend
  // So /api/api/pdf/file -> backend receives /api/pdf/file
  const url = `${apiUrl}/api/pdf/${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();

    // Log blob info for debugging
    console.log('[fetchPDF] Blob received - Type:', blob.type, 'Size:', blob.size);

    // Verify the response is actually a PDF (check both type and size)
    // Some backends may not set Content-Type correctly, so also accept application/octet-stream
    if (blob.size === 0) {
      throw new Error("Response is empty (0 bytes)");
    }

    if (!blob.type.includes("pdf") && !blob.type.includes("octet-stream") && blob.type !== "") {
      console.warn('[fetchPDF] Unexpected content type:', blob.type);
      // Don't throw error, just warn - the backend might not set Content-Type correctly
    }

    return blob;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF fetch error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching PDF");
  }
}

/**
 * Creates a blob URL from a PDF blob
 * @param blob - The PDF blob
 * @returns string - The blob URL
 */
export function createPDFBlobUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Revokes a blob URL to free memory
 * @param url - The blob URL to revoke
 */
export function revokePDFBlobUrl(url: string): void {
  URL.revokeObjectURL(url);
}
