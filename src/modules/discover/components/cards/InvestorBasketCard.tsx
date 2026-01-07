import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvestorBasket } from "../../types/discover.types";

interface InvestorBasketCardProps extends InvestorBasket {
  onClick?: () => void;
}

/**
 * Investor basket card component
 * Displays famous investor strategies with philosophy and methodology
 * Features colored icon background and investor-specific branding
 */
export function InvestorBasketCard({
  investor,
  strategy,
  philosophy,
  icon: Icon,
  color,
  stockCount,
  returns,
  performance,
  riskLevel,
  onClick,
}: InvestorBasketCardProps) {
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
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${riskColors[riskLevel]}`}>
            {riskLevel}
          </Badge>
          <ArrowUpRight className="w-4 h-4 text-text-muted" />
        </div>
      </div>

      <h3 className="font-medium text-text-primary mb-1">{investor}</h3>
      <p className="text-sm font-medium text-accent-blue mb-1">{strategy}</p>
      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{philosophy}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Strategy Returns</span>
          <span
            className={`text-sm font-medium ${
              performance >= 0 ? "text-success-fg" : "text-error-fg"
            }`}
          >
            {returns}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Holdings</span>
          <span className="text-sm font-medium text-text-primary">
            {stockCount} stocks
          </span>
        </div>
      </div>
    </Card>
  );
}
