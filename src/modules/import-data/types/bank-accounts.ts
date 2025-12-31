/**
 * Bank Account-specific types and constants
 */

import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { ColumnConfig } from "./common";

/**
 * Holder information
 */
export interface Holder {
  name: string;
  dob: string;
  mobile: string;
  ckycCompliance: string;
  nominee: string;
  landline: string;
  address: string;
  email: string;
  pan: string;
}

/**
 * Account profile
 */
export interface Profile {
  Holders: {
    type: string;
    Holder: Holder[];
  };
}

/**
 * Transaction details
 */
export interface Transaction {
  type: "DEBIT" | "CREDIT";
  mode: string;
  amount: string;
  currentBalance: string;
  transactionTimestamp: string;
  valueDate: string;
  txnId: string;
  narration: string;
  reference: string;
}

/**
 * Bank account summary (different from investment holdings)
 */
export interface BankAccountSummary {
  exchgeRate: string;
  currentBalance: string;
  currency: string;
  balanceDateTime: string;
  type: "SAVINGS" | "CURRENT" | "SALARY" | "OTHER";
  branch: string;
  facility: string;
  ifscCode: string;
  micrCode: string;
  openingDate: string;
  currentODLimit: string;
  drawingLimit: string;
  status: "ACTIVE" | "INACTIVE" | "CLOSED";
  Pending: unknown[];
}

/**
 * Transactions container
 */
export interface Transactions {
  startDate: string;
  endDate: string;
  Transaction: Transaction[];
}

/**
 * Bank account data (single account)
 */
export interface BankAccount {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: "DEPOSIT";
  bank: string;
  Profile: Profile;
  Summary: BankAccountSummary;
  Transactions: Transactions;
}

/**
 * Bank account with form-ready data for display
 */
export interface BankAccountWithFormData extends BankAccount {
  displayBalance: string;
  displayBank: string;
  displayAccountType: string;
  displayAccountNumber: string;
  quantity: number; // For consistency with other holdings (always 1 for bank accounts)
}

/**
 * Bank accounts FI data response (array of accounts)
 */
export type BankAccountsFiDataResponse = BankAccount[];

/**
 * Bank account form data structure
 */
export interface BankAccountsFormData {
  accounts: BankAccountWithFormData[];
}

/**
 * Bank account markdown format for chat import
 */
export interface BankAccountMarkdownFormat {
  "Bank Name": string;
  "Account Type": string;
  "Account Number": string;
  "Current Balance": string;
  "Branch": string;
  "IFSC Code": string;
  "Status": string;
}

/**
 * Column configurations for bank accounts table
 */
export const BANK_ACCOUNT_COLUMNS: readonly ColumnConfig[] = [
  { key: "displayBank", label: "Bank Name", align: "left" },
  { key: "displayAccountType", label: "Account Type", align: "left" },
  { key: "displayAccountNumber", label: "Account Number", align: "left" },
  { key: "displayBalance", label: "Balance (INR)", align: "right" },
  { key: "action", label: "Action", align: "center" },
] as const;

/**
 * Consent type constant
 */
export const BANK_ACCOUNTS_CONSENT_TYPE = ConsentType.BANK_ACCOUNTS;
