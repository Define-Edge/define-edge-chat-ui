/**
 * Bank Accounts Preview Form Component
 * Manages form state for bank accounts and renders UI components
 */

"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { Loader2 } from "lucide-react";
import {
  BankAccountWithFormData,
  BankAccountsFiDataResponse,
} from "@/modules/import-data/types/bank-accounts";
import { transformFormDataToBankAccounts } from "./utils/bank-accounts-transformer";
// Reuse shared components from HoldingsPreviewModal
import { HoldingsSummaryCard } from "../HoldingsPreviewModal/components/HoldingsSummaryCard";
import { HoldingsTable } from "../HoldingsPreviewModal/components/HoldingsTable";
import {
  useHoldingsForm,
  HoldingFormData,
} from "../HoldingsPreviewModal/hooks/useHoldingsForm";

type BankAccountsPreviewFormProps = {
  /** Initial form values (bank accounts with display fields) */
  defaultValues: BankAccountWithFormData[];
  /** Raw FI data for creating modified payload */
  fiData: BankAccountsFiDataResponse | undefined;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether import mutation is in progress */
  isImporting: boolean;
  /** Callback when form is submitted */
  onSubmit: (modifiedFiData: BankAccountsFiDataResponse) => void;
  /** Callback to close modal */
  onClose: () => void;
};

/**
 * Form component for bank accounts preview and editing
 * Manages form state and renders child components
 */
export function BankAccountsPreviewForm({
  defaultValues,
  fiData,
  isLoading,
  isImporting,
  onSubmit,
  onClose,
}: BankAccountsPreviewFormProps) {
  const { control, handleSubmit, fields, handleRemoveHolding } =
    useHoldingsForm(defaultValues as any, ConsentType.BANK_ACCOUNTS);

  const handleFormSubmit = (data: HoldingFormData) => {
    if (!fiData) return;

    // Transform form data back to bank accounts (filters quantity=0)
    const convertedAccounts = transformFormDataToBankAccounts(
      data.holdings as BankAccountWithFormData[],
    );

    onSubmit(convertedAccounts);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex-1 overflow-hidden flex flex-col"
    >
      <div className="flex-1 overflow-y-auto space-y-4 px-1">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">
              Loading bank accounts...
            </span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Summary Card */}
            <HoldingsSummaryCard
              totalHoldings={fields.length}
              assetType="Bank Account"
            />

            {/* Bank Accounts Table */}
            <HoldingsTable
              fields={fields}
              control={control}
              consentType={ConsentType.BANK_ACCOUNTS}
              onRemove={handleRemoveHolding}
            />
          </>
        )}
      </div>

      <DialogFooter className="flex justify-between items-center mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isImporting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || fields.length === 0 || isImporting}
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding to Chat...
            </>
          ) : (
            "Add to Chat & Analyze"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
