import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStockBasketBuilderContext } from "../../../../hooks/useStockBasketBuilderContext";
import { portfolioAllocationOptions } from "../../../../constants/stock-basket-data";

/**
 * Step 4: Portfolio allocation strategy selection for stock baskets
 * Allows user to choose how weightage is distributed across stocks
 */
export function PortfolioAllocationStep() {
  const { basketConfig, updateConfig, handleComplete, isGenerating } =
    useStockBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="mb-4 text-center">
        <p className="text-text-secondary text-sm">
          Choose how to distribute the weightage across stocks
        </p>
      </div>

      <div className="space-y-3">
        {portfolioAllocationOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer p-4 transition-all ${
              basketConfig.portfolioAllocation === option.id
                ? "border-accent-blue bg-info-bg"
                : "hover:border-info-border"
            }`}
            onClick={() => updateConfig("portfolioAllocation", option.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-text-primary font-medium">{option.name}</h4>
                <p className="text-text-secondary text-sm">
                  {option.description}
                </p>
              </div>
              {basketConfig.portfolioAllocation === option.id && (
                <Check className="text-accent-blue h-5 w-5" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {basketConfig.portfolioAllocation && (
        <div className="pt-4">
          <Button
            onClick={handleComplete}
            disabled={isGenerating}
            className="bg-accent-green hover:bg-success-fg h-12 w-full text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                Generating Basket
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Create My Basket
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
