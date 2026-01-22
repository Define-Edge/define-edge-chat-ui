import type { PortfolioAnalytics } from "@/api/generated/portfolio-apis/models";
import { PortfolioMetric } from "@/modules/core/portfolio/constants/portfolio-metrics";
import { getStatValue } from "@/modules/core/portfolio/utils/get-stat-value";
import { formatMetric } from "@/modules/core/portfolio/utils/format-metric";

interface StockBasketMetricsProps {
  analytics: PortfolioAnalytics;
}

/**
 * Stock basket key metrics section
 * Displays risk level, volatility, and Sharpe ratio
 * TODO: Replace placeholder values with actual metrics from API when available
 */
export function StockBasketMetrics({ analytics }: StockBasketMetricsProps) {
  return (
    <div className="bg-bg-base border-border-subtle border-b px-6 py-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-text-primary text-sm font-medium">
            {formatMetric(
              getStatValue(analytics.stats, PortfolioMetric.MaxDrawdown),
            )}
            %
          </div>
          <div className="text-text-secondary text-xs">Max Drawdown</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-sm font-medium">
            {formatMetric(
              getStatValue(analytics.stats, PortfolioMetric.Volatility),
            )}
            %
          </div>
          <div className="text-text-secondary text-xs">Volatility</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-sm font-medium">
            {formatMetric(
              getStatValue(analytics.stats, PortfolioMetric.SharpeRatio),
            )}
          </div>
          <div className="text-text-secondary text-xs">Sharpe Ratio</div>
        </div>
      </div>
    </div>
  );
}
