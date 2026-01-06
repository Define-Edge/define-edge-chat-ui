"use client";

import { useState } from "react";
import { ArrowLeft, Star, StarOff, Share, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategyMasterDetail } from "@/api/generated/strategy-apis/models";
import { AdvisorInfoSection } from "./AdvisorInfoSection";
import { StrategyOverviewTab } from "./StrategyOverviewTab";
import { StrategyHoldingsTab } from "./StrategyHoldingsTab";
import { StrategyAnalyticsTab } from "./StrategyAnalyticsTab";

interface AdvisorStrategyDetailsPageProps {
  strategy: StrategyMasterDetail;
  onBack: () => void;
}

/**
 * Advisor Strategy Details Page (UI Only)
 * Main page component for displaying advisor strategy details
 * Replaces the Discover page entirely when an advisor strategy is selected
 * Component size: ~150 lines
 */
export function AdvisorStrategyDetailsPage({
  strategy,
  onBack,
}: AdvisorStrategyDetailsPageProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-bg-subtle mx-auto max-w-5xl">
      {/* Header */}
      <div className="bg-bg-card px-6 py-4 border-b border-border-subtle relative z-50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-bg-hover rounded-full transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className="p-2 hover:bg-bg-hover rounded-full transition-colors cursor-pointer"
              aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isWatchlisted ? (
                <Star className="w-5 h-5 text-accent-yellow fill-current" />
              ) : (
                <StarOff className="w-5 h-5 text-text-muted" />
              )}
            </button>
            <button
              type="button"
              className="p-2 hover:bg-bg-hover rounded-full transition-colors cursor-pointer"
              aria-label="Share strategy"
            >
              <Share className="w-5 h-5 text-text-muted" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-bg-hover rounded-full transition-colors cursor-pointer"
              aria-label="Download strategy"
            >
              <Download className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Info Section */}
      <AdvisorInfoSection strategy={strategy} />

      {/* Content Tabs */}
      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="holdings" className="text-xs">
              Holdings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StrategyOverviewTab />
          </TabsContent>

          <TabsContent value="holdings">
            <StrategyHoldingsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <StrategyAnalyticsTab riskLevel={strategy.risk_level} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-default shadow-lg z-40">
        <div className="max-w-md mx-auto px-6 py-4">
          <Button className="w-full bg-accent-blue hover:bg-info-icon text-white py-3">
            <MessageSquare className="w-4 h-4 mr-2" />
            Add to chat & analyze
          </Button>
        </div>
      </div>
    </div>
  );
}
