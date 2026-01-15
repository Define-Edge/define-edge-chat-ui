import { Progress } from "@/components/ui/progress";
import { Target, ArrowLeft } from "lucide-react";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";
import { steps } from "../../constants/basket-builder-data";

/**
 * Progress indicator for multi-step basket builder form
 * Shows current step, progress bar, and step title
 */
export function StepIndicator() {
  const { currentStep, totalSteps, prevStep } = useBasketBuilderContext();
  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="border-b border-border-default">
      <div className="px-6 py-3">
        <Progress value={progressPercentage} className="w-full" />
        <div className="flex justify-center mt-2">
          <p className="text-xs text-text-tertiary">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
      <div className="px-6 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="hover:bg-bg-hover rounded-full transition-colors disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Go to previous step"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-blue" />
            <span className="text-sm font-medium text-text-primary">
              {currentStepData?.title}
            </span>
          </div>
          <div className="w-8"></div>
        </div>
      </div>
    </div>
  );
}
