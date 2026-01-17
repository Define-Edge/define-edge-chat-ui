import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../../hooks/useMutualFundBasketBuilderContext";
import { planTypeOptions } from "../../../../constants/mutual-fund-basket-data";

/**
 * Step 1: Plan type selection for mutual fund baskets
 * Allows user to choose between Direct or Regular plan
 */
export function PlanTypeStep() {
  const { basketConfig, updateConfig, nextStep } =
    useMutualFundBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Select your preferred plan
        </p>
      </div>

      <div className="space-y-3">
        {planTypeOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              basketConfig.planType === option.id
                ? "border-accent-blue bg-info-bg"
                : "hover:border-border-hover"
            }`}
            onClick={() => updateConfig("planType", option.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary">
                  {option.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {option.description}
                </p>
              </div>
              {basketConfig.planType === option.id && (
                <Check className="w-5 h-5 text-accent-blue" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {basketConfig.planType && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            className="w-full h-12 bg-accent-blue hover:bg-[#2563eb] text-white"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
