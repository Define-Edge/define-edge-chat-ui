/**
 * ETF-specific types and constants
 *
 * TODO: SET_TYPE - Update all ETF fields based on actual FI data response structure
 * These are placeholder types until we receive the actual ETF API response format
 */

import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { BaseHolding, BaseAccountType, ColumnConfig } from "./common";

/**
 * ETF-specific holding type
 * TODO: SET_TYPE - Verify and update field names based on actual API response
 */
export interface ETFHolding extends BaseHolding {
  etfUnits: string; // TODO: SET_TYPE - Verify field name from API response
  etfName: string; // TODO: SET_TYPE - Verify field name from API response
  etfPrice: string; // TODO: SET_TYPE - Verify field name from API response
  isinDescription: string;
  // TODO: SET_TYPE - Add other ETF-specific fields as needed
}

/**
 * ETF holding with quantity field for form management
 */
export type ETFHoldingWithQuantity = ETFHolding & { quantity: number };

/**
 * ETF FI data account type
 */
export type ETFFiDataAccount = BaseAccountType<ETFHolding> & {
  fiType: "ETF";
};

/**
 * ETF FI data response (array of accounts)
 */
export type ETFFiDataResponse = ETFFiDataAccount[];

/**
 * ETF form data structure
 */
export interface ETFFormData {
  holdings: ETFHoldingWithQuantity[];
}

/**
 * ETF markdown format for chat import
 * TODO: SET_TYPE - Update columns based on actual ETF data structure
 */
export interface ETFMarkdownFormat {
  "ETF Name": string; // TODO: SET_TYPE - Verify field name
  "ISIN": string;
  "Units": string; // TODO: SET_TYPE - Verify field name
}

/**
 * Column configurations for ETF holdings table
 * TODO: SET_TYPE - Update columns based on actual ETF FI data response structure
 */
export const ETF_COLUMNS: readonly ColumnConfig[] = [
  { key: "etfName", label: "ETF Name", align: "left" }, // TODO: SET_TYPE - Verify field name
  { key: "isin", label: "ISIN", align: "left" },
  { key: "quantity", label: "Units", align: "right" }, // TODO: SET_TYPE - Verify field name
  { key: "action", label: "Action", align: "center" },
] as const;

/**
 * Quantity field name for ETFs
 * TODO: SET_TYPE - Update based on actual field name from API response
 */
export const ETF_QUANTITY_FIELD = "etfUnits" as const; // TODO: SET_TYPE - Verify correct field name

/**
 * Consent type constant
 */
export const ETF_CONSENT_TYPE = ConsentType.ETF;
