import { PFItem } from "@/api/generated/mf-portfolio-apis/models";
import { MutualFundHoldingWithQuantity } from "@/modules/import-data/types/mutual-funds";

/**
 * Transform mutual fund holdings to PFItem[] format for MF portfolio analysis API
 */
export function transformMutualFundsToPortfolioItems(
  holdings: MutualFundHoldingWithQuantity[],
): PFItem[] {
  return holdings
    .filter((h) => h.quantity > 0)
    .map((holding) => ({
      symbol: holding.isin,
      quantity: holding.quantity,
    }));
}
