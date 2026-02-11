import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MFPortfolioItem } from "@/types/mf-portfolio";

interface MutualFundHoldingCardProps {
  fund: MFPortfolioItem;
}

/**
 * Individual mutual fund holding card component
 * Displays fund details with 1-month return and weight
 */
export function MutualFundHoldingCard({ fund }: MutualFundHoldingCardProps) {
  // Use 1-month return as the change indicator
  const change = fund.oneM_per ?? 0;

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-text-primary truncate">
              {fund.Scheme_Name}
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {(fund.weight ?? 0).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-text-secondary truncate">
            {fund.Sebi_Category}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-medium text-text-primary">--</div>
          <div
            className={`flex items-center justify-end gap-1 text-xs ${
              change >= 0 ? "text-text-success" : "text-text-error"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="w-full bg-bg-subtle rounded-full h-1">
        <div
          className="bg-accent-green h-1 rounded-full"
          style={{ width: `${fund.weight ?? 0}%` }}
        ></div>
      </div>
    </Card>
  );
}
