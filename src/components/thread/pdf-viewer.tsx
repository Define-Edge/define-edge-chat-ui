"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BboxCoordinates } from "@/types/citation";
import { fetchPDF, createPDFBlobUrl, revokePDFBlobUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  filename: string;
  initialPage?: number;
  bbox?: BboxCoordinates;
  headings?: string[];
}

/**
 * Converts bbox coordinates from BOTTOMLEFT origin to TOPLEFT origin
 */
function convertBboxCoordinates(
  bbox: BboxCoordinates,
  pageHeight: number,
): { left: number; top: number; width: number; height: number } {
  if (bbox.coord_origin === "TOPLEFT") {
    return {
      left: bbox.l,
      top: bbox.t,
      width: bbox.r - bbox.l,
      height: bbox.b - bbox.t,
    };
  }

  // Convert from BOTTOMLEFT to TOPLEFT
  const height = bbox.t - bbox.b;
  const top = pageHeight - bbox.t;

  return {
    left: bbox.l,
    top,
    width: bbox.r - bbox.l,
    height,
  };
}

export function PDFViewer({ filename, initialPage = 1, bbox, headings }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [pdfLibLoaded, setPdfLibLoaded] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const pdfjsLib = useRef<any>(null);

  // Load PDF.js library dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        console.log('[PDFViewer] Starting to load PDF.js library...');
        // Load PDF.js from CDN at runtime to avoid webpack bundling issues
        if (typeof window !== 'undefined' && !pdfjsLib.current) {
          // @ts-expect-error - pdfjsLib is loaded from CDN at runtime
          if (!window.pdfjsLib) {
            console.log('[PDFViewer] Loading PDF.js from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
            script.type = 'module';

            await new Promise<void>((resolve, reject) => {
              script.onload = () => {
                console.log('[PDFViewer] Script loaded, checking for pdfjsLib...');
                // Give it a moment for the library to initialize
                setTimeout(() => {
                  // @ts-expect-error - pdfjsLib is loaded from CDN at runtime
                  const lib = window.pdfjsLib;
                  if (lib) {
                    console.log('[PDFViewer] PDF.js library found!');
                    lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
                    pdfjsLib.current = lib;
                    setPdfLibLoaded(true);
                    resolve();
                  } else {
                    console.error('[PDFViewer] PDF.js library not found on window object');
                    reject(new Error('Failed to load PDF.js'));
                  }
                }, 100);
              };
              script.onerror = (err) => {
                console.error('[PDFViewer] Script loading error:', err);
                reject(err);
              };
              document.head.appendChild(script);
            });
          } else {
            console.log('[PDFViewer] PDF.js already loaded');
            // @ts-expect-error - pdfjsLib is loaded from CDN at runtime
            pdfjsLib.current = window.pdfjsLib;
            setPdfLibLoaded(true);
          }
        }
      } catch (err) {
        console.error('[PDFViewer] Failed to load PDF.js:', err);
        setError('Failed to load PDF viewer library');
        setLoading(false);
      }
    };

    loadPdfJs();
  }, []);

  // Update page number when initialPage changes
  useEffect(() => {
    setPageNumber(initialPage);
  }, [initialPage]);

  // Fetch and load PDF
  useEffect(() => {
    if (!pdfLibLoaded) {
      console.log('[PDFViewer] Waiting for PDF.js library to load...');
      return;
    }

    console.log('[PDFViewer] PDF.js loaded, fetching PDF:', filename);
    let blobUrl: string | null = null;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[PDFViewer] Fetching PDF from API...');
        const blob = await fetchPDF(filename);
        console.log('[PDFViewer] PDF fetched, size:', blob.size, 'bytes');

        blobUrl = createPDFBlobUrl(blob);
        console.log('[PDFViewer] Blob URL created:', blobUrl);

        // Load PDF document
        console.log('[PDFViewer] Converting to ArrayBuffer...');
        const arrayBuffer = await blob.arrayBuffer();
        console.log('[PDFViewer] ArrayBuffer size:', arrayBuffer.byteLength);

        console.log('[PDFViewer] Loading PDF document...');
        const loadingTask = pdfjsLib.current.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        console.log('[PDFViewer] PDF loaded! Pages:', pdf.numPages);

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        console.error('[PDFViewer] Error loading PDF:', err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (blobUrl) {
        console.log('[PDFViewer] Cleaning up blob URL');
        revokePDFBlobUrl(blobUrl);
      }
    };
  }, [filename, pdfLibLoaded]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setPageHeight(viewport.height / scale);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Failed to render page:', err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, scale]);

  // Scroll to highlight
  useEffect(() => {
    if (bbox && highlightRef.current && pageNumber === initialPage && pageHeight > 0) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [bbox, pageNumber, initialPage, pageHeight]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading PDF</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate bbox position and dimensions for highlighting
  const bboxStyle = bbox && pageHeight > 0 ? convertBboxCoordinates(bbox, pageHeight) : null;

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header with headings */}
      {headings && headings.length > 0 && (
        <div className="border-b bg-white px-4 py-3">
          <div className="text-sm text-gray-600">
            {headings.map((heading, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2">›</span>}
                <span className="font-medium">{heading}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={scale >= 3.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto w-fit">
          <div className="relative shadow-lg">
            <canvas ref={canvasRef} className="block" />

            {/* Bbox Highlight Overlay */}
            {bboxStyle && pageNumber === initialPage && (
              <div
                ref={highlightRef}
                className={cn(
                  "absolute pointer-events-none",
                  "border-2 border-yellow-400 bg-yellow-200/30",
                  "transition-all duration-200",
                )}
                style={{
                  left: `${bboxStyle.left * scale}px`,
                  top: `${bboxStyle.top * scale}px`,
                  width: `${bboxStyle.width * scale}px`,
                  height: `${bboxStyle.height * scale}px`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
