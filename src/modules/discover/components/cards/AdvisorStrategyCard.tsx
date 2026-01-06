import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StrategyMasterDetail } from "@/api/generated/strategy-apis/models";

interface AdvisorStrategyCardProps {
  strategy: StrategyMasterDetail;
}

/**
 * Advisor strategy card component
 * Displays FinSharpe curated strategies with methodology details
 * Includes FinSharpe branding badge and advisor information
 */
export function AdvisorStrategyCard({
  strategy,
}: AdvisorStrategyCardProps) {
  const riskColors = {
    Low: "bg-risk-low-bg text-risk-low-fg border-risk-low-border",
    Medium: "bg-risk-medium-bg text-risk-medium-fg border-risk-medium-border",
    High: "bg-risk-high-bg text-risk-high-fg border-risk-high-border",
  };

  return (
    <Link href={`/discover/${strategy.strategy}`}>
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-border-default"
      >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-info-icon-bg text-accent-purple border-info-border">
            <Users className="w-3 h-3 mr-1" />
            FinSharpe
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {strategy.category}
          </Badge>
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-muted" />
      </div>

      <h3 className="font-medium text-text-primary mb-2">{strategy.display_name}</h3>
      <p className="text-sm text-text-secondary mb-2">{strategy.description}</p>
      <p className="text-xs text-accent-blue mb-3">{strategy.keywords}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Risk Level</span>
          <Badge className={`text-xs ${riskColors[strategy.risk_level as keyof typeof riskColors] || riskColors.Medium}`}>
            {strategy.risk_level}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Holdings</span>
          <span className="text-sm font-medium text-text-primary">
            {strategy.stock_count} stocks
          </span>
        </div>
      </div>
    </Card>
    </Link>
  );
}
