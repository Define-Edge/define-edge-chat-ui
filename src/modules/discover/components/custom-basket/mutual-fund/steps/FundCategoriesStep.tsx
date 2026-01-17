import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { fundCategoryOptions } from "../../../../constants/mutual-fund-basket-data";
import { useMutualFundBasketBuilderContext } from "../../../../hooks/useMutualFundBasketBuilderContext";

/**
 * Step 3: Fund category allocation for mutual fund baskets
 * Allows user to adjust category percentages and add/remove categories
 */
export function FundCategoriesStep() {
  const {
    basketConfig,
    addFundCategory,
    updateFundCategoryPercentage,
    removeFundCategory,
    nextStep,
  } = useMutualFundBasketBuilderContext();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  /**
   * Get available categories (not yet selected)
   */
  const availableCategories = fundCategoryOptions.filter(
    (cat) => !basketConfig.fundCategories.find((fc) => fc.id === cat.id)
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Select categories and allocate weightage
        </p>
      </div>

      {/* Add Category Dropdown */}
      {availableCategories.length > 0 && (
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-text-primary">
            Add Category
          </label>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full h-12 px-4 text-base border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent bg-bg-base text-left flex items-center justify-between"
          >
            <span className="text-text-secondary">
              Select a category to add...
            </span>
            <Plus className="w-4 h-4 text-text-secondary" />
          </button>

          {showCategoryDropdown && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCategoryDropdown(false)}
              ></div>

              {/* Dropdown options */}
              <div className="absolute z-20 w-full mt-1 bg-bg-base border border-border-default rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      addFundCategory(category.id, category.name);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-bg-hover transition-colors border-b border-border-subtle last:border-b-0"
                  >
                    <span className="text-sm text-text-primary">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

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
                </div>
                <div className="flex items-center gap-3">
                  {/* Percentage Adjuster */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateFundCategoryPercentage(category.id, -5)
                      }
                      className="w-8 h-8 rounded-full bg-bg-base border border-border-default flex items-center justify-center hover:bg-bg-hover transition-colors"
                    >
                      <Minus className="w-4 h-4 text-text-primary" />
                    </button>
                    <span className="text-sm font-semibold text-text-primary w-12 text-center">
                      {category.percentage}%
                    </span>
                    <button
                      onClick={() =>
                        updateFundCategoryPercentage(category.id, 5)
                      }
                      className="w-8 h-8 rounded-full bg-bg-base border border-border-default flex items-center justify-center hover:bg-bg-hover transition-colors"
                    >
                      <Plus className="w-4 h-4 text-text-primary" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFundCategory(category.id)}
                    className="w-8 h-8 rounded-full bg-error-bg border border-error-border flex items-center justify-center hover:bg-error-fg hover:border-error-fg transition-colors"
                  >
                    <X className="w-4 h-4 text-error-fg hover:text-white" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {basketConfig.fundCategories.length === 0 && (
        <div className="bg-warning-bg border border-warning-border rounded-lg p-4">
          <p className="text-sm text-warning-fg">
            Please add at least one fund category to continue
          </p>
        </div>
      )}

      {/* Success Indicator */}
      {basketConfig.fundCategories.length > 0 && (
        <div className="bg-info-bg border border-info-border rounded-lg p-3">
          <p className="text-xs text-info-foreground font-medium text-center">
            ✓ 100% weightage allocated across{" "}
            {basketConfig.fundCategories.length}{" "}
            {basketConfig.fundCategories.length === 1
              ? "category"
              : "categories"}
          </p>
        </div>
      )}

      {/* Continue Button */}
      {basketConfig.fundCategories.length > 0 && (
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
