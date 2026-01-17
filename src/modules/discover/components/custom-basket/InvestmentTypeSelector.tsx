import { TrendingUp, PieChart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";

/**
 * Investment type selector component
 * Step 0: Allows user to choose between Stocks or Mutual Funds
 */
export function InvestmentTypeSelector() {
  const { investmentType, setInvestmentType } = useBasketBuilderContext();

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <div className="max-w-md md:max-w-2xl mx-auto w-full p-6 pt-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Create Custom Basket
          </h1>
          <p className="text-sm text-text-secondary">
            Choose your investment type to get started
          </p>
        </div>

        <div className="space-y-4">
          <Card
            className={`p-6 cursor-pointer transition-all ${
              investmentType === "stocks"
                ? "border-accent-blue bg-info-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setInvestmentType("stocks")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent-blue" />
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Stocks Only
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Build a customized equity portfolio
                  </p>
                </div>
              </div>
              {investmentType === "stocks" && (
                <Check className="w-5 h-5 text-accent-blue" />
              )}
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all ${
              investmentType === "mutualFunds"
                ? "border-success-border bg-success-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setInvestmentType("mutualFunds")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-accent-green" />
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Mutual Funds Only
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Build a diversified fund portfolio
                  </p>
                </div>
              </div>
              {investmentType === "mutualFunds" && (
                <Check className="w-5 h-5 text-accent-green" />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
