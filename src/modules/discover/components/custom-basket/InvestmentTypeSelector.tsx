import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";

/**
 * Investment type selector component
 * Step 0: Allows user to choose between Stocks or Mutual Funds
 */
export function InvestmentTypeSelector() {
  const [type, setType] = useState<"stocks" | "mutualFunds" | "">("");
  const { setInvestmentType } = useBasketBuilderContext();

  return (
    <div className="bg-bg-subtle flex flex-col">
      <div className="mx-auto w-full max-w-md md:max-w-2xl">
        {/* Header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              asChild
              className="hover:bg-bg-hover rounded-full transition-colors"
            >
              <Link href="/discover">
                <ArrowLeft className="text-icon-primary size-6" />
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-text-primary text-xl font-semibold">
                Create Custom Basket
              </h1>
              <p className="text-text-secondary text-xs">Step 1 of 1</p>
            </div>
            <div className="w-9"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="py-3">
          <Progress
            value={100}
            className="w-full"
          />
        </div>

        {/* Step Indicator */}
        <div className="py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-accent-blue h-4 w-4" />
              <span className="text-text-primary text-sm font-medium">
                Investment Type
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card
            className={`cursor-pointer p-6 transition-all ${
              type === "stocks"
                ? "border-accent-blue bg-info-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setType("stocks")}
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
              {type === "stocks" && (
                <Check className="text-accent-blue h-5 w-5" />
              )}
            </div>
          </Card>

          <Card
            className={`cursor-pointer p-6 transition-all ${
              type === "mutualFunds"
                ? "border-success-border bg-success-bg shadow-lg"
                : "hover:border-border-hover hover:shadow-md"
            }`}
            onClick={() => setType("mutualFunds")}
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
              {type === "mutualFunds" && (
                <Check className="text-accent-green h-5 w-5" />
              )}
            </div>
          </Card>
          {type ? (
            <Button
              onClick={() => setInvestmentType(type)}
              disabled={!type}
              className="bg-accent-blue hover:bg-info-icon h-12 w-full text-white"
            >
              Continue
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
