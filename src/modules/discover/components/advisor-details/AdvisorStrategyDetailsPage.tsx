"use client";

import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImportStrategyMutation } from "@/modules/discover/hooks/useImportStrategyMutation";
import {
  ArrowLeft,
  Download,
  MessageSquare,
  Share,
  Star,
  StarOff,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdvisorInfoSection } from "./AdvisorInfoSection";
import { MissingHoldingsWarning } from "./MissingHoldingsWarning";
import { StrategyAnalyticsTab } from "./StrategyAnalyticsTab";
import { StrategyHoldingsTab } from "./StrategyHoldingsTab";
import { StrategyOverviewTab } from "./StrategyOverviewTab";

interface AdvisorStrategyDetailsPageProps {
  strategy: StrategyAnalyticsResponse;
}

/**
 * Advisor Strategy Details Page (UI Only)
 * Main page component for displaying advisor strategy details
 * Replaces the Discover page entirely when an advisor strategy is selected
 * Component size: ~150 lines
 */
export function AdvisorStrategyDetailsPage({
  strategy,
}: AdvisorStrategyDetailsPageProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const importMutation = useImportStrategyMutation();

  const handleAddToChat = () => {
    // Import strategy to chat
    importMutation.mutate({ strategy });
  };

  return (
    <div className="bg-bg-subtle mx-auto max-w-5xl">
      {/* Header */}
      <div className="bg-bg-card border-border-subtle relative z-50 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/discover"
            className="hover:bg-bg-hover cursor-pointer rounded-full p-2 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="text-text-secondary h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className="hover:bg-bg-hover cursor-pointer rounded-full p-2 transition-colors"
              aria-label={
                isWatchlisted ? "Remove from watchlist" : "Add to watchlist"
              }
            >
              {isWatchlisted ? (
                <Star className="text-accent-yellow h-5 w-5 fill-current" />
              ) : (
                <StarOff className="text-text-muted h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              className="hover:bg-bg-hover cursor-pointer rounded-full p-2 transition-colors"
              aria-label="Share strategy"
            >
              <Share className="text-text-muted h-5 w-5" />
            </button>
            <button
              type="button"
              className="hover:bg-bg-hover cursor-pointer rounded-full p-2 transition-colors"
              aria-label="Download strategy"
            >
              <Download className="text-text-muted h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Info Section */}
      <AdvisorInfoSection strategy={strategy} />

      {/* Missing Holdings Warning */}
      {strategy.missing_holdings && strategy.missing_holdings.length > 0 && (
        <MissingHoldingsWarning missingHoldings={strategy.missing_holdings} />
      )}

      {/* Content Tabs */}
      <div className="px-6 py-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger
              value="overview"
              className="text-xs"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="holdings"
              className="text-xs"
            >
              Holdings
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-xs"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StrategyOverviewTab
              industryDistribution={strategy.industry_distribution}
              sizeDistribution={strategy.size_distribution}
            />
          </TabsContent>

          <TabsContent value="holdings">
            <StrategyHoldingsTab holdings={strategy.holdings} />
          </TabsContent>

          <TabsContent value="analytics">
            <StrategyAnalyticsTab
              riskLevel={strategy.risk_level}
              returnsChartData={strategy.returns_chart_data}
              overallScoreChartData={strategy.overall_score_chart_data}
              riskScoreChartData={strategy.risk_score_chart_data}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="bg-bg-card border-border-default fixed right-0 bottom-0 left-0 z-40 border-t shadow-lg">
        <div className="mx-auto max-w-md px-6 py-4">
          <Button
            className="bg-accent-blue hover:bg-info-icon w-full py-3 text-white"
            onClick={handleAddToChat}
            disabled={importMutation.isPending}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {importMutation.isPending
              ? "Adding to chat..."
              : "Add to chat & analyze"}
          </Button>
        </div>
      </div>
    </div>
  );
}
