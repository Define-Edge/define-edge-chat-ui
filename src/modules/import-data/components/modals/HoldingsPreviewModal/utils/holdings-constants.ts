import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { EquityHolding, MutualFundHolding, ETFHolding } from "@/lib/moneyone/moneyone.types";

/**
 * Column configurations for equity holdings table
 */
export const EQUITY_COLUMNS = [
  { key: "issuerName", label: "Company Name", align: "left" as const },
  { key: "isin", label: "ISIN", align: "left" as const },
  { key: "quantity", label: "Units", align: "right" as const },
  { key: "action", label: "Action", align: "center" as const },
] as const;

/**
 * Column configurations for mutual fund holdings table
 */
export const MUTUAL_FUND_COLUMNS = [
  { key: "description", label: "Description", align: "left" as const },
  { key: "isin", label: "ISIN", align: "left" as const },
  { key: "quantity", label: "Closing Units", align: "right" as const },
  { key: "action", label: "Action", align: "center" as const },
] as const;

/**
 * Column configurations for ETF holdings table
 * TODO: SET_TYPE - Update columns based on actual ETF FI data response structure
 */
export const ETF_COLUMNS = [
  { key: "etfName", label: "ETF Name", align: "left" as const }, // TODO: SET_TYPE - Verify field name
  { key: "isin", label: "ISIN", align: "left" as const },
  { key: "quantity", label: "Units", align: "right" as const }, // TODO: SET_TYPE - Verify field name
  { key: "action", label: "Action", align: "center" as const },
] as const;

/**
 * Mapping of consent types to quantity field names in Holding type
 * TODO: SET_TYPE - Update ETF quantity field based on actual FI data response
 */
export const QUANTITY_FIELD_MAP = {
  [ConsentType.EQUITIES]: "units",
  [ConsentType.MUTUAL_FUNDS]: "closingUnits",
  [ConsentType.ETF]: "etfUnits", // TODO: SET_TYPE - Verify correct field name from API response
} as const;

/**
 * Mapping of consent types to asset type display names
 */
export const ASSET_TYPE_MAP = {
  [ConsentType.EQUITIES]: "Equity",
  [ConsentType.MUTUAL_FUNDS]: "Mutual Fund",
  [ConsentType.ETF]: "ETF",
} as const;

/**
 * Search API configuration
 */
export const SEARCH_CONFIG = {
  debounceMs: 500,
  resultLimit: 6,
  staleTimeMs: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Helper function to get the display name/description for a holding based on consent type
 */
export function getHoldingName(
  holding: EquityHolding | MutualFundHolding | ETFHolding,
  consentType: ConsentType
): string {
  switch (consentType) {
    case ConsentType.EQUITIES:
      return (holding as EquityHolding).issuerName || "-";
    case ConsentType.MUTUAL_FUNDS:
      return (holding as MutualFundHolding).isinDescription || (holding as MutualFundHolding).schemeTypes || "-";
    case ConsentType.ETF:
      return (holding as ETFHolding).etfName || "-";
    default:
      return "-";
  }
}
