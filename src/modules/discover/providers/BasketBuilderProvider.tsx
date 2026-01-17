"use client";

import { createContext, ReactNode, useState } from "react";
import type { InvestmentType } from "../types/basket-builder.types";

/**
 * Context value interface for basket builder orchestrator
 * Only manages investment type selection
 */
export interface BasketBuilderContextValue {
  investmentType: InvestmentType;
  setInvestmentType: (type: InvestmentType) => void;
  resetInvestmentType: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const BasketBuilderContext = createContext<
  BasketBuilderContextValue | undefined
>(undefined);

interface BasketBuilderProviderProps {
  children: ReactNode;
}

/**
 * Orchestrator provider for basket builder
 * Manages only the investment type selection (stocks vs mutual funds)
 * Actual basket configuration is handled by separate providers
 */
export function BasketBuilderProvider({
  children,
}: BasketBuilderProviderProps) {
  const [investmentType, setInvestmentType] = useState<InvestmentType>("");

  /**
   * Reset investment type to empty state
   */
  const resetInvestmentType = () => {
    setInvestmentType("");
  };

  const value: BasketBuilderContextValue = {
    investmentType,
    setInvestmentType,
    resetInvestmentType,
  };

  return (
    <BasketBuilderContext.Provider value={value}>
      {children}
    </BasketBuilderContext.Provider>
  );
}
