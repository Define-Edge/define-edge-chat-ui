import { AlertTriangle, ArrowUpRight, Building2, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvestmentBasket } from "../../types/discover.types";

interface InvestmentBasketCardProps extends InvestmentBasket {
  onClick?: () => void;
}

/**
 * Investment basket card component
 * Used for curated, special, news-based, and research paper baskets
 * Supports variants: regular, IPO, red flag, and corporate action
 */
export function InvestmentBasketCard({
  title,
  description,
  returns,
  riskLevel,
  stocks,
  category,
  performance,
  trending,
  isRedFlag,
  isIPO,
  isCorporateAction,
  onClick,
}: InvestmentBasketCardProps) {
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
          {isRedFlag ? (
            <Badge className="text-xs bg-error-bg text-error-fg border-error-border">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          ) : isIPO ? (
            <Badge className="text-xs bg-info-icon-bg text-accent-purple border-info-border">
              <FileText className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          ) : isCorporateAction ? (
            <Badge className="text-xs bg-info-bg text-accent-blue border-info-border">
              <Building2 className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          )}
          {trending && (
            <Badge className="text-xs bg-accent-orange-bg text-accent-orange border-accent-orange-border">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-muted" />
      </div>

      <h3 className="font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">
            {isIPO
              ? "Launch Status"
              : isRedFlag
                ? "Performance (1Y)"
                : "Returns (1Y)"}
          </span>
          <span
            className={`text-sm font-medium ${
              isIPO
                ? "text-accent-purple"
                : isRedFlag
                  ? "text-error-fg"
                  : performance >= 0
                    ? "text-success-fg"
                    : "text-error-fg"
            }`}
          >
            {isIPO ? "Upcoming" : returns}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">Risk Level</span>
          <Badge className={`text-xs ${riskColors[riskLevel]}`}>
            {riskLevel}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-tertiary">
            {isIPO ? "Companies" : "Stocks"}
          </span>
          <span className="text-sm font-medium text-text-primary">{stocks}</span>
        </div>
      </div>
    </Card>
  );
}
