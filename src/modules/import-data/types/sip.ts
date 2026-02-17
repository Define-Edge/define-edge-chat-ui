/**
 * SIP-specific types and constants
 */

import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { ColumnConfig } from "./common";

/**
 * SIP holder profile information
 */
export interface SIPHolder {
  dob: string;
  pan: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  nominee: string;
  landline: string;
  kycCompliance: string;
}

/**
 * SIP account profile structure
 */
export interface SIPProfile {
  Holders: {
    type: string;
    Holder: SIPHolder[];
  };
}

/**
 * SIP FI data account type (Profile-only, no Summary)
 */
export interface SIPAccount {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: "SIP";
  bank: string;
  Profile?: SIPProfile;
}

/**
 * SIP FI data response (array of accounts)
 */
export type SIPFiDataResponse = SIPAccount[];

/**
 * SIP display data for the preview table
 */
export interface SIPDisplayData {
  fundHouse: string;
  maskedAccountNumber: string;
  registrar: string;
  holderName: string;
}

/**
 * SIP markdown format for chat import
 */
export interface SIPMarkdownFormat {
  "Fund House": string;
  "Account Number": string;
  "Registrar": string;
  "Holder Name": string;
}

/**
 * Column configurations for SIP accounts table (read-only, no action column)
 */
export const SIP_COLUMNS: readonly ColumnConfig[] = [
  { key: "fundHouse", label: "Fund House", align: "left" },
  { key: "maskedAccountNumber", label: "Account Number", align: "left" },
  { key: "registrar", label: "Registrar", align: "left" },
  { key: "holderName", label: "Holder Name", align: "left" },
] as const;

/**
 * Consent type constant
 */
export const SIP_CONSENT_TYPE = ConsentType.SIP;
