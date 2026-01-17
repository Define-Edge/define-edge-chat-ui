import { ArrowLeft, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { mutualFundBasketSteps } from "../../../constants/mutual-fund-basket-data";
import { PlanTypeStep } from "./steps/PlanTypeStep";
import { CategoryPreferenceStep } from "./steps/CategoryPreferenceStep";
import { FundCategoriesStep } from "./steps/FundCategoriesStep";
import { SchemeCountStep } from "./steps/SchemeCountStep";

/**
 * Multi-step form container for mutual fund basket builder
 * Renders appropriate step based on current state
 */
export function MutualFundBasketForm() {
  const { currentStep, prevStep, totalSteps } =
    useMutualFundBasketBuilderContext();
  const { resetInvestmentType } = useBasketBuilderContext();

  /**
   * Render the current step component
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PlanTypeStep />;
      case 2:
        return <CategoryPreferenceStep />;
      case 3:
        return <FundCategoriesStep />;
      case 4:
        return <SchemeCountStep />;
      default:
        return <PlanTypeStep />;
    }
  };

  /**
   * Get current step info for display
   */
  const getCurrentStepInfo = () => {
    if (currentStep >= 1 && currentStep <= totalSteps) {
      return mutualFundBasketSteps[currentStep - 1];
    }
    return mutualFundBasketSteps[0];
  };

  const stepInfo = getCurrentStepInfo();

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    if (currentStep === 1) {
      resetInvestmentType();
    } else {
      prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-bg-base px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-bg-hover rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-icon-primary" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-text-primary">
                Mutual Fund Basket Builder
              </h1>
              <p className="text-xs text-text-secondary">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-bg-base px-6 py-3 border-b border-border-subtle">
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        {/* Step Indicator */}
        <div className="bg-bg-base px-6 py-3 border-b border-border-subtle">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium text-text-primary">
                {stepInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
