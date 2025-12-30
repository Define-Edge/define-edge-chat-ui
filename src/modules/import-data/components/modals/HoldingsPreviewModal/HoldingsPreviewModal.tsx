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
import { ConsentData } from "@/lib/moneyone/moneyone.storage";
import { useImportHoldingsMutation } from "../../../hooks/useImportHoldingsMutation";
import { useHoldingsData } from "./hooks/useHoldingsData";
import { HoldingsPreviewForm } from "./HoldingsPreviewForm";
import { getAssetTypeName } from "./utils/holdings-transformer";

type HoldingsPreviewModalProps = {
  consent?: ConsentData | null;
};

/**
 * Container component for holdings preview modal
 * Handles modal state, data fetching, and submission
 */
export function HoldingsPreviewModal({ consent }: HoldingsPreviewModalProps) {
  const { open, handleClose, handleOpenChange } = useModalState();

  const consentID = consent?.consentID;
  const consentType = consent?.type;
  const isDataReady = consent?.isDataReady;

  const [, setImportViewOpen] = useQueryState(
    "importViewOpen",
    parseAsBoolean.withDefault(false),
  );

  const importHoldingsMut = useImportHoldingsMutation();

  // Fetch and transform holdings data
  const { formDefaultValues, isLoading, fiData } = useHoldingsData(
    consentID,
    consentType!,
    !!isDataReady,
  );

  const assetType = consentType ? getAssetTypeName(consentType) : "";

  const handleSubmit = (
    _convertedHoldings: any,
    modifiedFiData: any,
  ) => {
    // Navigate to chat view immediately
    setImportViewOpen(false);
    handleClose();

    // Call mutation to import holdings to chat
    if (consentType) {
      importHoldingsMut.mutate({ data: modifiedFiData, consentType });
    }
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
            {assetType} Holdings Preview
          </DialogTitle>
          <DialogDescription>
            Review, edit quantities, or add new holdings before analysis
          </DialogDescription>
        </DialogHeader>

        <HoldingsPreviewForm
          defaultValues={formDefaultValues}
          consentType={consentType!}
          fiData={fiData}
          isLoading={isLoading}
          isImporting={importHoldingsMut.isPending}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
