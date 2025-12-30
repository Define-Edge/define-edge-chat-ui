import { ConsentType } from "@/lib/moneyone/moneyone.enums";

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
 * Mapping of consent types to quantity field names in Holding type
 */
export const QUANTITY_FIELD_MAP = {
  [ConsentType.EQUITIES]: "units",
  [ConsentType.MUTUAL_FUNDS]: "closingUnits",
} as const;

/**
 * Mapping of consent types to asset type display names
 */
export const ASSET_TYPE_MAP = {
  [ConsentType.EQUITIES]: "Equity",
  [ConsentType.MUTUAL_FUNDS]: "Mutual Fund",
} as const;

/**
 * Search API configuration
 */
export const SEARCH_CONFIG = {
  debounceMs: 500,
  resultLimit: 6,
  staleTimeMs: 5 * 60 * 1000, // 5 minutes
} as const;
