"use client";

import { useArtifact } from "@/components/thread/artifact";
import { PDFViewer } from "@/components/thread/pdf-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CitationData } from "@/types/citation";
import { XIcon } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface CitationContextType {
  openCitation: (data: CitationData) => void;
  closeCitation: () => void;
  getCurrentCitation: () => CitationData | null;
  isOpen: boolean;
}

const CitationContext = createContext<CitationContextType | null>(null);

/**
 * Provider that manages citation artifact state
 * Should be placed at the message level
 */
export function CitationProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [ArtifactContent, { open, setOpen, context, setContext }] = useArtifact();

  const openCitation = useCallback(
    (data: CitationData) => {
      setContext({
        type: "citation",
        citation: data,
      });
      setOpen(true);
    },
    [setContext, setOpen],
  );

  const closeCitation = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const getCurrentCitation = useCallback((): CitationData | null => {
    if (context.type === "citation" && context.citation) {
      return context.citation as CitationData;
    }
    return null;
  }, [context]);

  const value: CitationContextType = {
    openCitation,
    closeCitation,
    getCurrentCitation,
    isOpen: open,
  };

  // Check if there's citation data in context
  const hasCitation = context.type === "citation" && context.citation;
  const citation = hasCitation ? (context.citation as CitationData) : null;

  return (
    <CitationContext.Provider value={value}>
      {children}

      {/* Mobile: Dialog modal */}
      {isMobile && citation && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="flex max-h-[90vh] max-w-[95vw] flex-col overflow-hidden p-0"
            showCloseButton={false}
          >
            <DialogHeader className="grid grid-cols-[1fr_auto] items-center border-b p-4">
              <DialogTitle className="truncate">
                {citation.ticker} - {citation.category}
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <XIcon className="size-5" />
                <span className="sr-only">Close</span>
              </button>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <PDFViewer
                filename={citation.filename}
                initialPage={citation.page}
                initialScale={0.5}
                bbox={citation.bbox}
                headings={citation.headings}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop: Artifact panel */}
      {!isMobile && citation && (
        <ArtifactContent title={`${citation.ticker} - ${citation.category}`}>
          <PDFViewer
            filename={citation.filename}
            initialPage={citation.page}
            bbox={citation.bbox}
            headings={citation.headings}
          />
        </ArtifactContent>
      )}
    </CitationContext.Provider>
  );
}

/**
 * Hook to access citation controls
 * Must be used within CitationProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCitation() {
  const context = useContext(CitationContext);
  if (!context) {
    throw new Error("useCitation must be used within CitationProvider");
  }
  return context;
}
