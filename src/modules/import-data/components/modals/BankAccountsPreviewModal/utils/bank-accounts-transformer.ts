/**
 * Bank account-specific data transformations
 */

import {
  BankAccount,
  BankAccountWithFormData,
  BankAccountsFiDataResponse,
} from "@/modules/import-data/types/bank-accounts";

/**
 * Extract all bank accounts from FI data response
 */
export function extractBankAccountsFromFiData(
  fiData: BankAccountsFiDataResponse | undefined | null,
): BankAccount[] {
  if (!fiData) return [];
  return fiData;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Transform bank accounts to form data with display fields
 */
export function transformBankAccountsToFormData(
  accounts: BankAccount[],
): BankAccountWithFormData[] {
  return accounts.map((account) => ({
    ...account,
    displayBalance: formatCurrency(account.Summary.currentBalance),
    displayBank: account.bank,
    displayAccountType: account.Summary.type,
    displayAccountNumber: account.maskedAccountNumber,
    quantity: 1, // Always 1 for bank accounts (for consistency with other holdings)
  }));
}

/**
 * Transform form data back to bank accounts (for submission)
 * Filters out accounts with quantity = 0
 */
export function transformFormDataToBankAccounts(
  formAccounts: BankAccountWithFormData[],
): BankAccount[] {
  // Filter out accounts with quantity = 0
  const validAccounts = formAccounts.filter((acc) => acc.quantity > 0);

  return validAccounts.map((account) => {
    const {
      displayBalance: _displayBalance,
      displayBank: _displayBank,
      displayAccountType: _displayAccountType,
      displayAccountNumber: _displayAccountNumber,
      quantity: _quantity,
      ...accountWithoutDisplayFields
    } = account;

    return accountWithoutDisplayFields as BankAccount;
  });
}

/**
 * Transform bank accounts to markdown-ready format for import mutation
 */
export function transformBankAccountsToMarkdownFormat(
  accounts: BankAccount[],
): Record<string, string>[] {
  return accounts.map((account) => ({
    "Bank Name": account.bank || "",
    "Account Type": account.Summary.type || "",
    "Account Number": account.maskedAccountNumber || "",
    "Current Balance": formatCurrency(account.Summary.currentBalance) || "",
    "Branch": account.Summary.branch || "",
    "IFSC Code": account.Summary.ifscCode || "",
    "Status": account.Summary.status || "",
  }));
}
