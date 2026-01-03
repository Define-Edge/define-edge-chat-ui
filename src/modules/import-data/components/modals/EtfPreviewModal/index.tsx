/**
 * ETF Preview Modal - Container Component
 * Handles modal state, data fetching, and submission for ETF holdings
 *
 * TODO: SET_TYPE - Verify all functionality once actual ETF API response is available
 */

"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarChart3, TrendingUp } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import useModalState from "@/hooks/useModalState";
import { BaseAnalysisModalProps } from "@/modules/import-data/types";
import { useEtfData } from "./hooks/useEtfData";
import { useImportEtfMutation } from "./hooks/useImportEtfMutation";
import { EtfPreviewForm } from "./EtfPreviewForm";

/**
 * Modal component for ETF holdings preview
 * Allows users to review, edit quantities, and import ETF holdings to chat
 */
export function EtfPreviewModal({ consent }: BaseAnalysisModalProps) {
  const { open, handleClose, handleOpenChange } = useModalState();

  const consentID = consent?.consentID;
  const isDataReady = consent?.isDataReady;

  const [, setImportViewOpen] = useQueryState(
    "importViewOpen",
    parseAsBoolean.withDefault(false),
  );

  const importMutation = useImportEtfMutation();

  // Fetch and transform ETF data
  const { formDefaultValues, isLoading, fiData } = useEtfData(
    consentID,
    !!isDataReady,
  );

  const handleSubmit = (modifiedFiData: typeof fiData) => {
    if (!modifiedFiData) return;

    // Navigate to chat view immediately
    setImportViewOpen(false);
    handleClose();

    // Call mutation to import ETFs to chat
    importMutation.mutate({ data: modifiedFiData });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          disabled={!isDataReady}
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analyse
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[min(96vw,80rem)] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            ETF Holdings Preview
          </DialogTitle>
          <DialogDescription>
            Review, edit quantities, or add new ETF holdings before analysis
          </DialogDescription>
        </DialogHeader>

        <EtfPreviewForm
          defaultValues={formDefaultValues}
          fiData={fiData}
          isLoading={isLoading}
          isImporting={importMutation.isPending}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
