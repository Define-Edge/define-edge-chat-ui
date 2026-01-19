"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MFPortfolioAnalytics } from "@/api/generated/mf-portfolio-apis/models";
import type { MFPortfolioItem } from "@/types/mf-portfolio";
import { MFMissingHoldingsWarning } from "./MFMissingHoldingsWarning";
import { MFOverviewTab } from "./tabs/MFOverviewTab";
import { MFHoldingsTab } from "./tabs/MFHoldingsTab";
import { MFAnalyticsTab } from "./tabs/MFAnalyticsTab";

interface MFPortfolioAnalyticsTabsProps {
  /**
   * MF Portfolio analytics data containing holdings, distributions, returns, scores, etc.
   */
  analytics: MFPortfolioAnalytics;
  /**
   * Whether to show the missing holdings warning
   * @default true
   */
  showMissingHoldingsWarning?: boolean;
}

/**
 * Reusable MF Portfolio Analytics Tabs Component
 *
 * Displays comprehensive MF portfolio analytics with three tabs:
 * - Overview: SEBI category allocation chart
 * - Holdings: Detailed holdings table with scheme names, categories, and scores
 * - Analytics: Returns chart, performance/risk score analysis, and cost analysis
 *
 * Handles the case when all schemes are missing from data.
 *
 * Used in:
 * - Mutual Fund Basket Results Page
 */
export function MFPortfolioAnalyticsTabs({
  analytics,
  showMissingHoldingsWarning = true,
}: MFPortfolioAnalyticsTabsProps) {
  // Check if all schemes are missing
  const allSchemesMissing =
    analytics.missing_holdings &&
    analytics.holdings &&
    analytics.missing_holdings.length === analytics.holdings.length;

  // Set default tab based on whether all schemes are missing
  const [activeTab, setActiveTab] = useState(
    allSchemesMissing ? "holdings" : "overview"
  );

  // Cast holdings to the typed MFPortfolioItem array
  const typedHoldings = analytics.holdings as unknown as MFPortfolioItem[];

  return (
    <>
      {/* Missing Holdings Warning - only show if some (not all) schemes are missing */}
      {showMissingHoldingsWarning &&
        analytics.missing_holdings &&
        analytics.missing_holdings.length > 0 &&
        !allSchemesMissing && (
          <MFMissingHoldingsWarning
            missingHoldings={analytics.missing_holdings}
          />
        )}

      {/* Content Tabs */}
      <div className="px-6 py-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList
            className={`mb-6 grid w-full ${allSchemesMissing ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-3"}`}
          >
            {!allSchemesMissing && (
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
            )}
            <TabsTrigger value="holdings" className="text-xs">
              Holdings
            </TabsTrigger>
            {!allSchemesMissing && (
              <TabsTrigger value="analytics" className="text-xs">
                Analytics
              </TabsTrigger>
            )}
          </TabsList>

          {!allSchemesMissing && (
            <TabsContent value="overview">
              <MFOverviewTab
                categoryWiseAllocations={analytics.category_wise_allocations}
              />
            </TabsContent>
          )}

          <TabsContent value="holdings">
            <MFHoldingsTab holdings={typedHoldings} />
          </TabsContent>

          {!allSchemesMissing && (
            <TabsContent value="analytics">
              <MFAnalyticsTab
                returnsChartData={analytics.returns_chart_data}
                performanceScoreChartData={analytics.performance_score_chart_data}
                riskScoreChartData={analytics.risk_score_chart_data}
                costAnalysis={analytics.cost_analysis}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
