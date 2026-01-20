import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PieChart } from "lucide-react";
import { mutualFundBasketSteps } from "../../../constants/mutual-fund-basket-data";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { CategoryPreferenceStep } from "./steps/CategoryPreferenceStep";
import { FundCategoriesStep } from "./steps/FundCategoriesStep";
import { PlanTypeStep } from "./steps/PlanTypeStep";
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
    <div className="bg-bg-subtle flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-col md:max-w-2xl">
        {/* Header */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="hover:bg-bg-hover rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="text-icon-primary h-5 w-5" />
            </button>
            <div className="text-center">
              <h1 className="text-text-primary text-lg font-semibold">
                Mutual Fund Basket Builder
              </h1>
              <p className="text-text-secondary text-xs">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-3">
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        {/* Step Indicator */}
        <div className="bg-bg-base border-border-subtle border-b px-6 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <PieChart className="text-accent-blue h-4 w-4" />
              <span className="text-text-primary text-sm font-medium">
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
