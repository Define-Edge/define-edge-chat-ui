import { ArrowUpRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdvisorStrategy } from "../../types/discover.types";

interface AdvisorStrategyCardProps extends AdvisorStrategy {
  onClick?: () => void;
}

/**
 * Advisor strategy card component
 * Displays FinSharpe curated strategies with methodology details
 * Includes FinSharpe branding badge and advisor information
 */
export function AdvisorStrategyCard({
  title,
  description,
  returns,
  riskLevel,
  stocks,
  category,
  performance,
  methodology,
  onClick,
}: AdvisorStrategyCardProps) {
  const riskColors = {
    Low: "bg-risk-low-bg text-risk-low-fg border-risk-low-border",
    Medium: "bg-risk-medium-bg text-risk-medium-fg border-risk-medium-border",
    High: "bg-risk-high-bg text-risk-high-fg border-risk-high-border",
  };

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-border-default"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-info-icon-bg text-accent-purple border-info-border">
            <Users className="w-3 h-3 mr-1" />
            FinSharpe
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-muted" />
      </div>

      <h3 className="font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-2">{description}</p>
      <p className="text-xs text-accent-blue mb-3">{methodology}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Risk Level</span>
          <Badge className={`text-xs ${riskColors[riskLevel]}`}>
            {riskLevel}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Holdings</span>
          <span className="text-sm font-medium text-text-primary">
            {stocks} stocks
          </span>
        </div>
      </div>
    </Card>
  );
}
