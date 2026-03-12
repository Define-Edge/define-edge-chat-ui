import { PFItemWithIdentifier } from "@/api/generated/portfolio-apis/models";
import { IdentifierType } from "@/api/generated/portfolio-apis/models/identifierType";
import { EquityHoldingWithQuantity } from "@/modules/import-data/types/equities";

/**
 * Check if a string is a valid ISIN format
 * ISIN format: 2-letter country code + 9 alphanumeric + 1 check digit (12 chars total)
 * Indian ISINs start with "IN"
 */
function isIsinFormat(value: string): boolean {
  if (!value || value.length !== 12) return false;
  // Check if it starts with a 2-letter country code (letters only)
  const countryCode = value.substring(0, 2);
  if (!/^[A-Z]{2}$/.test(countryCode)) return false;
  // Rest should be alphanumeric
  const rest = value.substring(2);
  return /^[A-Z0-9]+$/.test(rest);
}

/**
 * Transform equity holdings to PFItemWithIdentifier[] format for portfolio analysis API
 *
 * Holdings from MoneyOne have actual ISIN codes in the `isin` field.
 * Holdings added via search have ticker symbols in the `isin` field.
 * We detect the format and set `identifier_type` accordingly per item.
 */
export function transformEquitiesToPortfolioItems(
  holdings: EquityHoldingWithQuantity[],
): PFItemWithIdentifier[] {
  return holdings
    .filter((h) => h.quantity > 0) // Exclude zero-quantity holdings
    .map((holding) => ({
      symbol: holding.isin,
      quantity: holding.quantity,
      identifier_type: isIsinFormat(holding.isin)
        ? IdentifierType.isin
        : IdentifierType.symbol,
    }));
}
