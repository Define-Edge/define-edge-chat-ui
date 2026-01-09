import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";

interface AdvisorInfoSectionProps {
  strategy: StrategyAnalyticsResponse;
  isLongShort: boolean;
}

/**
 * Advisor Info Section Component
 * Displays strategy header with badges, title, description, and key stats
 * Component size: ~100 lines
 */
export function AdvisorInfoSection({ strategy, isLongShort }: AdvisorInfoSectionProps) {
  const riskColors = {
    Low: "bg-risk-low-bg text-risk-low-fg border-risk-low-border",
    Medium: "bg-risk-medium-bg text-risk-medium-fg border-risk-medium-border",
    High: "bg-risk-high-bg text-risk-high-fg border-risk-high-border",
  };

  return (
    <div className="bg-bg-card px-6 py-6 border-b border-border-subtle">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-xs bg-info-icon-bg text-accent-purple border-info-border">
              <Users className="w-3 h-3 mr-1" />
              FinSharpe
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {strategy.category}
            </Badge>
            <Badge className={`text-xs ${riskColors[strategy.risk_level as keyof typeof riskColors] || riskColors.Medium}`}>
              {strategy.risk_level} Risk
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            {strategy.display_name}
          </h1>
          <p className="text-sm text-text-secondary mb-2">{strategy.description}</p>
          <p className="text-xs text-accent-blue">{strategy.keywords}</p>
        </div>
      </div>

      {isLongShort ? (
        // Long-Short: Show Holdings, Net Exposure, and Gross Exposure
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {strategy.total_stock_count}
            </div>
            <div className="text-xs text-text-tertiary">Holdings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {strategy.net_exposure !== null && strategy.net_exposure !== undefined
                ? `${strategy.net_exposure.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className="text-xs text-text-tertiary">Net Exposure</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {strategy.gross_exposure !== null && strategy.gross_exposure !== undefined
                ? `${strategy.gross_exposure.toFixed(1)}%`
                : "N/A"}
            </div>
            <div className="text-xs text-text-tertiary">Gross Exposure</div>
          </div>
        </div>
      ) : (
        // Long-Only: Show Holdings and Min Investment
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {strategy.total_stock_count}
            </div>
            <div className="text-xs text-text-tertiary">Holdings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">₹50L+</div>
            <div className="text-xs text-text-tertiary">Min Investment</div>
          </div>
        </div>
      )}
    </div>
  );
}
