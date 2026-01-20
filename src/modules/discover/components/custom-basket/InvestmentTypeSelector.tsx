import { Card } from "@/components/ui/card";
import { Check, PieChart, TrendingUp } from "lucide-react";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";

/**
 * Investment type selector component
 * Step 0: Allows user to choose between Stocks or Mutual Funds
 */
export function InvestmentTypeSelector() {
  const { investmentType, setInvestmentType } = useBasketBuilderContext();

  return (
    <div className="bg-bg-subtle flex flex-col">
      <div className="mx-auto w-full max-w-md p-6 pt-12 md:max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-text-primary mb-2 text-2xl font-bold">
            Create Custom Basket
          </h1>
          <p className="text-text-secondary text-sm">
            Choose your investment type to get started
          </p>
        </div>

        <div className="space-y-4">
          <Card
            className={`cursor-pointer p-6 transition-all ${
              investmentType === "stocks"
                ? "border-accent-blue bg-info-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setInvestmentType("stocks")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-accent-blue h-5 w-5" />
                <div>
                  <h4 className="text-text-primary mb-1 font-semibold">
                    Stocks Only
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Build a customized equity portfolio
                  </p>
                </div>
              </div>
              {investmentType === "stocks" && (
                <Check className="text-accent-blue h-5 w-5" />
              )}
            </div>
          </Card>

          <Card
            className={`cursor-pointer p-6 transition-all ${
              investmentType === "mutualFunds"
                ? "border-success-border bg-success-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setInvestmentType("mutualFunds")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PieChart className="text-accent-green h-5 w-5" />
                <div>
                  <h4 className="text-text-primary mb-1 font-semibold">
                    Mutual Funds Only
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Build a diversified fund portfolio
                  </p>
                </div>
              </div>
              {investmentType === "mutualFunds" && (
                <Check className="text-accent-green h-5 w-5" />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
