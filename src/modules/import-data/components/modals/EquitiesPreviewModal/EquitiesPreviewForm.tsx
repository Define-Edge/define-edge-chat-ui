/**
 * Equities Preview Form Component
 * Manages form state for equity holdings and renders UI components
 */

"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { PortfolioAnalyticsTabs } from "@/modules/core/portfolio/components/PortfolioAnalyticsTabs";
import { BarChart3, Loader2 } from "lucide-react";
import {
  EquityHoldingWithQuantity,
  EquitiesFiDataResponse,
} from "@/modules/import-data/types/equities";
import { transformFormDataToEquities } from "./utils/equities-transformer";
import { useEquitiesAnalytics } from "./hooks/useEquitiesAnalytics";
// Reuse shared components from HoldingsPreviewModal
import { HoldingsSearch } from "../HoldingsPreviewModal/components/HoldingsSearch";
import { HoldingsSummaryCard } from "../HoldingsPreviewModal/components/HoldingsSummaryCard";
import { HoldingsTable } from "../HoldingsPreviewModal/components/HoldingsTable";
import {
  useHoldingsForm,
  HoldingFormData,
} from "../HoldingsPreviewModal/hooks/useHoldingsForm";

type EquitiesPreviewFormProps = {
  /** Initial form values (equity holdings with quantity) */
  defaultValues: EquityHoldingWithQuantity[];
  /** Raw FI data for creating modified payload */
  fiData: EquitiesFiDataResponse | undefined;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether import mutation is in progress */
  isImporting: boolean;
  /** Callback when form is submitted */
  onSubmit: (modifiedFiData: EquitiesFiDataResponse) => void;
  /** Callback to close modal */
  onClose: () => void;
};

/**
 * Form component for equity holdings preview and editing
 * Manages form state and renders child components
 */
export function EquitiesPreviewForm({
  defaultValues,
  fiData,
  isLoading,
  isImporting,
  onSubmit,
  onClose,
}: EquitiesPreviewFormProps) {
  const {
    control,
    handleSubmit,
    fields,
    handleAddSearchResult,
    handleRemoveHolding,
    getValues,
  } = useHoldingsForm(defaultValues as any, ConsentType.EQUITIES);

  // Analytics hook
  const { analytics, isAnalyzing, analyzePortfolio, reset: resetAnalytics } =
    useEquitiesAnalytics();

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
    ) as EquityHoldingWithQuantity[];
    analyzePortfolio(currentHoldings);
  };

  const handleFormSubmit = (data: HoldingFormData) => {
    if (!fiData) return;

    // Transform form data back to equities (filters quantity=0)
    const convertedEquities = transformFormDataToEquities(
      data.holdings as EquityHoldingWithQuantity[],
    );

    // Create consolidated account with all edited holdings
    const firstAccountWithInvestment = fiData.find(
      (account) => account.Summary?.Investment,
    );

    if (!firstAccountWithInvestment?.Summary?.Investment) {
      return;
    }

    const modifiedFiData: EquitiesFiDataResponse = [
      {
        ...firstAccountWithInvestment,
        Summary: {
          ...firstAccountWithInvestment.Summary,
          Investment: {
            ...firstAccountWithInvestment.Summary.Investment,
            Holdings: {
              ...firstAccountWithInvestment.Summary.Investment.Holdings,
              Holding: convertedEquities,
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
            <span className="ml-2 text-gray-600">Loading equity holdings...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search Bar */}
            <HoldingsSearch
              consentType={ConsentType.EQUITIES}
              onSelectResult={handleAddSearchResult}
            />

            {/* Summary Card */}
            <HoldingsSummaryCard
              totalHoldings={fields.length}
              assetType="Equity"
            />

            {/* Holdings Table */}
            <HoldingsTable
              fields={fields}
              control={control}
              consentType={ConsentType.EQUITIES}
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
                <PortfolioAnalyticsTabs
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
