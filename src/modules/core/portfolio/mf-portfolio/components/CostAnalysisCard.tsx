import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MFCostAnalysis } from "@/api/generated/mf-portfolio-apis/models";
import { Info } from "lucide-react";

interface CostAnalysisCardProps {
  costAnalysis: MFCostAnalysis;
}

/**
 * Cost Analysis Card for MF portfolios
 * Displays expense ratio percentage with progress bar and estimated annual cost
 */
export function CostAnalysisCard({ costAnalysis }: CostAnalysisCardProps) {
  const expenseRatio = costAnalysis.weighted_expense_ratio;
  const annualCost = costAnalysis.annual_cost;
  const portfolioValue = costAnalysis.portfolio_value;

  // Determine expense ratio quality (for visual indication)
  const getExpenseRatioColor = (ratio: number) => {
    if (ratio <= 0.5) return "bg-success-bg";
    if (ratio <= 1.0) return "bg-warning-bg";
    return "bg-error-bg";
  };

  const getExpenseRatioTextColor = (ratio: number) => {
    if (ratio <= 0.5) return "text-success-text";
    if (ratio <= 1.0) return "text-warning-text";
    return "text-error-text";
  };

  const getExpenseRatioBarColor = (ratio: number) => {
    if (ratio <= 0.5) return "bg-green-500";
    if (ratio <= 1.0) return "bg-amber-500";
    return "bg-red-500";
  };

  // Scale for progress bar (assuming max 2.5% expense ratio for visualization)
  const progressPercentage = Math.min((expenseRatio / 2.5) * 100, 100);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Cost Analysis
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-bg-hover rounded-full transition-colors">
              <Info className="h-4 w-4 text-text-tertiary" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              The weighted average expense ratio of your portfolio. Lower
              expense ratios mean more of your returns stay with you.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-6">
        {/* Expense Ratio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              Weighted Avg. Expense Ratio
            </span>
            <span
              className={`text-lg font-semibold ${getExpenseRatioTextColor(expenseRatio)}`}
            >
              {expenseRatio.toFixed(2)}%
            </span>
          </div>
          <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getExpenseRatioBarColor(expenseRatio)}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-text-tertiary">
            <span>0%</span>
            <span>2.5%</span>
          </div>
        </div>

        {/* Estimated Annual Cost */}
        <div
          className={`p-4 rounded-lg ${getExpenseRatioColor(expenseRatio)}`}
        >
          <div className="text-sm text-text-secondary mb-1">
            Estimated Annual Cost
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-text-primary">
              {annualCost.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-sm text-text-tertiary">
              on{" "}
              {portfolioValue.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}{" "}
              investment
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Low (&lt;0.5%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Medium (0.5-1%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>High (&gt;1%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
