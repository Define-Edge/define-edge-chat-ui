import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";
import { Badge } from "@/components/ui/badge";
import { PortfolioMetric } from "@/modules/core/portfolio/constants/portfolio-metrics";
import { getStatValue } from "@/modules/core/portfolio/utils/get-stat-value";
import { Users } from "lucide-react";
import { formatMetric } from "@/modules/core/portfolio/utils/format-metric";

interface AdvisorInfoSectionProps {
  strategy: StrategyAnalyticsResponse;
  isLongShort: boolean;
}

/**
 * Advisor Info Section Component
 * Displays strategy header with badges, title, description, and key stats
 * Component size: ~100 lines
 */
export function AdvisorInfoSection({
  strategy,
  isLongShort,
}: AdvisorInfoSectionProps) {
  const riskColors = {
    Low: "bg-risk-low-bg text-risk-low-fg border-risk-low-border",
    Medium: "bg-risk-medium-bg text-risk-medium-fg border-risk-medium-border",
    High: "bg-risk-high-bg text-risk-high-fg border-risk-high-border",
  };

  return (
    <div className="bg-bg-card border-border-subtle border-b px-6 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge className="bg-info-icon-bg text-accent-purple border-info-border text-xs">
              <Users className="mr-1 h-3 w-3" />
              FinSharpe
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {strategy.category}
            </Badge>
            <Badge
              className={`text-xs ${riskColors[strategy.risk_level as keyof typeof riskColors] || riskColors.Medium}`}
            >
              {strategy.risk_level} Risk
            </Badge>
          </div>
          <h1 className="text-text-primary mb-2 text-xl font-semibold">
            {strategy.display_name}
          </h1>
          <p className="text-text-secondary mb-2 text-sm">
            {strategy.description}
          </p>
          <p className="text-accent-blue text-xs">{strategy.keywords}</p>
        </div>
      </div>

      {isLongShort ? (
        // Long-Short: Show Holdings, Net Exposure, and Gross Exposure
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {strategy.analytics.total_stocks}
            </div>
            <div className="text-text-tertiary text-xs">Holdings</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatMetric(
                getStatValue(
                  strategy.analytics.stats,
                  PortfolioMetric.Volatility,
                ),
              )}
              %
            </div>
            <div className="text-text-tertiary text-xs">Volatility</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatMetric(
                getStatValue(
                  strategy.analytics.stats,
                  PortfolioMetric.SharpeRatio,
                ),
              )}
            </div>
            <div className="text-text-tertiary text-xs">Sharpe Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatMetric(
                getStatValue(
                  strategy.analytics.stats,
                  PortfolioMetric.MaxDrawdown,
                ),
              )}
              %
            </div>
            <div className="text-text-tertiary text-xs">Max Drawdown</div>
          </div>
        </div>
      ) : (
        // Long-Only: Show Holdings, Returns, Min Investment
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {strategy.analytics.total_stocks}
            </div>
            <div className="text-text-tertiary text-xs">Holdings</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatMetric(
                getStatValue(
                  strategy.analytics.stats,
                  PortfolioMetric.Return1Y,
                ),
              )}
              %
            </div>
            <div className="text-text-tertiary text-xs">1Y Return</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatMetric(
                getStatValue(strategy.analytics.stats, PortfolioMetric.CAGR),
                "N/A",
              )}
              %
            </div>
            <div className="text-text-tertiary text-xs">CAGR</div>
          </div>
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">₹50L+</div>
            <div className="text-text-tertiary text-xs">Min Investment</div>
          </div>
        </div>
      )}
    </div>
  );
}
