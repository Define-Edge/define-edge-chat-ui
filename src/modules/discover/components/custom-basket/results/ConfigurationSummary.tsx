import { Badge } from "@/components/ui/badge";
import type { BasketConfig } from "../../../types/basket-builder.types";

interface ConfigurationSummaryProps {
  basketConfig: BasketConfig;
}

/**
 * Summary of applied preferences and configurations
 * Shows selected theme, style, risk, market cap, and considerations
 */
export function ConfigurationSummary({
  basketConfig,
}: ConfigurationSummaryProps) {
  return (
    <div className="px-6 py-4 bg-info-bg border-b border-border-default">
      <h3 className="text-sm font-medium text-info-foreground mb-3">
        Your Preferences Applied
      </h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {basketConfig.theme.charAt(0).toUpperCase() +
            basketConfig.theme.slice(1)}{" "}
          Theme
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {basketConfig.investmentStyle.charAt(0).toUpperCase() +
            basketConfig.investmentStyle.slice(1)}{" "}
          Style
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {basketConfig.marketCap.join(", ")} Cap
        </Badge>
      </div>
      {basketConfig.specificConsiderations && (
        <div className="mt-3 p-3 bg-bg-card rounded-lg border border-info-border">
          <h4 className="text-xs font-medium text-info-foreground mb-1">
            Specific Considerations:
          </h4>
          <p className="text-xs text-info-foreground">
            {basketConfig.specificConsiderations}
          </p>
        </div>
      )}
    </div>
  );
}
