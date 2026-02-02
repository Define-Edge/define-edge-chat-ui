/**
 * ETF-specific data transformations
 */

import {
  ETFHolding,
  ETFHoldingWithQuantity,
  ETFFiDataResponse,
  ETF_QUANTITY_FIELD,
} from "@/modules/import-data/types/etf";

/**
 * Extract all ETF holdings from FI data response
 */
export function extractETFsFromFiData(
  fiData: ETFFiDataResponse | undefined | null,
): ETFHolding[] {
  if (!fiData) return [];

  const allHoldings: ETFHolding[] = [];

  fiData.forEach((account) => {
    if (account.Summary?.Investment?.Holdings?.Holding) {
      allHoldings.push(...account.Summary.Investment.Holdings.Holding);
    }
  });

  return allHoldings;
}

/**
 * Extract total current value from FI data response
 * Sums up currentValue from all accounts
 */
export function extractCurrentValueFromFiData(
  fiData: ETFFiDataResponse | undefined | null,
): string | null {
  if (!fiData) return null;

  let totalValue = 0;
  let hasValue = false;

  fiData.forEach((account) => {
    if (account.Summary?.currentValue) {
      const value = parseFloat(account.Summary.currentValue);
      if (!isNaN(value)) {
        totalValue += value;
        hasValue = true;
      }
    }
  });

  return hasValue ? totalValue.toString() : null;
}

/**
 * Transform ETF holdings to form data with quantity field
 */
export function transformETFsToFormData(
  holdings: ETFHolding[],
): ETFHoldingWithQuantity[] {
  return holdings.map((holding) => ({
    ...holding,
    quantity: parseFloat(holding[ETF_QUANTITY_FIELD] || "0"),
  }));
}

/**
 * Transform form data back to ETF holdings (for submission)
 * Filters out holdings with quantity = 0
 */
export function transformFormDataToETFs(
  formHoldings: ETFHoldingWithQuantity[],
): ETFHolding[] {
  // Filter out holdings with quantity = 0
  const validHoldings = formHoldings.filter((h) => h.quantity > 0);

  return validHoldings.map((holding) => {
    const { quantity, ...holdingWithoutQuantity } = holding;

    return {
      ...holdingWithoutQuantity,
      [ETF_QUANTITY_FIELD]: quantity.toString(),
    } as ETFHolding;
  });
}

/**
 * Transform ETF holdings to markdown-ready format for import mutation
 */
export function transformETFsToMarkdownFormat(
  holdings: ETFHolding[],
): Record<string, string>[] {
  return holdings.map((holding) => ({
    "ETF Name": holding.isinDescription || "",
    "ISIN": holding.isin || "",
    "Units": holding.units || "",
    "NAV": holding.nav || "",
  }));
}
