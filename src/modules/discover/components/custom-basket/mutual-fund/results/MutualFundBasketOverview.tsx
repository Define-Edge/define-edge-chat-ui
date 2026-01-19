import { PieChart } from "lucide-react";
import type { CreateMFPortfolioResponse } from "@/api/generated/mf-portfolio-apis/models/createMFPortfolioResponse";

interface MutualFundBasketOverviewProps {
  response: CreateMFPortfolioResponse;
  description: string;
}

/**
 * Mutual fund basket overview section
 * Displays basket name, icon, and key metrics
 */
export function MutualFundBasketOverview({
  response,
  description,
}: MutualFundBasketOverviewProps) {
  // Generate basket name based on plan type
  const basketName =
    response.plan_type === "direct"
      ? "Direct Plan Mutual Fund Basket"
      : "Regular Plan Mutual Fund Basket";

  return (
    <div className="bg-bg-base px-6 py-6 border-b border-border-subtle">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center">
          <PieChart className="w-6 h-6 text-white" />
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
          <div className="text-xl font-semibold text-text-secondary">--</div>
          <div className="text-xs text-text-secondary">Expected Returns</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-text-primary">
            {response.analytics.total_schemes}
          </div>
          <div className="text-xs text-text-secondary">Holdings</div>
        </div>
      </div>
    </div>
  );
}
