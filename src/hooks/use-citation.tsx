"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useArtifact } from "@/components/thread/artifact";
import { CitationData } from "@/types/citation";
import { PDFViewer } from "@/components/thread/pdf-viewer";

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
  const [ArtifactContent, { open, setOpen, context, setContext }] = useArtifact();

  const openCitation = useCallback(
    (data: CitationData) => {
      // Set the citation context
      setContext({
        type: "citation",
        citation: data,
      });

      // Open the artifact
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
      {/* Render ArtifactContent here with citation data */}
      {citation && (
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
export function useCitation() {
  const context = useContext(CitationContext);
  if (!context) {
    throw new Error("useCitation must be used within CitationProvider");
  }
  return context;
}
