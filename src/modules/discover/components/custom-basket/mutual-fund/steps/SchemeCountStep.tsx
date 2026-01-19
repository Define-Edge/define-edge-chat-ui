import { Check, Plus, Minus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../../hooks/useMutualFundBasketBuilderContext";

/**
 * Step 4: Scheme count selection for mutual fund baskets
 * Allows user to select number of schemes per category
 */
export function SchemeCountStep() {
  const { basketConfig, updateSchemesCount, handleComplete, isCreatingPortfolio } =
    useMutualFundBasketBuilderContext();

  /**
   * Calculate total schemes across all categories
   */
  const totalSchemes = basketConfig.fundCategories.reduce(
    (sum, cat) => sum + cat.schemesCount,
    0
  );

  /**
   * Find categories with invalid scheme counts (< 1)
   */
  const invalidCategories = basketConfig.fundCategories.filter(
    (cat) => cat.schemesCount < 1
  );

  /**
   * Check if all categories have valid scheme counts
   */
  const isValid = invalidCategories.length === 0;

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
              key={category.name}
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
                        updateSchemesCount(category.name, -1)
                      }
                      className="w-8 h-8 rounded-full bg-bg-base border border-border-default flex items-center justify-center hover:bg-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={category.schemesCount <= 1}
                    >
                      <Minus className="w-4 h-4 text-text-primary" />
                    </button>
                    <span className="text-sm font-semibold text-text-primary w-12 text-center">
                      {category.schemesCount}
                    </span>
                    <button
                      onClick={() =>
                        updateSchemesCount(category.name, 1)
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

      {/* Validation Warning */}
      {!isValid && (
        <div className="bg-warning-bg border border-warning-border rounded-lg p-4">
          <p className="text-sm text-warning-fg font-medium mb-2">
            Invalid scheme counts
          </p>
          <p className="text-xs text-warning-fg">
            Each category must have at least 1 scheme. Please adjust the
            following:
          </p>
          <ul className="mt-2 space-y-1">
            {invalidCategories.map((cat) => (
              <li key={cat.name} className="text-xs text-warning-fg">
                • {cat.name}: {cat.schemesCount} scheme
                {cat.schemesCount !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      {basketConfig.fundCategories.length > 0 && isValid && (
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
            disabled={!isValid || isCreatingPortfolio}
            className="w-full h-12 bg-accent-green hover:bg-success-fg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingPortfolio ? (
              <>
                Creating Basket...
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                Create My Basket
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
