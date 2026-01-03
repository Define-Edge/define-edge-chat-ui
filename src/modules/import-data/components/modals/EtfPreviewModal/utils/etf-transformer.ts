/**
 * ETF-specific data transformations
 *
 * TODO: SET_TYPE - Update all transformations based on actual ETF FI data response
 */

import {
  ETFHolding,
  ETFHoldingWithQuantity,
  ETFFiDataResponse,
  ETF_QUANTITY_FIELD,
} from "@/modules/import-data/types/etf";

/**
 * Extract all ETF holdings from FI data response
 * TODO: SET_TYPE - Verify structure matches actual ETF API response
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
 * TODO: SET_TYPE - Update markdown format based on actual ETF data fields
 */
export function transformETFsToMarkdownFormat(
  holdings: ETFHolding[],
): Record<string, string>[] {
  return holdings.map((holding) => ({
    "ETF Name": holding.etfName || "", // TODO: SET_TYPE - Verify field name
    "ISIN": holding.isin || "",
    "Units": holding.etfUnits || "", // TODO: SET_TYPE - Verify field name
  }));
}
