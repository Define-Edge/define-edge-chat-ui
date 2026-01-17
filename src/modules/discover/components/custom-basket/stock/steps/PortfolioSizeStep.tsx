import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStockBasketBuilderContext } from "../../../../hooks/useStockBasketBuilderContext";
import { portfolioSizeOptions } from "../../../../constants/stock-basket-data";

/**
 * Step 3: Portfolio size selection for stock baskets
 * Allows user to choose concentrated (15), diversified (25), or custom number
 */
export function PortfolioSizeStep() {
  const { basketConfig, updateConfig, nextStep, canProceed } =
    useStockBasketBuilderContext();

  /**
   * Handle portfolio size option selection
   */
  const handlePortfolioSizeSelect = (optionId: string, stockCount: string) => {
    updateConfig("portfolioSize", optionId);
    if (optionId !== "custom") {
      updateConfig("customStockCount", stockCount);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          How many stocks would you like in your basket?
        </p>
      </div>

      <div className="space-y-3">
        {portfolioSizeOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              basketConfig.portfolioSize === option.id
                ? "border-accent-blue bg-info-bg"
                : "hover:border-info-border"
            }`}
            onClick={() =>
              handlePortfolioSizeSelect(option.id, option.stockCount || "")
            }
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
              {basketConfig.portfolioSize === option.id && (
                <Check className="w-5 h-5 text-accent-blue" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Stock Count Input */}
      {basketConfig.portfolioSize === "custom" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Enter number of stocks
          </label>
          <Input
            type="number"
            min="1"
            max="50"
            placeholder="e.g., 20"
            value={basketConfig.customStockCount}
            onChange={(e) => updateConfig("customStockCount", e.target.value)}
            className="w-full h-12 text-base"
          />
          <p className="text-xs text-text-secondary">
            Choose between 1 and 50 stocks
          </p>
        </div>
      )}

      {basketConfig.portfolioSize && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="w-full h-12 bg-accent-blue hover:bg-info-icon text-white disabled:bg-muted disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
