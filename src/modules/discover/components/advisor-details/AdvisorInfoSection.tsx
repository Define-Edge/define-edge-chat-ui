import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { AdvisorStrategy } from "../../types/discover.types";

interface AdvisorInfoSectionProps {
  strategy: AdvisorStrategy;
}

/**
 * Advisor Info Section Component
 * Displays strategy header with badges, title, description, and key stats
 * Component size: ~100 lines
 */
export function AdvisorInfoSection({ strategy }: AdvisorInfoSectionProps) {
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
            <Badge className={`text-xs ${riskColors[strategy.riskLevel]}`}>
              {strategy.riskLevel} Risk
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            {strategy.title}
          </h1>
          <p className="text-sm text-text-secondary mb-2">{strategy.description}</p>
          <p className="text-xs text-accent-blue">{strategy.methodology}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {strategy.stocks}
          </div>
          <div className="text-xs text-text-tertiary">Holdings</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">₹50L+</div>
          <div className="text-xs text-text-tertiary">Min Investment</div>
        </div>
      </div>
    </div>
  );
}
