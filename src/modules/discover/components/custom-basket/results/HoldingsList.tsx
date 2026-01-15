import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Stock } from "../../../types/basket-builder.types";

interface HoldingsListProps {
  stocks: Stock[];
}

/**
 * List of stock holdings in the basket
 * Shows stock details, weights, and price movements
 */
export function HoldingsList({ stocks }: HoldingsListProps) {
  return (
    <div className="px-6 py-4">
      <h3 className="font-medium text-text-primary mb-4">Portfolio Holdings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {stocks.map((stock) => (
          <Card key={stock.symbol} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-text-primary">
                    {stock.symbol}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {stock.weight}%
                  </Badge>
                </div>
                <div className="text-xs text-text-tertiary truncate">
                  {stock.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  ₹{stock.price.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end gap-1 text-xs ${
                    stock.change >= 0 ? "text-success-fg" : "text-error-fg"
                  }`}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change}%
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full bg-bg-subtle rounded-full h-1">
              <div
                className="bg-accent-blue h-1 rounded-full"
                style={{ width: `${stock.weight}%` }}
              ></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
