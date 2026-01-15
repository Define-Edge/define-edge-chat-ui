import { Badge } from "@/components/ui/badge";
import type { GeneratedBasket } from "../../../types/basket-builder.types";

interface BasketMetricsProps {
  basket: GeneratedBasket;
}

/**
 * Key metrics display for generated basket
 * Shows risk level, volatility, and Sharpe ratio
 */
export function BasketMetrics({ basket }: BasketMetricsProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-risk-low-bg text-risk-low-fg border-risk-low-border";
      case "Medium":
        return "bg-risk-medium-bg text-risk-medium-fg border-risk-medium-border";
      case "High":
        return "bg-risk-high-bg text-risk-high-fg border-risk-high-border";
      default:
        return "bg-bg-subtle text-text-muted border-border-default";
    }
  };

  return (
    <div className="px-6 py-4 bg-bg-card border-b border-border-default">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Badge className={`text-xs ${getRiskColor(basket.riskLevel)} mb-1`}>
            {basket.riskLevel} Risk
          </Badge>
          <div className="text-xs text-text-tertiary">Risk Level</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">
            {basket.volatility}
          </div>
          <div className="text-xs text-text-tertiary">Volatility</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-primary">
            {basket.sharpeRatio}
          </div>
          <div className="text-xs text-text-tertiary">Sharpe Ratio</div>
        </div>
      </div>
    </div>
  );
}
