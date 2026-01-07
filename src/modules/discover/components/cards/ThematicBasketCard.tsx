import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ThematicBasket } from "../../types/discover.types";

interface ThematicBasketCardProps extends ThematicBasket {
  onClick?: () => void;
}

/**
 * Thematic basket card component
 * Compact card with icon, title, subtitle, and returns
 * Used for trending investment themes in 2-column grid layout
 */
export function ThematicBasketCard({
  title,
  subtitle,
  icon: Icon,
  color,
  stockCount,
  returns,
  performance,
  onClick,
}: ThematicBasketCardProps) {
  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-border-default"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-muted" />
      </div>

      <h3 className="font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-3">{subtitle}</p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-text-tertiary">{stockCount} stocks</span>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-medium ${
              performance >= 0 ? "text-success-fg" : "text-error-fg"
            }`}
          >
            {returns}
          </span>
        </div>
      </div>
    </Card>
  );
}
