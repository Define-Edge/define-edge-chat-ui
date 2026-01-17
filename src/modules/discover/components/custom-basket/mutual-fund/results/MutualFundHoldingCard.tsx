import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MutualFund } from "../../../../types/basket-builder.types";

interface MutualFundHoldingCardProps {
  fund: MutualFund;
}

/**
 * Individual mutual fund holding card component
 * Displays fund details with NAV, change, and weight
 */
export function MutualFundHoldingCard({ fund }: MutualFundHoldingCardProps) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-text-primary">
              {fund.name}
            </span>
            <Badge variant="secondary" className="text-xs">
              {fund.weight}%
            </Badge>
          </div>
          <div className="text-xs text-text-secondary truncate">
            {fund.category}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-text-primary">
            ₹{fund.nav.toFixed(2)}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-xs ${
              fund.change >= 0 ? "text-text-success" : "text-text-error"
            }`}
          >
            {fund.change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {fund.change >= 0 ? "+" : ""}
              {fund.change}%
            </span>
          </div>
        </div>
      </div>
      <div className="w-full bg-bg-subtle rounded-full h-1">
        <div
          className="bg-accent-green h-1 rounded-full"
          style={{ width: `${fund.weight}%` }}
        ></div>
      </div>
    </Card>
  );
}
