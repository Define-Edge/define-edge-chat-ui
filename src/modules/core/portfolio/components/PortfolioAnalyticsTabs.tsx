"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioAnalytics } from "@/api/generated/strategy-apis/models";
import { MissingHoldingsWarning } from "./MissingHoldingsWarning";
import { OverviewTab } from "./tabs/OverviewTab";
import { HoldingsTab } from "./tabs/HoldingsTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";

interface PortfolioAnalyticsTabsProps {
  /**
   * Portfolio analytics data containing holdings, distributions, returns, scores, etc.
   */
  analytics: PortfolioAnalytics;
  /**
   * Whether to show the missing holdings warning
   * @default true
   */
  showMissingHoldingsWarning?: boolean;
}

/**
 * Reusable Portfolio Analytics Tabs Component
 *
 * Displays comprehensive portfolio analytics with three tabs:
 * - Overview: Industry and market cap allocation charts
 * - Holdings: Detailed holdings table
 * - Analytics: Returns chart and score analysis
 *
 * Handles both long-only and long-short portfolios with appropriate visualizations.
 *
 * Used in:
 * - Advisor Strategy Details Page
 * - Custom Basket Results Page
 */
export function PortfolioAnalyticsTabs({
  analytics,
  showMissingHoldingsWarning = true,
}: PortfolioAnalyticsTabsProps) {
  // Check if all stocks are missing
  const allStocksMissing =
    analytics.missing_holdings &&
    analytics.holdings &&
    analytics.missing_holdings.length === analytics.holdings.length;

  // Check if this is a long-short portfolio
  const isLongShort = analytics.portfolio_type === "long_short";

  // Set default tab based on whether all stocks are missing
  const [activeTab, setActiveTab] = useState(
    allStocksMissing ? "holdings" : "overview"
  );

  return (
    <>
      {/* Missing Holdings Warning - only show if some (not all) stocks are missing */}
      {showMissingHoldingsWarning &&
        analytics.missing_holdings &&
        analytics.missing_holdings.length > 0 &&
        !allStocksMissing && (
          <MissingHoldingsWarning missingHoldings={analytics.missing_holdings} />
        )}

      {/* Content Tabs */}
      <div className="px-6 py-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList
            className={`mb-6 grid w-full ${allStocksMissing ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-3"}`}
          >
            {!allStocksMissing && (
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
            )}
            <TabsTrigger value="holdings" className="text-xs">
              Holdings
            </TabsTrigger>
            {!allStocksMissing && (
              <TabsTrigger value="analytics" className="text-xs">
                Analytics
              </TabsTrigger>
            )}
          </TabsList>

          {!allStocksMissing && (
            <TabsContent value="overview">
              <OverviewTab
                industryDistribution={analytics.industry_distribution}
                sizeDistribution={analytics.size_distribution}
                isLongShort={isLongShort}
              />
            </TabsContent>
          )}

          <TabsContent value="holdings">
            <HoldingsTab holdings={analytics.holdings} />
          </TabsContent>

          {!allStocksMissing && (
            <TabsContent value="analytics">
              <AnalyticsTab
                returnsChartData={analytics.returns_chart_data}
                overallScoreChartData={analytics.overall_score_chart_data}
                riskScoreChartData={analytics.risk_score_chart_data}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
