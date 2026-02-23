import type { PortfolioAnalytics } from "@/api/generated/portfolio-apis/models";
import { PortfolioMetric } from "@/modules/core/portfolio/constants/portfolio-metrics";
import { formatMetric } from "@/modules/core/portfolio/utils/format-metric";
import { getStatValue } from "@/modules/core/portfolio/utils/get-stat-value";
import { Target, TrendingUp, BarChart3, Activity } from "lucide-react";

interface StockBasketHeroProps {
  basketName: string;
  description: string;
  analytics: PortfolioAnalytics;
}

/**
 * Unified basket hero section
 * Consolidates basket identity, primary metric (CAGR), and secondary risk metrics
 * into a single cohesive card with clear information hierarchy
 */
export function StockBasketHero({
  basketName,
  description,
  analytics,
}: StockBasketHeroProps) {
  const cagr = formatMetric(
    getStatValue(analytics.stats, PortfolioMetric.CAGR),
  );
  const maxDrawdown = formatMetric(
    getStatValue(analytics.stats, PortfolioMetric.MaxDrawdown),
  );
  const volatility = formatMetric(
    getStatValue(analytics.stats, PortfolioMetric.Volatility),
  );
  const cagrValue = Number(cagr);
  const isPositiveCagr = !isNaN(cagrValue) && cagrValue > 0;

  return (
    <div className="bg-bg-base border-border-subtle border-b px-6 py-5">
      {/* Basket identity + holdings count on same line */}
      <div className="mb-4 flex items-start gap-3">
        <div className="bg-accent-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-text-primary text-base font-semibold leading-tight">
              {basketName}
            </h2>
            <div className="text-text-primary shrink-0 text-base font-semibold tabular-nums">
              {analytics.total_stocks}{" "}
              <span className="text-text-tertiary text-xs font-normal">
                stocks
              </span>
            </div>
          </div>
          <p className="text-text-tertiary mt-0.5 text-xs">{description}</p>
        </div>
      </div>

      {/* Metrics row — CAGR, Max Drawdown, Volatility */}
      <div className="bg-bg-subtle grid grid-cols-3 gap-px overflow-hidden rounded-xl">
        <MetricCell
          icon={<TrendingUp className="h-3 w-3" />}
          label="CAGR"
          value={`${cagr}%`}
          highlight={isPositiveCagr}
        />
        <MetricCell
          icon={<BarChart3 className="h-3 w-3" />}
          label="Max Drawdown"
          value={`${maxDrawdown}%`}
        />
        <MetricCell
          icon={<Activity className="h-3 w-3" />}
          label="Volatility"
          value={`${volatility}%`}
        />
      </div>
    </div>
  );
}

function MetricCell({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-bg-base px-3 py-3 text-center">
      <div className="text-text-tertiary mx-auto mb-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div
        className={`text-sm font-semibold tabular-nums ${highlight ? "text-success-fg" : "text-text-primary"}`}
      >
        {value}
      </div>
    </div>
  );
}
