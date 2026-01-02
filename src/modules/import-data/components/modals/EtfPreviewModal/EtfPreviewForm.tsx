/**
 * ETF Preview Form Component
 * Manages form state for ETF holdings and renders UI components
 *
 * TODO: SET_TYPE - Update if ETF-specific UI components are needed
 */

"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { Loader2 } from "lucide-react";
import { ETFHoldingWithQuantity, ETFFiDataResponse } from "@/modules/import-data/types/etf";
import { transformFormDataToETFs } from "./utils/etf-transformer";
// Reuse shared components from HoldingsPreviewModal
import { HoldingsSearch } from "../HoldingsPreviewModal/components/HoldingsSearch";
import { HoldingsSummaryCard } from "../HoldingsPreviewModal/components/HoldingsSummaryCard";
import { HoldingsTable } from "../HoldingsPreviewModal/components/HoldingsTable";
import { useHoldingsForm, HoldingFormData } from "../HoldingsPreviewModal/hooks/useHoldingsForm";

type EtfPreviewFormProps = {
  /** Initial form values (ETF holdings with quantity) */
  defaultValues: ETFHoldingWithQuantity[];
  /** Raw FI data for creating modified payload */
  fiData: ETFFiDataResponse | undefined;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether import mutation is in progress */
  isImporting: boolean;
  /** Callback when form is submitted */
  onSubmit: (modifiedFiData: ETFFiDataResponse) => void;
  /** Callback to close modal */
  onClose: () => void;
};

/**
 * Form component for ETF holdings preview and editing
 * Manages form state and renders child components
 */
export function EtfPreviewForm({
  defaultValues,
  fiData,
  isLoading,
  isImporting,
  onSubmit,
  onClose,
}: EtfPreviewFormProps) {
  const {
    control,
    handleSubmit,
    fields,
    handleAddSearchResult,
    handleRemoveHolding,
  } = useHoldingsForm(defaultValues as any, ConsentType.ETF);

  const handleFormSubmit = (data: HoldingFormData) => {
    if (!fiData) return;

    // Transform form data back to ETFs (filters quantity=0)
    const convertedETFs = transformFormDataToETFs(
      data.holdings as ETFHoldingWithQuantity[],
    );

    // Create consolidated account with all edited holdings
    const firstAccountWithInvestment = fiData.find(
      (account) => account.Summary?.Investment,
    );

    if (!firstAccountWithInvestment?.Summary?.Investment) {
      return;
    }

    const modifiedFiData: ETFFiDataResponse = [
      {
        ...firstAccountWithInvestment,
        Summary: {
          ...firstAccountWithInvestment.Summary,
          Investment: {
            ...firstAccountWithInvestment.Summary.Investment,
            Holdings: {
              ...firstAccountWithInvestment.Summary.Investment.Holdings,
              Holding: convertedETFs,
            },
          },
        },
      },
    ];

    onSubmit(modifiedFiData);
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
            <span className="ml-2 text-gray-600">Loading ETF holdings...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search Bar - TODO: SET_TYPE - Implement ETF search when API is available */}
            <HoldingsSearch
              consentType={ConsentType.ETF}
              onSelectResult={handleAddSearchResult}
            />

            {/* Summary Card */}
            <HoldingsSummaryCard
              totalHoldings={fields.length}
              assetType="ETF"
            />

            {/* Holdings Table */}
            <HoldingsTable
              fields={fields}
              control={control}
              consentType={ConsentType.ETF}
              onRemove={handleRemoveHolding}
            />
          </>
        )}
      </div>

      <DialogFooter className="flex flex-row justify-between items-center mt-4 gap-2">
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
