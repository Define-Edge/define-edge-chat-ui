import { PFItem } from "@/api/generated/mf-portfolio-apis/models";
import { IdentifierType } from "@/api/generated/mf-portfolio-apis/models/identifierType";
import { MutualFundHoldingWithQuantity } from "@/modules/import-data/types/mutual-funds";

/**
 * Transform mutual fund holdings to PFItem[] format for MF portfolio analysis API
 * Mutual funds always use ISIN as identifier
 */
export function transformMutualFundsToPortfolioItems(
  holdings: MutualFundHoldingWithQuantity[],
): PFItem[] {
  return holdings
    .filter((h) => h.quantity > 0)
    .map((holding) => ({
      symbol: holding.isin,
      quantity: holding.quantity,
      identifier_type: IdentifierType.isin,
    }));
}
