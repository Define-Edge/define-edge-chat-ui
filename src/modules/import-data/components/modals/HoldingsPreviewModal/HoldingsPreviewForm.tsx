"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { FiDataResponse } from "@/lib/moneyone/moneyone.types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { HoldingsSearch } from "./components/HoldingsSearch";
import { HoldingsSummaryCard } from "./components/HoldingsSummaryCard";
import { HoldingsTable } from "./components/HoldingsTable";
import { HoldingFormData, useHoldingsForm } from "./hooks/useHoldingsForm";
import {
  HoldingWithQuantity,
  getAssetTypeName,
  transformFormDataToHoldings,
} from "./utils/holdings-transformer";

type HoldingsPreviewFormProps = {
  /** Initial form values */
  defaultValues: HoldingWithQuantity[];
  /** Consent type */
  consentType: ConsentType;
  /** Raw FI data for creating modified payload */
  fiData: FiDataResponse | undefined;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether import mutation is in progress */
  isImporting: boolean;
  /** Callback when form is submitted */
  onSubmit: (holdings: ReturnType<typeof transformFormDataToHoldings>, fiData: FiDataResponse) => void;
  /** Callback to close modal */
  onClose: () => void;
};

/**
 * Form component for holdings preview and editing
 * Manages form state and renders child components
 */
export function HoldingsPreviewForm({
  defaultValues,
  consentType,
  fiData,
  isLoading,
  isImporting,
  onSubmit,
  onClose,
}: HoldingsPreviewFormProps) {
  const {
    control,
    handleSubmit,
    fields,
    handleAddSearchResult,
    handleRemoveHolding,
  } = useHoldingsForm(defaultValues, consentType);

  const assetType = getAssetTypeName(consentType);

  const handleFormSubmit = (data: HoldingFormData) => {
    if (!fiData) {
      toast.error("Holdings data is not available. Please try again.");
      return;
    }

    const convertedHoldings = transformFormDataToHoldings(
      data.holdings,
      consentType,
    );

    // Create consolidated account with all edited holdings
    const firstAccountWithInvestment = fiData.find(
      (account) => account.Summary?.Investment,
    );

    if (!firstAccountWithInvestment?.Summary?.Investment) {
      toast.error("Could not find investment data. Please refresh and try again.");
      return;
    }

    const modifiedFiData = [
      {
        ...firstAccountWithInvestment,
        Summary: {
          ...firstAccountWithInvestment.Summary,
          Investment: {
            ...firstAccountWithInvestment.Summary.Investment,
            Holdings: {
              ...firstAccountWithInvestment.Summary.Investment.Holdings,
              Holding: convertedHoldings,
            },
          },
        },
      },
    ];

    onSubmit(convertedHoldings, modifiedFiData);
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
            <span className="ml-2 text-gray-600">Loading holdings...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search Bar */}
            <HoldingsSearch
              consentType={consentType}
              onSelectResult={handleAddSearchResult}
            />

            {/* Summary Card */}
            <HoldingsSummaryCard
              totalHoldings={fields.length}
              assetType={assetType}
            />

            {/* Holdings Table */}
            <HoldingsTable
              fields={fields}
              control={control}
              consentType={consentType}
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
