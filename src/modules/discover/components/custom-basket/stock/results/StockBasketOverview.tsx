import type { PortfolioAnalytics } from "@/api/generated/portfolio-apis/models";
import { PortfolioMetric } from "@/modules/core/portfolio/constants/portfolio-metrics";
import { getStatValue } from "@/modules/core/portfolio/utils/get-stat-value";
import { Target } from "lucide-react";

interface StockBasketOverviewProps {
  basketName: string;
  description: string;
  analytics: PortfolioAnalytics;
}

/**
 * Stock basket overview section
 * Displays basket name, icon, and key metrics
 */
export function StockBasketOverview({
  basketName,
  description,
  analytics,
}: StockBasketOverviewProps) {
  return (
    <div className="bg-bg-base border-border-subtle border-b px-6 py-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="bg-accent-blue flex h-12 w-12 items-center justify-center rounded-lg">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-text-primary mb-1 text-lg font-semibold">
            {basketName}
          </h2>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-text-success text-xl font-semibold">
            {getStatValue(analytics.stats, PortfolioMetric.CAGR) || "--"}%
          </div>
          <div className="text-text-secondary text-xs">CAGR</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-xl font-semibold">
            {analytics.total_stocks}
          </div>
          <div className="text-text-secondary text-xs">Holdings</div>
        </div>
      </div>
    </div>
  );
}
