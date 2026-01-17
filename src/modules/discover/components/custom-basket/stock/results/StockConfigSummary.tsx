import { Badge } from "@/components/ui/badge";
import { capitalize } from "lodash";
import type { StockBasketConfig } from "../../../../types/basket-builder.types";

interface StockConfigSummaryProps {
  basketConfig: StockBasketConfig;
}

/**
 * Stock basket configuration summary
 * Displays user's applied preferences as badges
 */
export function StockConfigSummary({
  basketConfig,
}: StockConfigSummaryProps) {
  return (
    <div className="px-6 py-4 bg-info-bg border-b border-border-subtle">
      <h3 className="text-sm font-medium text-text-primary mb-3">
        Your Preferences Applied
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* Investment Style */}
        <Badge variant="secondary" className="text-xs">
          {capitalize(basketConfig.investmentStyle)} Style
        </Badge>

        {/* Market Cap */}
        {basketConfig.marketCap && basketConfig.marketCap.length > 0 && (
          <>
            {basketConfig.marketCap.includes("custom") ? (
              <Badge variant="secondary" className="text-xs">
                Custom Range: ₹{basketConfig.customMarketCapRange[0]}-₹
                {basketConfig.customMarketCapRange[1]} Cr
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                {basketConfig.marketCap.map(capitalize).join(", ")} Cap
              </Badge>
            )}
          </>
        )}

        {/* Portfolio Size */}
        {basketConfig.portfolioSize && (
          <Badge variant="secondary" className="text-xs">
            {basketConfig.portfolioSize === "custom"
              ? `${basketConfig.customStockCount} stocks`
              : `${capitalize(basketConfig.portfolioSize)} (${
                  basketConfig.portfolioSize === "concentrated" ? "15" : "25"
                } stocks)`}
          </Badge>
        )}

        {/* Portfolio Allocation */}
        {basketConfig.portfolioAllocation && (
          <Badge variant="secondary" className="text-xs">
            {capitalize(basketConfig.portfolioAllocation)} Weighted
          </Badge>
        )}
      </div>

      {/* Stock Preferences */}
      {basketConfig.stockPreferences && (
        <div className="mt-3 p-3 bg-bg-base rounded-lg border border-accent-blue">
          <h4 className="text-xs font-medium text-text-primary mb-1">
            Stock Preferences:
          </h4>
          <p className="text-xs text-text-secondary">
            {basketConfig.stockPreferences}
          </p>
        </div>
      )}
    </div>
  );
}
