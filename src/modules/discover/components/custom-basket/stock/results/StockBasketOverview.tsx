import { Target } from "lucide-react";

interface StockBasketOverviewProps {
  basketName: string;
  description: string;
  totalStocks: number;
}

/**
 * Stock basket overview section
 * Displays basket name, icon, and key metrics
 */
export function StockBasketOverview({
  basketName,
  description,
  totalStocks,
}: StockBasketOverviewProps) {
  return (
    <div className="bg-bg-base px-6 py-6 border-b border-border-subtle">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {basketName}
          </h2>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-text-success">
            --
          </div>
          <div className="text-xs text-text-secondary">Expected Returns</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-text-primary">
            {totalStocks}
          </div>
          <div className="text-xs text-text-secondary">Holdings</div>
        </div>
      </div>
    </div>
  );
}
