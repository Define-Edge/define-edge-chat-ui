"use client";

import { createContext, ReactNode, useState } from "react";
import type { BasketConfig } from "../types/basket-builder.types";

/**
 * Context value interface for basket builder
 */
export interface BasketBuilderContextValue {
  basketConfig: BasketConfig;
  updateConfig: (key: keyof BasketConfig, value: string | string[]) => void;
  toggleArrayValue: (key: keyof BasketConfig, value: string) => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canProceed: () => boolean;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  handleComplete: () => void;
  handleModify: () => void;
}

export const BasketBuilderContext = createContext<
  BasketBuilderContextValue | undefined
>(undefined);

interface BasketBuilderProviderProps {
  children: ReactNode;
}

/**
 * Provider component for basket builder state management
 * Manages multi-step form state, navigation, and results display
 */
export function BasketBuilderProvider({ children }: BasketBuilderProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [basketConfig, setBasketConfig] = useState<BasketConfig>({
    theme: "",
    investmentStyle: "",
    marketCap: [],
    numberOfStocks: "",
    specificConsiderations: "",
  });

  const totalSteps = 5;

  /**
   * Update a single field in basket configuration
   */
  const updateConfig = (key: keyof BasketConfig, value: string | string[]) => {
    setBasketConfig((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Toggle a value in an array field (for multi-select like market cap)
   */
  const toggleArrayValue = (key: keyof BasketConfig, value: string) => {
    const currentValues = basketConfig[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateConfig(key, newValues);
  };

  /**
   * Move to next step
   */
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  /**
   * Move to previous step
   */
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Jump to a specific step
   */
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  /**
   * Check if user can proceed from current step
   */
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return basketConfig.theme !== "";
      case 2:
        return basketConfig.investmentStyle !== "";
      case 3:
        return basketConfig.marketCap.length > 0;
      case 4:
        return basketConfig.numberOfStocks !== "";
      case 5:
        return true; // Specific considerations are optional
      default:
        return false;
    }
  };

  /**
   * Complete the form and show results
   */
  const handleComplete = () => {
    setShowResults(true);
  };

  /**
   * Go back to modify the basket configuration
   */
  const handleModify = () => {
    setShowResults(false);
  };

  const value: BasketBuilderContextValue = {
    basketConfig,
    updateConfig,
    toggleArrayValue,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    showResults,
    setShowResults,
    handleComplete,
    handleModify,
  };

  return (
    <BasketBuilderContext.Provider value={value}>
      {children}
    </BasketBuilderContext.Provider>
  );
}
