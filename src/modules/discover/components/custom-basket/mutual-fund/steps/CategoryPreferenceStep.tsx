import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutualFundBasketBuilderContext } from "../../../../hooks/useMutualFundBasketBuilderContext";
import { categoryPreferenceOptions } from "../../../../constants/mutual-fund-basket-data";

/**
 * Step 2: Category preference selection for mutual fund baskets
 * Allows user to choose between preset allocations or custom build
 */
export function CategoryPreferenceStep() {
  const { basketConfig, setCategoryPreference, nextStep } =
    useMutualFundBasketBuilderContext();

  /**
   * Handle preference selection
   */
  const handleSelectPreference = (
    preferenceId: string,
    categories: typeof categoryPreferenceOptions[0]["categories"]
  ) => {
    setCategoryPreference(preferenceId, categories);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Choose allocation style
        </p>
      </div>

      <div className="space-y-3">
        {categoryPreferenceOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              basketConfig.categoryPreference === option.id
                ? "border-accent-blue bg-info-bg"
                : "hover:border-border-hover"
            }`}
            onClick={() =>
              handleSelectPreference(option.id, option.categories)
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
                {option.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {option.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-bg-subtle text-text-tertiary px-2 py-1 rounded"
                      >
                        {cat.name}: {cat.percentage}%
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {basketConfig.categoryPreference === option.id && (
                <Check className="w-5 h-5 text-accent-blue flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {basketConfig.categoryPreference && (
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
