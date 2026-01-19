import { Badge } from "@/components/ui/badge";

/**
 * Mutual fund basket key metrics section
 * Displays risk level, volatility, and Sharpe ratio
 * Currently shows placeholders - will be populated when API adds analytics
 */
export function MutualFundBasketMetrics() {
  return (
    <div className="px-6 py-4 bg-bg-base border-b border-border-subtle">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Badge className="text-xs bg-bg-subtle text-text-secondary border-border-subtle mb-1">
            --
          </Badge>
          <div className="text-xs text-text-secondary">Risk Level</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-secondary">--</div>
          <div className="text-xs text-text-secondary">Volatility</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-text-secondary">--</div>
          <div className="text-xs text-text-secondary">Sharpe Ratio</div>
        </div>
      </div>
    </div>
  );
}
