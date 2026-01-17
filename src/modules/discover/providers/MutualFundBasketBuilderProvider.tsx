"use client";

import { createContext, ReactNode, useState } from "react";
import type {
  MutualFundBasketConfig,
  FundCategory,
} from "../types/basket-builder.types";

/**
 * Context value interface for mutual fund basket builder
 */
export interface MutualFundBasketBuilderContextValue {
  basketConfig: MutualFundBasketConfig;
  updateConfig: <K extends keyof MutualFundBasketConfig>(
    key: K,
    value: MutualFundBasketConfig[K]
  ) => void;
  addFundCategory: (categoryId: string, categoryName: string) => void;
  updateFundCategoryPercentage: (categoryId: string, delta: number) => void;
  removeFundCategory: (categoryId: string) => void;
  updateSchemesCount: (categoryId: string, delta: number) => void;
  setCategoryPreference: (preferenceId: string, categories: FundCategory[]) => void;
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

// eslint-disable-next-line react-refresh/only-export-components
export const MutualFundBasketBuilderContext = createContext<
  MutualFundBasketBuilderContextValue | undefined
>(undefined);

interface MutualFundBasketBuilderProviderProps {
  children: ReactNode;
}

/**
 * Provider component for mutual fund basket builder state management
 * Manages multi-step form state, navigation, and results display
 */
export function MutualFundBasketBuilderProvider({
  children,
}: MutualFundBasketBuilderProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [basketConfig, setBasketConfig] = useState<MutualFundBasketConfig>({
    type: "mutualFunds",
    planType: "",
    categoryPreference: "",
    fundCategories: [],
    mfPreferences: "",
  });

  const totalSteps = 4;

  /**
   * Update a single field in basket configuration
   */
  const updateConfig = <K extends keyof MutualFundBasketConfig>(
    key: K,
    value: MutualFundBasketConfig[K]
  ) => {
    setBasketConfig((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Add a fund category with automatic percentage distribution
   */
  const addFundCategory = (categoryId: string, categoryName: string) => {
    if (basketConfig.fundCategories.find((c) => c.id === categoryId)) {
      return; // Category already exists
    }

    const newLength = basketConfig.fundCategories.length + 1;
    const equalPercentage = Math.floor(100 / newLength);
    const remainder = 100 - equalPercentage * newLength;

    // Redistribute existing categories equally
    const redistributedCategories = basketConfig.fundCategories.map(
      (cat, index) => ({
        ...cat,
        percentage: equalPercentage + (index === 0 ? remainder : 0),
      })
    );

    // Add new category with default scheme count of 1
    const newCategory: FundCategory = {
      id: categoryId,
      name: categoryName,
      percentage: equalPercentage,
      schemesCount: 1,
    };

    updateConfig("fundCategories", [...redistributedCategories, newCategory]);
  };

  /**
   * Update fund category percentage with delta (+/- 5)
   */
  const updateFundCategoryPercentage = (categoryId: string, delta: number) => {
    const currentIndex = basketConfig.fundCategories.findIndex(
      (cat) => cat.id === categoryId
    );
    if (currentIndex === -1) return;

    const currentCategory = basketConfig.fundCategories[currentIndex];
    const newPercentage = Math.max(
      5,
      Math.min(95, currentCategory.percentage + delta)
    );
    const actualDelta = newPercentage - currentCategory.percentage;

    if (actualDelta === 0) return;

    const otherCategories = basketConfig.fundCategories.filter(
      (_, index) => index !== currentIndex
    );

    if (otherCategories.length === 0) return; // Only one category, keep it at 100%

    const totalOtherPercentage = otherCategories.reduce(
      (sum, cat) => sum + cat.percentage,
      0
    );

    const updatedCategories = basketConfig.fundCategories.map((cat, index) => {
      if (index === currentIndex) {
        return { ...cat, percentage: newPercentage };
      } else {
        const proportion = cat.percentage / totalOtherPercentage;
        const adjustment = actualDelta * proportion;
        return { ...cat, percentage: Math.round(cat.percentage - adjustment) };
      }
    });

    // Ensure sum is exactly 100%
    const currentSum = updatedCategories.reduce(
      (sum, cat) => sum + cat.percentage,
      0
    );
    if (currentSum !== 100 && otherCategories.length > 0) {
      const diff = 100 - currentSum;
      const firstOtherIndex = updatedCategories.findIndex(
        (_, i) => i !== currentIndex
      );
      updatedCategories[firstOtherIndex].percentage += diff;
    }

    updateConfig("fundCategories", updatedCategories);
  };

  /**
   * Remove a fund category and redistribute percentages
   */
  const removeFundCategory = (categoryId: string) => {
    const remainingCategories = basketConfig.fundCategories.filter(
      (cat) => cat.id !== categoryId
    );

    if (remainingCategories.length === 0) {
      updateConfig("fundCategories", []);
      return;
    }

    // Redistribute percentages equally
    const equalPercentage = Math.floor(100 / remainingCategories.length);
    const remainder = 100 - equalPercentage * remainingCategories.length;

    const redistributedCategories = remainingCategories.map((cat, index) => ({
      ...cat,
      percentage: equalPercentage + (index === 0 ? remainder : 0),
    }));

    updateConfig("fundCategories", redistributedCategories);
  };

  /**
   * Update schemes count for a fund category
   */
  const updateSchemesCount = (categoryId: string, delta: number) => {
    const updatedCategories = basketConfig.fundCategories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          schemesCount: Math.max(0, cat.schemesCount + delta),
        };
      }
      return cat;
    });
    updateConfig("fundCategories", updatedCategories);
  };

  /**
   * Set category preference and apply preset allocation
   */
  const setCategoryPreference = (
    preferenceId: string,
    categories: FundCategory[]
  ) => {
    updateConfig("categoryPreference", preferenceId);
    updateConfig("fundCategories", categories);
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
        return basketConfig.planType !== "";
      case 2:
        return basketConfig.categoryPreference !== "";
      case 3:
        return basketConfig.fundCategories.length > 0;
      case 4:
        return basketConfig.fundCategories.length > 0;
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

  const value: MutualFundBasketBuilderContextValue = {
    basketConfig,
    updateConfig,
    addFundCategory,
    updateFundCategoryPercentage,
    removeFundCategory,
    updateSchemesCount,
    setCategoryPreference,
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
    <MutualFundBasketBuilderContext.Provider value={value}>
      {children}
    </MutualFundBasketBuilderContext.Provider>
  );
}
