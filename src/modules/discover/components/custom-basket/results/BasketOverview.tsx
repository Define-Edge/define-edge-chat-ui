import type { GeneratedBasket } from "../../../types/basket-builder.types";
import type { Theme } from "../../../types/basket-builder.types";

interface BasketOverviewProps {
  basket: GeneratedBasket;
  theme: Theme;
  description: string;
}

/**
 * Overview section for generated basket results
 * Shows basket name, theme icon, description, and key metrics
 */
export function BasketOverview({
  basket,
  theme,
  description,
}: BasketOverviewProps) {
  const ThemeIcon = theme.icon;

  return (
    <div className="bg-bg-card px-6 py-6 border-b border-border-default">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`w-12 h-12 ${theme.color} rounded-lg flex items-center justify-center`}
        >
          <ThemeIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {basket.name}
          </h2>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-success-fg">
            {basket.expectedReturn}
          </div>
          <div className="text-xs text-text-tertiary">Expected Returns</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-text-primary">
            {basket.stocks.length}
          </div>
          <div className="text-xs text-text-tertiary">Holdings</div>
        </div>
      </div>
    </div>
  );
}
