"use client";
import ImportHoldings from "@/components/moneyone/import-holdings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { CheckCircle, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useConsentQuery } from "../../hooks/useConsentQuery";
import { useRefreshFiData } from "../../hooks/useFiData";
import { formatLastUpdated } from "../../utils/date-formatting";
import { HoldingsPreviewModal } from "../modals/HoldingsPreviewModal";

type MoneyOneHoldingsCardProps = {
  consentType: ConsentType;
  icon: React.ElementType;
  title: string;
  description: string;
};

/**
 * Reusable card component for MoneyOne-connected holdings (Equity & Mutual Funds)
 * Displays connection status and import button
 */
export function MoneyOneHoldingsCard({
  consentType,
  icon: Icon,
  title,
  description,
}: MoneyOneHoldingsCardProps) {
  const { data: consent } = useConsentQuery(consentType);
  const { mutate: refreshData, isPending: isRefreshing } = useRefreshFiData();

  const isDataReady = consent?.isDataReady;
  const lastUpdated = formatLastUpdated(consent?.consentCreationData);

  const handleRefresh = () => {
    if (!consent?.consentID) {
      toast.error("Unable to refresh: consent ID not found");
      return;
    }

    refreshData(consent.consentID, {
      onSuccess: () => {
        toast.success(`${title} data refreshed successfully`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to refresh ${title} data`
        );
      },
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border border-gray-200 h-full gap-0">
      <div className="flex items-start gap-3 h-full">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${
            isDataReady ? "bg-green-50" : "bg-gray-50"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isDataReady ? "text-green-500" : "text-gray-600"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            {isDataReady && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 break-words">{description}</p>

          {/* Last Updated Info */}
          {isDataReady && lastUpdated && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Updated {lastUpdated}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-3">
            {/* Left side - Import/Connect button */}
            <div className="flex items-center gap-2">
              {isDataReady && consent ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      isRefreshing ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {isRefreshing ? "Refreshing..." : "Connected"}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="text-xs p-1.5"
                    title="Refresh data"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              ) : (
                <ImportHoldings consentType={consentType} />
              )}
            </div>

            {/* Right side - Analyse button */}
            <HoldingsPreviewModal consent={consent} />
          </div>
        </div>
      </div>
    </Card>
  );
}
