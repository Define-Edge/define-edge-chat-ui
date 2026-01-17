import type { MutualFund } from "../../../../types/basket-builder.types";
import { MutualFundHoldingCard } from "./MutualFundHoldingCard";

interface MutualFundHoldingsListProps {
  funds: MutualFund[];
}

/**
 * List of mutual fund holdings
 * Displays all funds in the generated basket
 */
export function MutualFundHoldingsList({
  funds,
}: MutualFundHoldingsListProps) {
  return (
    <div className="px-6 py-4">
      <h3 className="font-medium text-text-primary mb-4">
        Portfolio Holdings
      </h3>
      <div className="space-y-3">
        {funds.map((fund) => (
          <MutualFundHoldingCard key={fund.symbol} fund={fund} />
        ))}
      </div>
    </div>
  );
}
