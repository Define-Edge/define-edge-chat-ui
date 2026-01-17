import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStockBasketBuilderContext } from "../../../../hooks/useStockBasketBuilderContext";
import { marketCapOptions } from "../../../../constants/stock-basket-data";
import type { MarketCap } from "@/api/generated/portfolio-apis/models";

/**
 * Step 2: Market cap selection for stock baskets
 * Supports multi-select with custom range slider option
 */
export function MarketCapStep() {
  const { basketConfig, updateConfig, nextStep } =
    useStockBasketBuilderContext();

  /**
   * Format market cap value for display
   */
  const formatMarketCap = (value: number): string => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k Cr`;
    }
    return `₹${value} Cr`;
  };

  /**
   * Handle market cap option selection
   * Ensures "custom" and predefined options are mutually exclusive
   */
  const handleMarketCapSelect = (optionId: MarketCap | "custom") => {
    if (optionId === "custom") {
      // If selecting custom, clear other selections
      if (basketConfig.marketCap.includes("custom")) {
        updateConfig("marketCap", []);
      } else {
        updateConfig("marketCap", ["custom"]);
      }
    } else {
      // If selecting a predefined option, remove custom and toggle the selected option
      const filteredCaps = basketConfig.marketCap.filter(
        (id) => id !== "custom"
      ) as MarketCap[];
      const newCaps: (MarketCap | "custom")[] = filteredCaps.includes(optionId)
        ? filteredCaps.filter((id) => id !== optionId)
        : [...filteredCaps, optionId];
      updateConfig("marketCap", newCaps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">
          Select one or more company sizes
        </p>
      </div>

      {basketConfig.marketCap.length > 0 &&
        !basketConfig.marketCap.includes("custom") && (
          <div className="bg-success-bg border border-success-border rounded-lg p-3">
            <p className="text-xs text-success-fg font-medium text-center">
              ✓ {basketConfig.marketCap.length} market cap{" "}
              {basketConfig.marketCap.length === 1 ? "category" : "categories"}{" "}
              selected
            </p>
          </div>
        )}

      <div className="space-y-3">
        {marketCapOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              basketConfig.marketCap.includes(option.id)
                ? "border-accent-blue bg-info-bg"
                : "hover:border-info-border"
            }`}
            onClick={() => handleMarketCapSelect(option.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary">
                  {option.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {option.description}
                </p>
              </div>
              {basketConfig.marketCap.includes(option.id) && (
                <Check className="w-5 h-5 text-accent-blue" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Range Slider */}
      {basketConfig.marketCap.includes("custom") && (
        <div className="space-y-4 bg-info-bg border border-accent-blue rounded-lg p-5">
          <div className="text-center mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-1">
              Select Market Cap Range
            </h4>
            <p className="text-lg font-bold text-accent-blue">
              {formatMarketCap(basketConfig.customMarketCapRange[0])} -{" "}
              {formatMarketCap(basketConfig.customMarketCapRange[1])}
            </p>
          </div>

          <div className="space-y-6 px-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">
                Minimum Market Cap:{" "}
                {formatMarketCap(basketConfig.customMarketCapRange[0])}
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={basketConfig.customMarketCapRange[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  const currentMax = basketConfig.customMarketCapRange[1];
                  if (newMin < currentMax) {
                    updateConfig("customMarketCapRange", [newMin, currentMax]);
                  }
                }}
                className="w-full h-2 bg-info-icon-bg rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">
                Maximum Market Cap:{" "}
                {formatMarketCap(basketConfig.customMarketCapRange[1])}
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={basketConfig.customMarketCapRange[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  const currentMin = basketConfig.customMarketCapRange[0];
                  if (newMax > currentMin) {
                    updateConfig("customMarketCapRange", [currentMin, newMax]);
                  }
                }}
                className="w-full h-2 bg-info-icon-bg rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
            </div>
          </div>
        </div>
      )}

      {basketConfig.marketCap.length > 0 && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            className="w-full h-12 bg-accent-blue hover:bg-info-icon text-white"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
