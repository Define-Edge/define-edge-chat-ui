"use client";

import { BasketBuilderProvider } from "../../providers/BasketBuilderProvider";
import { StockBasketBuilderProvider } from "../../providers/StockBasketBuilderProvider";
import { MutualFundBasketBuilderProvider } from "../../providers/MutualFundBasketBuilderProvider";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";
import { InvestmentTypeSelector } from "./InvestmentTypeSelector";
import { StockBasketFlow } from "./stock/StockBasketFlow";
import { MutualFundBasketFlow } from "./mutual-fund/MutualFundBasketFlow";

/**
 * Main orchestrator component for basket builder
 * Routes to correct flow based on investment type selection
 */
function BasketBuilderContent() {
  const { investmentType } = useBasketBuilderContext();

  // Step 0: Investment type selection
  if (!investmentType) {
    return <InvestmentTypeSelector />;
  }

  // Stock flow
  if (investmentType === "stocks") {
    return (
      <StockBasketBuilderProvider>
        <StockBasketFlow />
      </StockBasketBuilderProvider>
    );
  }

  // Mutual fund flow
  if (investmentType === "mutualFunds") {
    return (
      <MutualFundBasketBuilderProvider>
        <MutualFundBasketFlow />
      </MutualFundBasketBuilderProvider>
    );
  }

  return null;
}

/**
 * Custom basket builder page with provider wrapper
 * Entry point for the basket builder feature
 */
export function CustomBasketBuilderPage() {
  return (
    <BasketBuilderProvider>
      <BasketBuilderContent />
    </BasketBuilderProvider>
  );
}
