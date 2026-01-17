import { Badge } from "@/components/ui/badge";
import type { MutualFundBasketConfig } from "../../../../types/basket-builder.types";

interface MutualFundConfigSummaryProps {
  basketConfig: MutualFundBasketConfig;
}

/**
 * Mutual fund basket configuration summary
 * Displays user's applied preferences as badges
 */
export function MutualFundConfigSummary({
  basketConfig,
}: MutualFundConfigSummaryProps) {
  return (
    <div className="px-6 py-4 bg-success-bg border-b border-border-subtle">
      <h3 className="text-sm font-medium text-text-primary mb-3">
        Your Preferences Applied
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* Plan Type */}
        <Badge variant="secondary" className="text-xs">
          {basketConfig.planType.charAt(0).toUpperCase() +
            basketConfig.planType.slice(1)}{" "}
          Plan
        </Badge>

        {/* Fund Categories */}
        {basketConfig.fundCategories.map((category) => (
          <Badge key={category.id} variant="secondary" className="text-xs">
            {category.name}: {category.percentage}%
          </Badge>
        ))}
      </div>

      {/* MF Preferences */}
      {basketConfig.mfPreferences && (
        <div className="mt-3 p-3 bg-bg-base rounded-lg border border-success-border">
          <h4 className="text-xs font-medium text-text-primary mb-1">
            Fund Preferences:
          </h4>
          <p className="text-xs text-text-secondary">
            {basketConfig.mfPreferences}
          </p>
        </div>
      )}
    </div>
  );
}
