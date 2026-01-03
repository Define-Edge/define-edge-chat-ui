/**
 * Equities Preview Modal - Container Component
 * Handles modal state, data fetching, and submission for equity holdings
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
import { useEquitiesData } from "./hooks/useEquitiesData";
import { useImportEquitiesMutation } from "./hooks/useImportEquitiesMutation";
import { EquitiesPreviewForm } from "./EquitiesPreviewForm";

/**
 * Modal component for equity holdings preview
 * Allows users to review, edit quantities, and import equity holdings to chat
 */
export function EquitiesPreviewModal({ consent }: BaseAnalysisModalProps) {
  const { open, handleClose, handleOpenChange } = useModalState();

  const consentID = consent?.consentID;
  const isDataReady = consent?.isDataReady;

  const [, setImportViewOpen] = useQueryState(
    "importViewOpen",
    parseAsBoolean.withDefault(false),
  );

  const importMutation = useImportEquitiesMutation();

  // Fetch and transform equities data
  const { formDefaultValues, isLoading, fiData } = useEquitiesData(
    consentID,
    !!isDataReady,
  );

  const handleSubmit = (modifiedFiData: typeof fiData) => {
    if (!modifiedFiData) return;

    // Navigate to chat view immediately
    setImportViewOpen(false);
    handleClose();

    // Call mutation to import equities to chat
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
            Equity Holdings Preview
          </DialogTitle>
          <DialogDescription>
            Review, edit quantities, or add new equity holdings before analysis
          </DialogDescription>
        </DialogHeader>

        <EquitiesPreviewForm
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
