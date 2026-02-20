/**
 * Mutual Funds Preview Form Component
 * Manages form state for mutual fund holdings and renders UI components
 */

"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { MFPortfolioAnalyticsTabs } from "@/modules/core/portfolio/mf-portfolio/components/MFPortfolioAnalyticsTabs";
import { BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MutualFundHoldingWithQuantity, MutualFundsFiDataResponse } from "@/modules/import-data/types/mutual-funds";
import { transformFormDataToMutualFunds } from "./utils/mutual-funds-transformer";
import { useMutualFundsAnalytics } from "./hooks/useMutualFundsAnalytics";
// Reuse shared components from HoldingsPreviewModal
import { HoldingsSearch } from "../HoldingsPreviewModal/components/HoldingsSearch";
import { HoldingsSummaryCard } from "../HoldingsPreviewModal/components/HoldingsSummaryCard";
import { HoldingsTable } from "../HoldingsPreviewModal/components/HoldingsTable";
import { useHoldingsForm, HoldingFormData } from "../HoldingsPreviewModal/hooks/useHoldingsForm";

type MutualFundsPreviewFormProps = {
  /** Initial form values (mutual fund holdings with quantity) */
  defaultValues: MutualFundHoldingWithQuantity[];
  /** Raw FI data for creating modified payload */
  fiData: MutualFundsFiDataResponse | undefined;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether import mutation is in progress */
  isImporting: boolean;
  /** Callback when form is submitted */
  onSubmit: (modifiedFiData: MutualFundsFiDataResponse) => void;
  /** Callback to close modal */
  onClose: () => void;
};

/**
 * Form component for mutual fund holdings preview and editing
 * Manages form state and renders child components
 */
export function MutualFundsPreviewForm({
  defaultValues,
  fiData,
  isLoading,
  isImporting,
  onSubmit,
  onClose,
}: MutualFundsPreviewFormProps) {
  const {
    control,
    handleSubmit,
    fields,
    handleAddSearchResult,
    handleRemoveHolding,
    getValues,
  } = useHoldingsForm(defaultValues as any, ConsentType.MUTUAL_FUNDS);

  // Analytics hook
  const { analytics, isAnalyzing, analyzePortfolio, reset: resetAnalytics } =
    useMutualFundsAnalytics();

  // Track previous fields length to detect changes
  const prevFieldsLengthRef = useRef(fields.length);

  // Clear analytics when holdings change (add/remove)
  useEffect(() => {
    if (prevFieldsLengthRef.current !== fields.length && analytics) {
      resetAnalytics();
    }
    prevFieldsLengthRef.current = fields.length;
  }, [fields.length, analytics, resetAnalytics]);

  const handleAnalyzeClick = () => {
    const currentHoldings = getValues(
      "holdings",
    ) as MutualFundHoldingWithQuantity[];
    analyzePortfolio(currentHoldings);
  };

  const handleFormSubmit = (data: HoldingFormData) => {
    if (!fiData) {
      toast.error("Holdings data is not available. Please try again.");
      return;
    }

    // Transform form data back to mutual funds (filters quantity=0)
    const convertedMutualFunds = transformFormDataToMutualFunds(
      data.holdings as MutualFundHoldingWithQuantity[],
    );

    // Create consolidated account with all edited holdings
    const firstAccountWithInvestment = fiData.find(
      (account) => account.Summary?.Investment,
    );

    if (!firstAccountWithInvestment?.Summary?.Investment) {
      toast.error("No valid investment account found in holdings data.");
      return;
    }

    const modifiedFiData: MutualFundsFiDataResponse = [
      {
        ...firstAccountWithInvestment,
        Summary: {
          ...firstAccountWithInvestment.Summary,
          Investment: {
            ...firstAccountWithInvestment.Summary.Investment,
            Holdings: {
              ...firstAccountWithInvestment.Summary.Investment.Holdings,
              Holding: convertedMutualFunds,
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
            <span className="ml-2 text-gray-600">Loading mutual fund holdings...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search Bar */}
            <HoldingsSearch
              consentType={ConsentType.MUTUAL_FUNDS}
              onSelectResult={handleAddSearchResult}
            />

            {/* Summary Card */}
            <HoldingsSummaryCard
              totalHoldings={fields.length}
              assetType="Mutual Fund"
            />

            {/* Holdings Table */}
            <HoldingsTable
              fields={fields}
              control={control}
              consentType={ConsentType.MUTUAL_FUNDS}
              onRemove={handleRemoveHolding}
            />

            {/* Analyze Button */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAnalyzeClick}
                disabled={fields.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Portfolio
                  </>
                )}
              </Button>
            </div>

            {/* Analytics Results */}
            {analytics && (
              <div className="border rounded-lg bg-background">
                <MFPortfolioAnalyticsTabs
                  analytics={analytics}
                  showMissingHoldingsWarning={true}
                />
              </div>
            )}
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
