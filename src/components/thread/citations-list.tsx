"use client";

import { useMemo } from "react";
import { CitationData } from "@/types/citation";
import { cn } from "@/lib/utils";
import { fetchPDF, createPDFBlobUrl, revokePDFBlobUrl } from "@/lib/api-client";

interface CitationsListProps {
  content: string;
}

/**
 * Extracts citation data from HTML button elements in the content
 */
function extractCitations(content: string): CitationData[] {
  if (!content) return [];

  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  // Find all citation buttons
  const citationButtons = doc.querySelectorAll("button.citation-btn");

  const citations: CitationData[] = [];
  const seen = new Set<string>();

  citationButtons.forEach((button) => {
    try {
      const ticker = button.getAttribute("data-ticker") || "";
      const category = button.getAttribute("data-category") || "";
      const citationId = button.getAttribute("data-citation-id") || "";
      const filename = button.getAttribute("data-filename") || "";

      // Use filename as unique key
      const key = filename;

      // Skip if we've already seen this citation
      if (seen.has(key)) return;
      seen.add(key);

      const citation: CitationData = {
        citationId,
        ticker,
        category,
        filename: button.getAttribute("data-filename") || "",
        page: parseInt(button.getAttribute("data-page") || "1", 10),
        fincode: button.getAttribute("data-fincode") || "",
        documentDate: button.getAttribute("data-document-date") || "",
        bbox: button.getAttribute("data-bbox")
          ? JSON.parse(button.getAttribute("data-bbox")!)
          : null,
        headings: button.getAttribute("data-headings")
          ? JSON.parse(button.getAttribute("data-headings")!)
          : [],
      };

      citations.push(citation);
    } catch (error) {
      console.error("Failed to parse citation:", error);
    }
  });

  return citations;
}

export function CitationsList({ content }: CitationsListProps) {
  const citations = useMemo(() => extractCitations(content), [content]);

  const handleDownload = async (citation: CitationData) => {
    const { filename } = citation;
    if (!filename) {
      console.error("No filename available for download");
      return;
    }

    try {
      // Fetch PDF blob from backend
      const blob = await fetchPDF(filename);

      // Create blob URL
      const blobUrl = createPDFBlobUrl(blob);

      // Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      revokePDFBlobUrl(blobUrl);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-3">
      <div className="text-xs text-gray-500 mb-2 font-medium">Citations:</div>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <button
            key={citation.filename}
            onClick={() => handleDownload(citation)}
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-md",
              "text-xs font-medium",
              "bg-blue-50 text-blue-700 hover:bg-blue-100",
              "border border-blue-200 hover:border-blue-300",
              "transition-colors duration-150",
              "cursor-pointer"
            )}
          >
            {citation.ticker}-{citation.category}
          </button>
        ))}
      </div>
    </div>
  );
}
