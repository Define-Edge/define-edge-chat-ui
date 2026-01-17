import { Check, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../../hooks/useMutualFundBasketBuilderContext";

/**
 * Step 4: Scheme count selection for mutual fund baskets
 * Allows user to select number of schemes per category
 */
export function SchemeCountStep() {
  const { basketConfig, updateSchemesCount, handleComplete } =
    useMutualFundBasketBuilderContext();

  /**
   * Calculate total schemes across all categories
   */
  const totalSchemes = basketConfig.fundCategories.reduce(
    (sum, cat) => sum + cat.schemesCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Number of schemes per category
        </p>
      </div>

      {/* Selected Categories */}
      {basketConfig.fundCategories.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">
            Selected Categories
          </label>
          {basketConfig.fundCategories.map((category) => (
            <Card
              key={category.id}
              className="p-4 border-border-default bg-bg-base"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">
                    {category.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {category.percentage}% allocation
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateSchemesCount(category.id, -1)
                      }
                      className="w-8 h-8 rounded-full bg-bg-base border border-border-default flex items-center justify-center hover:bg-bg-hover transition-colors"
                      disabled={category.schemesCount <= 0}
                    >
                      <Minus className="w-4 h-4 text-text-primary" />
                    </button>
                    <span className="text-sm font-semibold text-text-primary w-12 text-center">
                      {category.schemesCount}
                    </span>
                    <button
                      onClick={() =>
                        updateSchemesCount(category.id, 1)
                      }
                      className="w-8 h-8 rounded-full bg-bg-base border border-border-default flex items-center justify-center hover:bg-bg-hover transition-colors"
                    >
                      <Plus className="w-4 h-4 text-text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {basketConfig.fundCategories.length > 0 && (
        <div className="bg-info-bg border border-info-border rounded-lg p-3">
          <p className="text-xs text-info-foreground font-medium text-center">
            ✓ Total {totalSchemes} scheme{totalSchemes !== 1 ? "s" : ""}{" "}
            across {basketConfig.fundCategories.length} categor
            {basketConfig.fundCategories.length === 1 ? "y" : "ies"}
          </p>
        </div>
      )}

      {/* Complete Button */}
      {basketConfig.fundCategories.length > 0 && (
        <div className="pt-4">
          <Button
            onClick={handleComplete}
            className="w-full h-12 bg-accent-green hover:bg-success-fg text-white"
          >
            Create My Basket
            <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
