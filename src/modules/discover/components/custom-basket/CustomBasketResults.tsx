import { useState } from "react";
import { Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";
import { themes, mockStocks } from "../../constants/basket-builder-data";
import { BasketOverview } from "./results/BasketOverview";
import { BasketMetrics } from "./results/BasketMetrics";
import { ConfigurationSummary } from "./results/ConfigurationSummary";
import { HoldingsList } from "./results/HoldingsList";
import type { GeneratedBasket } from "../../types/basket-builder.types";

/**
 * Results view for generated custom basket
 * Displays basket overview, metrics, configuration summary, and holdings
 */
export function CustomBasketResults() {
  const { basketConfig, handleModify } = useBasketBuilderContext();
  const [showBrokerGateway, _setShowBrokerGateway] = useState(false);

  /**
   * Generate basket data based on user configuration
   */
  const generateBasket = (): GeneratedBasket => {
    const themeNames: Record<string, string> = {
      technology: "AI & Technology Innovators",
      sustainable: "Sustainable Future Leaders",
      healthcare: "Healthcare & Biotech Leaders",
      financial: "Fintech & Banking Champions",
      dividend: "High Dividend Champions",
    };

    const basketName =
      themeNames[basketConfig.theme] || "Custom Investment Basket";

    const stockCount =
      basketConfig.numberOfStocks === "focused"
        ? 10
        : basketConfig.numberOfStocks === "balanced"
          ? 15
          : 20;

    const selectedStocks = mockStocks.slice(0, stockCount);

    const totalWeight = selectedStocks.reduce(
      (sum, stock) => sum + stock.weight,
      0
    );
    selectedStocks.forEach((stock) => {
      stock.weight = Number(((stock.weight / totalWeight) * 100).toFixed(1));
    });

    // Calculate metrics based on investment style
    const getMetrics = () => {
      switch (basketConfig.investmentStyle) {
        case "growth":
          return {
            expectedReturn: "22.5%",
            riskLevel: "High" as const,
            volatility: "21.3%",
            sharpeRatio: "1.35",
          };
        case "value":
          return {
            expectedReturn: "16.2%",
            riskLevel: "Medium" as const,
            volatility: "14.8%",
            sharpeRatio: "1.42",
          };
        case "momentum":
          return {
            expectedReturn: "24.5%",
            riskLevel: "High" as const,
            volatility: "22.3%",
            sharpeRatio: "1.32",
          };
        case "quality":
          return {
            expectedReturn: "18.7%",
            riskLevel: "Medium" as const,
            volatility: "16.8%",
            sharpeRatio: "1.46",
          };
        default:
          return {
            expectedReturn: "18.0%",
            riskLevel: "Medium" as const,
            volatility: "16.0%",
            sharpeRatio: "1.40",
          };
      }
    };

    const metrics = getMetrics();

    return {
      name: basketName,
      stocks: selectedStocks,
      ...metrics,
    };
  };

  const basketData = generateBasket();
  const selectedTheme =
    themes.find((t) => t.id === basketConfig.theme) || themes[0];
  const description = `${basketConfig.investmentStyle} investing approach with ${
    basketConfig.numberOfStocks === "focused"
      ? "focused"
      : basketConfig.numberOfStocks === "balanced"
        ? "balanced"
        : "diversified"
  } diversification`;

  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Basket Overview */}
      <BasketOverview
        basket={basketData}
        theme={selectedTheme}
        description={description}
      />

      {/* Key Metrics */}
      <BasketMetrics basket={basketData} />

      {/* Configuration Summary */}
      <ConfigurationSummary basketConfig={basketConfig} />

      {/* Holdings */}
      <HoldingsList stocks={basketData.stocks} />

      {/* Action Buttons */}
      <div className="px-6 space-y-3 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:max-w-md md:mx-auto">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Preview Portfolio
          </Button>
          <Button variant="outline" className="w-full" onClick={handleModify}>
            <Target className="w-4 h-4 mr-2" />
            Modify Basket
          </Button>
        </div>
      </div>
    </div>
  );
}
