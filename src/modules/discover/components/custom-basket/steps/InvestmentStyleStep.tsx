import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { investmentStyleOptions } from "../../../constants/basket-builder-data";

/**
 * Step 2: Choose investment style
 * Displays investment style options for user selection
 */
export function InvestmentStyleStep() {
  const { basketConfig, updateConfig, nextStep } = useBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Investment Style
        </h3>
        <p className="text-sm text-text-secondary">
          What's your preferred investment approach?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {investmentStyleOptions.map((option) => {
          const isSelected = basketConfig.investmentStyle === option.id;

          return (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-accent-blue bg-blue-50"
                  : "hover:border-border-default"
              }`}
              onClick={() => updateConfig("investmentStyle", option.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">{option.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {option.description}
                  </p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-accent-blue" />}
              </div>
            </Card>
          );
        })}
      </div>

      {basketConfig.investmentStyle && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            className="w-full h-14 bg-accent-blue hover:bg-blue-600 text-white text-base shadow-lg"
          >
            Proceed to Risk Level
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
