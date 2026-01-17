import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStockBasketBuilderContext } from "../../../../hooks/useStockBasketBuilderContext";
import { investmentStyleOptions } from "../../../../constants/stock-basket-data";

/**
 * Step 1: Investment style selection for stock baskets
 * Allows user to choose between Growth, Value, Momentum, or Quality
 */
export function InvestmentStyleStep() {
  const { basketConfig, updateConfig, nextStep } =
    useStockBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Choose your preferred investment approach
        </p>
      </div>

      <div className="space-y-3">
        {investmentStyleOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              basketConfig.investmentStyle === option.id
                ? "border-accent-blue bg-info-bg"
                : "hover:border-info-border"
            }`}
            onClick={() => updateConfig("investmentStyle", option.id)}
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
              {basketConfig.investmentStyle === option.id && (
                <Check className="w-5 h-5 text-accent-blue" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {basketConfig.investmentStyle && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            className="w-full h-12 bg-accent-blue hover:bg-info-icon text-white"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
