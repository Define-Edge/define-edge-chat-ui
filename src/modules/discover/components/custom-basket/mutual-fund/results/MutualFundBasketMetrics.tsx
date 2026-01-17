import { Badge } from "@/components/ui/badge";
import type { GeneratedMutualFundBasket } from "../../../../types/basket-builder.types";

interface MutualFundBasketMetricsProps {
  basket: GeneratedMutualFundBasket;
}

/**
 * Mutual fund basket key metrics section
 * Displays risk level, volatility, and Sharpe ratio
 */
export function MutualFundBasketMetrics({
  basket,
}: MutualFundBasketMetricsProps) {
  /**
   * Get risk level badge styling
   */
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-success-bg text-success-fg border-success-border";
      case "Medium":
        return "bg-warning-bg text-warning-fg border-warning-border";
      case "High":
        return "bg-error-bg text-error-fg border-error-border";
      default:
        return "bg-bg-subtle text-text-secondary border-border-subtle";
    }
  };

  return (
    <div className="px-6 py-4 bg-bg-base border-b border-border-subtle">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Badge className={`text-xs ${getRiskColor(basket.riskLevel)} mb-1`}>
            {basket.riskLevel} Risk
          </Badge>
          <div className="text-xs text-text-secondary">Risk Level</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">
            {basket.volatility}
          </div>
          <div className="text-xs text-text-secondary">Volatility</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">
            {basket.sharpeRatio}
          </div>
          <div className="text-xs text-text-secondary">Sharpe Ratio</div>
        </div>
      </div>
    </div>
  );
}
