/**
 * Bank Accounts Preview Modal - Container Component
 * Handles modal state, data fetching, and submission for bank accounts
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
import { BarChart3, CreditCard } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import useModalState from "@/hooks/useModalState";
import { BaseAnalysisModalProps } from "@/modules/import-data/types";
import { useBankAccountsData } from "./hooks/useBankAccountsData";
import { useImportBankAccountsMutation } from "./hooks/useImportBankAccountsMutation";
import { BankAccountsPreviewForm } from "./BankAccountsPreviewForm";

/**
 * Modal component for bank accounts preview
 * Allows users to review and import bank account information to chat
 */
export function BankAccountsPreviewModal({ consent }: BaseAnalysisModalProps) {
  const { open, handleClose, handleOpenChange } = useModalState();

  const consentID = consent?.consentID;
  const isDataReady = consent?.isDataReady;

  const [, setImportViewOpen] = useQueryState(
    "importViewOpen",
    parseAsBoolean.withDefault(false),
  );

  const importMutation = useImportBankAccountsMutation();

  // Fetch and transform bank accounts data
  const { formDefaultValues, isLoading, fiData } = useBankAccountsData(
    consentID,
    !!isDataReady,
  );

  const handleSubmit = (modifiedFiData: typeof fiData) => {
    if (!modifiedFiData) return;

    // Navigate to chat view immediately
    setImportViewOpen(false);
    handleClose();

    // Call mutation to import bank accounts to chat
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
            <CreditCard className="w-5 h-5 text-blue-600" />
            Bank Accounts Preview
          </DialogTitle>
          <DialogDescription>
            Review your bank account information before analysis
          </DialogDescription>
        </DialogHeader>

        <BankAccountsPreviewForm
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
