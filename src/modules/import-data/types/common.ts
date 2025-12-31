/**
 * Common types shared across all consent types
 */

import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { ConsentData } from "@/lib/moneyone/moneyone.storage";

/**
 * Base holding type with fields common to all asset types
 */
export interface BaseHolding {
  ucc: string;
  isin: string;
  lienUnits: string;
  registrar: string;
  FatcaStatus: string;
  lockinUnits: string;
}

/**
 * Base FI data account summary structure
 */
export interface BaseFiDataAccountSummary<THolding> {
  costValue: string;
  currentValue: string;
  Investment: {
    Holdings: {
      Holding: THolding[];
    };
  };
}

/**
 * Base account type structure
 */
export interface BaseAccountType<THolding> {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: string;
  bank: string;
  Summary?: BaseFiDataAccountSummary<THolding>;
}

/**
 * Base props for all analysis modal components
 */
export interface BaseAnalysisModalProps {
  consent?: ConsentData | null;
}

/**
 * Column configuration for holdings tables
 */
export interface ColumnConfig {
  key: string;
  label: string;
  align: "left" | "right" | "center";
}

/**
 * Common constants used across consent types
 */
export const SEARCH_CONFIG = {
  debounceMs: 500,
  resultLimit: 6,
  staleTimeMs: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Asset type display names
 */
export const ASSET_TYPE_MAP: Record<ConsentType, string> = {
  [ConsentType.EQUITIES]: "Equity",
  [ConsentType.MUTUAL_FUNDS]: "Mutual Fund",
  [ConsentType.ETF]: "ETF",
  [ConsentType.BANK_ACCOUNTS]: "Bank Account",
} as const;
