import type { CreateMFPortfolioResponse } from "@/api/generated/mf-portfolio-apis/models/createMFPortfolioResponse";
import { PortfolioMetric } from "@/modules/core/portfolio/constants/portfolio-metrics";
import { getStatValue } from "@/modules/core/portfolio/utils/get-stat-value";
import { PieChart } from "lucide-react";
import { formatMetric } from "@/modules/core/portfolio/utils/format-metric";

interface MutualFundBasketOverviewProps {
  response: CreateMFPortfolioResponse;
  description: string;
}

/**
 * Mutual fund basket overview section
 * Displays basket name, icon, and key metrics
 */
export function MutualFundBasketOverview({
  response,
  description,
}: MutualFundBasketOverviewProps) {
  // Generate basket name based on plan type
  const basketName =
    response.plan_type === "direct"
      ? "Direct Plan Mutual Fund Basket"
      : "Regular Plan Mutual Fund Basket";

  return (
    <div className="bg-bg-base border-border-subtle border-b px-6 py-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="bg-accent-green flex h-12 w-12 items-center justify-center rounded-lg">
          <PieChart className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-text-primary mb-1 text-lg font-semibold">
            {basketName}
          </h2>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-text-primary text-xl font-semibold">
            {response.analytics.total_schemes}
          </div>
          <div className="text-text-secondary text-xs">Holdings</div>
        </div>
        <div className="text-center">
          <div className="text-text-success text-xl font-semibold">
            {formatMetric(
              getStatValue(response.analytics.stats, PortfolioMetric.CAGR),
            )}
            %
          </div>
          <div className="text-text-secondary text-xs">CAGR</div>
        </div>
        <div className="text-center">
          <div className="text-text-primary text-xl font-semibold">
            {formatMetric(
              getStatValue(
                response.analytics.stats,
                PortfolioMetric.Volatility,
              ),
            )}
            %
          </div>
          <div className="text-text-secondary text-xs">Volatility</div>
        </div>
      </div>
    </div>
  );
}
