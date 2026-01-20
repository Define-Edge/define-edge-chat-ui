"use client";

import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";
import { Button } from "@/components/ui/button";
import { PortfolioAnalyticsTabs } from "@/modules/core/portfolio/components";
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
  const importMutation = useImportStrategyMutation();

  const handleAddToChat = () => {
    // Import strategy to chat
    importMutation.mutate({ strategy });
  };

  return (
    <>
      {/* Content */}
      <div className="bg-bg-subtle mx-auto max-w-5xl">
        {/* Header with action buttons */}
        <div className="border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="link"
              className="cursor-pointer text-gray-600"
            >
              <Link href="/discover">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
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
        <AdvisorInfoSection
          strategy={strategy}
          isLongShort={strategy.analytics.portfolio_type === "long_short"}
        />

        {/* Portfolio Analytics Tabs */}
        <PortfolioAnalyticsTabs analytics={strategy.analytics} />

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
    </>
  );
}
