import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import {
  FiDataResponse,
  Holding,
} from "@/lib/moneyone/moneyone.types";
import {
  MutualFundSearchResponse,
  StockSearchResponse,
} from "@/types/search-api.types";
import { QUANTITY_FIELD_MAP, ASSET_TYPE_MAP } from "./holdings-constants";

/**
 * Type for holding with quantity field for form management
 */
export type HoldingWithQuantity = Holding & { quantity: number };

/**
 * Extract all holdings from FI data response
 */
export function extractHoldingsFromFiData(
  fiData: FiDataResponse | undefined | null,
): Holding[] {
  if (!fiData) return [];

  const allHoldings: Holding[] = [];

  fiData.forEach((account) => {
    if (account.Summary?.Investment?.Holdings?.Holding) {
      allHoldings.push(...account.Summary.Investment.Holdings.Holding);
    }
  });

  return allHoldings;
}

/**
 * Transform holdings to form data with quantity field
 */
export function transformHoldingsToFormData(
  holdings: Holding[],
  consentType: ConsentType,
): HoldingWithQuantity[] {
  const quantityField = QUANTITY_FIELD_MAP[consentType];

  return holdings.map((holding) => ({
    ...holding,
    quantity: parseFloat(holding[quantityField] || "0"),
  }));
}

/**
 * Transform form data back to holdings (for submission)
 * Filters out holdings with quantity = 0
 */
export function transformFormDataToHoldings(
  formHoldings: HoldingWithQuantity[],
  consentType: ConsentType,
): Holding[] {
  const quantityField = QUANTITY_FIELD_MAP[consentType];

  // Filter out holdings with quantity = 0
  const validHoldings = formHoldings.filter((h) => h.quantity > 0);

  return validHoldings.map((holding) => {
    const { quantity, ...holdingWithoutQuantity } = holding;

    return {
      ...holdingWithoutQuantity,
      [quantityField]: quantity.toString(),
    };
  });
}

/**
 * Transform search result (equity or mutual fund) to holding with quantity
 */
export function transformSearchResultToHolding(
  result:
    | StockSearchResponse["results"][0]
    | MutualFundSearchResponse["results"][0],
  consentType: ConsentType,
): HoldingWithQuantity {
  if (consentType === ConsentType.EQUITIES && "symbol" in result) {
    // Add equity
    return {
      issuerName: result.compname,
      isin: result.symbol,
      isinDescription: result.compname,
      units: "0",
      lastTradedPrice: "0",
      quantity: 0,
    } as HoldingWithQuantity;
  } else if ("schemeCode" in result) {
    // Add mutual fund
    return {
      schemeTypes: result.sName,
      amc: result.legalNames,
      folioNo: "",
      closingUnits: "0",
      nav: "0",
      navDate: "",
      quantity: 0,
    } as HoldingWithQuantity;
  }

  throw new Error("Invalid search result type");
}

/**
 * Transform holdings to markdown-ready format for import mutation
 */
export function transformHoldingsToMarkdownFormat(
  holdings: Holding[],
  consentType: ConsentType,
): Record<string, string>[] {
  return holdings.map((holding) => {
    if (consentType === ConsentType.EQUITIES) {
      return {
        "Company Name": holding.issuerName || "",
        ISIN: holding.isin || "",
        Units: holding.units || "",
      } as Record<string, string>;
    } else {
      // Mutual Funds
      return {
        Description: holding.isinDescription || holding.schemeTypes || "",
        ISIN: holding.isin || "",
        "Closing Units": holding.closingUnits || "",
      } as Record<string, string>;
    }
  });
}

/**
 * Get asset type display name from consent type
 */
export function getAssetTypeName(consentType: ConsentType): string {
  return ASSET_TYPE_MAP[consentType];
}
