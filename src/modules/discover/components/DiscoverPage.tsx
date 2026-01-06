"use client";
import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Crown,
  Layers,
  Lightbulb,
  Newspaper,
  Star,
  Users,
} from "lucide-react";
import { DiscoverHeader } from "./DiscoverHeader";
import { CollapsibleInfo } from "./shared/CollapsibleInfo";
import { CustomBasketBuilderCard } from "./cards/CustomBasketBuilderCard";
import { DropdownSection } from "./sections/DropdownSection";
import { AdvisorStrategyCard } from "./cards/AdvisorStrategyCard";
import { InvestmentBasketCard } from "./cards/InvestmentBasketCard";
import { ThematicBasketCard } from "./cards/ThematicBasketCard";
import { InvestorBasketCard } from "./cards/InvestorBasketCard";
import { AdvisorStrategyDetailsPage } from "./advisor-details/AdvisorStrategyDetailsPage";
import { StrategyMasterDetail } from "@/api/generated/strategy-apis/models";
import { useGetAllStrategiesApiStrategiesGet } from "@/api/generated/strategy-apis/strategy-apis/strategy-apis";
import {
  curatedBaskets,
  investorBaskets,
  newsBasedBaskets,
  researchPaperBaskets,
  specialBaskets,
  thematicBaskets,
} from "../constants/discover-data";

/**
 * Main Discover page component
 * Orchestrates all sub-components and manages section expansion state
 * Displays investment baskets organized by categories with collapsible sections
 */
export function DiscoverPage() {
  const [selectedAdvisorStrategy, setSelectedAdvisorStrategy] =
    useState<StrategyMasterDetail | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    advisorStrategies: false,
    specialOpportunities: false,
    newsBasedBaskets: false,
    researchPaperBaskets: false,
    curatedBaskets: false,
    thematicThemes: false,
    investorStrategies: false,
  });

  // Fetch advisor strategies from API
  const { data, isLoading, error } = useGetAllStrategiesApiStrategiesGet();
  const advisorStrategies = data?.data.strategies || [];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAdvisorStrategyClick = (strategy: StrategyMasterDetail) => {
    setSelectedAdvisorStrategy(strategy);
  };

  const handleBackFromDetails = () => {
    setSelectedAdvisorStrategy(null);
  };

  // Show Advisor Strategy Details page if a strategy is selected
  if (selectedAdvisorStrategy) {
    return (
      <AdvisorStrategyDetailsPage
        strategy={selectedAdvisorStrategy}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 pb-24 space-y-6">
      <DiscoverHeader />

      <CollapsibleInfo
        title="Investment Discovery"
        description="Explore thematic baskets, trending investment themes, curated portfolios, and news-based investment opportunities tailored to your financial goals."
        icon={Lightbulb}
        bgColor="bg-info-bg border-info-border"
        iconBgColor="bg-info-icon-bg"
        textColor="text-info-foreground"
        iconColor="text-info-icon"
        defaultExpanded={true}
      />

      <CustomBasketBuilderCard />

      <div className="space-y-4">
        <DropdownSection
          title="Created by Advisors"
          icon={Users}
          iconColor="text-accent-purple"
          count={advisorStrategies.length}
          isExpanded={expandedSections.advisorStrategies}
          onToggle={() => toggleSection("advisorStrategies")}
        >
          {isLoading && (
            <div className="text-center py-4 text-text-secondary">
              Loading strategies...
            </div>
          )}
          {error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load strategies. Please try again later.
            </div>
          ) : null}
          {!isLoading && !error && advisorStrategies.map((strategy, index) => (
            <AdvisorStrategyCard
              key={strategy.strategy || `advisor-${index}`}
              strategy={strategy}
              onClick={() => handleAdvisorStrategyClick(strategy)}
            />
          ))}
        </DropdownSection>

        <DropdownSection
          title="Special Investment Opportunities"
          icon={AlertTriangle}
          iconColor="text-accent-red"
          count={specialBaskets.length}
          isExpanded={expandedSections.specialOpportunities}
          onToggle={() => toggleSection("specialOpportunities")}
        >
          {specialBaskets.map((basket, index) => (
            <InvestmentBasketCard key={`special-${index}`} {...basket} />
          ))}
        </DropdownSection>

        <DropdownSection
          title="News-Based Investment Baskets"
          icon={Newspaper}
          iconColor="text-accent-blue"
          count={newsBasedBaskets.length}
          isExpanded={expandedSections.newsBasedBaskets}
          onToggle={() => toggleSection("newsBasedBaskets")}
        >
          {newsBasedBaskets.map((basket, index) => (
            <InvestmentBasketCard key={`news-${index}`} {...basket} />
          ))}
        </DropdownSection>

        <DropdownSection
          title="Ideas from Research Papers"
          icon={BookOpen}
          iconColor="text-accent-indigo"
          count={researchPaperBaskets.length}
          isExpanded={expandedSections.researchPaperBaskets}
          onToggle={() => toggleSection("researchPaperBaskets")}
        >
          {researchPaperBaskets.map((basket, index) => (
            <InvestmentBasketCard key={`research-${index}`} {...basket} />
          ))}
        </DropdownSection>

        <DropdownSection
          title="Curated Investment Baskets"
          icon={Star}
          iconColor="text-accent-yellow"
          count={curatedBaskets.length}
          isExpanded={expandedSections.curatedBaskets}
          onToggle={() => toggleSection("curatedBaskets")}
        >
          {curatedBaskets.map((basket, index) => (
            <InvestmentBasketCard key={`curated-${index}`} {...basket} />
          ))}
        </DropdownSection>

        <DropdownSection
          title="Trending Investment Themes"
          icon={Layers}
          iconColor="text-accent-purple"
          count={thematicBaskets.length}
          isExpanded={expandedSections.thematicThemes}
          onToggle={() => toggleSection("thematicThemes")}
        >
          <div className="grid grid-cols-2 gap-3">
            {thematicBaskets.map((basket, index) => (
              <ThematicBasketCard key={`thematic-${index}`} {...basket} />
            ))}
          </div>
        </DropdownSection>

        <DropdownSection
          title="Famous Investor Strategies"
          icon={Crown}
          iconColor="text-accent-amber"
          count={investorBaskets.length}
          isExpanded={expandedSections.investorStrategies}
          onToggle={() => toggleSection("investorStrategies")}
        >
          {investorBaskets.map((basket, index) => (
            <InvestorBasketCard key={`investor-${index}`} {...basket} />
          ))}
        </DropdownSection>
      </div>
    </div>
  );
}
