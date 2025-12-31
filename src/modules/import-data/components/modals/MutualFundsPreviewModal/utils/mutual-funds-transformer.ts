/**
 * Mutual Fund-specific data transformations
 */

import {
  MutualFundHolding,
  MutualFundHoldingWithQuantity,
  MutualFundsFiDataResponse,
  MUTUAL_FUND_QUANTITY_FIELD,
} from "@/modules/import-data/types/mutual-funds";
import { MutualFundSearchResponse } from "@/types/search-api.types";

/**
 * Extract all mutual fund holdings from FI data response
 */
export function extractMutualFundsFromFiData(
  fiData: MutualFundsFiDataResponse | undefined | null,
): MutualFundHolding[] {
  if (!fiData) return [];

  const allHoldings: MutualFundHolding[] = [];

  fiData.forEach((account) => {
    if (account.Summary?.Investment?.Holdings?.Holding) {
      allHoldings.push(...account.Summary.Investment.Holdings.Holding);
    }
  });

  return allHoldings;
}

/**
 * Transform mutual fund holdings to form data with quantity field
 */
export function transformMutualFundsToFormData(
  holdings: MutualFundHolding[],
): MutualFundHoldingWithQuantity[] {
  return holdings.map((holding) => ({
    ...holding,
    quantity: parseFloat(holding[MUTUAL_FUND_QUANTITY_FIELD] || "0"),
  }));
}

/**
 * Transform form data back to mutual fund holdings (for submission)
 * Filters out holdings with quantity = 0
 */
export function transformFormDataToMutualFunds(
  formHoldings: MutualFundHoldingWithQuantity[],
): MutualFundHolding[] {
  // Filter out holdings with quantity = 0
  const validHoldings = formHoldings.filter((h) => h.quantity > 0);

  return validHoldings.map((holding) => {
    const { quantity, ...holdingWithoutQuantity } = holding;

    return {
      ...holdingWithoutQuantity,
      [MUTUAL_FUND_QUANTITY_FIELD]: quantity.toString(),
    } as MutualFundHolding;
  });
}

/**
 * Transform mutual fund search result to holding with quantity
 */
export function transformMutualFundSearchResultToHolding(
  result: MutualFundSearchResponse["results"][0],
): MutualFundHoldingWithQuantity {
  return {
    schemeTypes: result.sName,
    amc: result.legalNames,
    folioNo: "",
    closingUnits: "0",
    nav: "0",
    navDate: "",
    quantity: 0,
    isinDescription: result.sName,
    isin: "",
    ucc: "",
    lienUnits: "0",
    registrar: "",
    FatcaStatus: "",
    lockinUnits: "0",
    amfiCode: "",
    schemeCode: result.schemeCode,
    schemeOption: "",
    schemeCategory: "",
  };
}

/**
 * Transform mutual fund holdings to markdown-ready format for import mutation
 */
export function transformMutualFundsToMarkdownFormat(
  holdings: MutualFundHolding[],
): Record<string, string>[] {
  return holdings.map((holding) => ({
    "Description": holding.isinDescription || holding.schemeTypes || "",
    "ISIN": holding.isin || "",
    "Closing Units": holding.closingUnits || "",
  }));
}
