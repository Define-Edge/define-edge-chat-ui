/**
 * Equity-specific data transformations
 */

import {
  EquityHolding,
  EquityHoldingWithQuantity,
  EquitiesFiDataResponse,
  EQUITY_QUANTITY_FIELD,
} from "@/modules/import-data/types/equities";
import { StockSearchResponse } from "@/types/search-api.types";

/**
 * Extract all equity holdings from FI data response
 */
export function extractEquitiesFromFiData(
  fiData: EquitiesFiDataResponse | undefined | null,
): EquityHolding[] {
  if (!fiData) return [];

  const allHoldings: EquityHolding[] = [];

  fiData.forEach((account) => {
    if (account.Summary?.Investment?.Holdings?.Holding) {
      allHoldings.push(...account.Summary.Investment.Holdings.Holding);
    }
  });

  return allHoldings;
}

/**
 * Transform equity holdings to form data with quantity field
 */
export function transformEquitiesToFormData(
  holdings: EquityHolding[],
): EquityHoldingWithQuantity[] {
  return holdings.map((holding) => ({
    ...holding,
    quantity: parseFloat(holding[EQUITY_QUANTITY_FIELD] || "0"),
  }));
}

/**
 * Transform form data back to equity holdings (for submission)
 * Filters out holdings with quantity = 0
 */
export function transformFormDataToEquities(
  formHoldings: EquityHoldingWithQuantity[],
): EquityHolding[] {
  // Filter out holdings with quantity = 0
  const validHoldings = formHoldings.filter((h) => h.quantity > 0);

  return validHoldings.map((holding) => {
    const { quantity, ...holdingWithoutQuantity } = holding;

    return {
      ...holdingWithoutQuantity,
      [EQUITY_QUANTITY_FIELD]: quantity.toString(),
    } as EquityHolding;
  });
}

/**
 * Transform stock search result to equity holding with quantity
 */
export function transformStockSearchResultToHolding(
  result: StockSearchResponse["results"][0],
): EquityHoldingWithQuantity {
  return {
    issuerName: result.compname,
    isin: result.symbol,
    isinDescription: result.compname,
    units: "0",
    lastTradedPrice: "0",
    quantity: 0,
    ucc: "",
    lienUnits: "0",
    registrar: "",
    FatcaStatus: "",
    lockinUnits: "0",
  };
}

/**
 * Transform equity holdings to markdown-ready format for import mutation
 */
export function transformEquitiesToMarkdownFormat(
  holdings: EquityHolding[],
): Record<string, string>[] {
  return holdings.map((holding) => ({
    "Company Name": holding.issuerName || "",
    "ISIN": holding.isin || "",
    "Units": holding.units || "",
  }));
}
