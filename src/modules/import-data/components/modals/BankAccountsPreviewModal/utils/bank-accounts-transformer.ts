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
 * Calculate transaction insights from transaction history
 */
function calculateTransactionInsights(account: BankAccount): {
  totalTransactions: number;
  totalDebits: number;
  totalCredits: number;
  avgMonthlySpending: string;
  avgMonthlyIncome: string;
  lastTransactionDate: string;
  transactionPeriod: string;
} {
  const transactions = account.Transactions?.Transaction || [];

  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalDebits: 0,
      totalCredits: 0,
      avgMonthlySpending: "₹0",
      avgMonthlyIncome: "₹0",
      lastTransactionDate: "N/A",
      transactionPeriod: "N/A",
    };
  }

  // Calculate totals
  let totalDebitAmount = 0;
  let totalCreditAmount = 0;
  let debitCount = 0;
  let creditCount = 0;

  transactions.forEach((txn) => {
    const amount = parseFloat(txn.amount);
    if (!isNaN(amount)) {
      if (txn.type === "DEBIT") {
        totalDebitAmount += amount;
        debitCount++;
      } else if (txn.type === "CREDIT") {
        totalCreditAmount += amount;
        creditCount++;
      }
    }
  });

  // Get date range
  const startDate = account.Transactions.startDate;
  const endDate = account.Transactions.endDate;
  const lastTransaction = transactions[transactions.length - 1];
  const lastTxnDate = lastTransaction
    ? new Date(lastTransaction.transactionTimestamp).toLocaleDateString("en-IN")
    : "N/A";

  // Calculate months in period for averaging
  const start = new Date(startDate);
  const end = new Date(endDate);
  const monthsDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;
  const months = Math.max(monthsDiff, 1);

  // Calculate averages
  const avgMonthlySpending = formatCurrency((totalDebitAmount / months).toFixed(2));
  const avgMonthlyIncome = formatCurrency((totalCreditAmount / months).toFixed(2));

  return {
    totalTransactions: transactions.length,
    totalDebits: debitCount,
    totalCredits: creditCount,
    avgMonthlySpending,
    avgMonthlyIncome,
    lastTransactionDate: lastTxnDate,
    transactionPeriod: `${new Date(startDate).toLocaleDateString("en-IN")} to ${new Date(endDate).toLocaleDateString("en-IN")}`,
  };
}

/**
 * Account insights for chat analysis
 */
export interface AccountInsights {
  accountType: string;
  currentBalance: string;
  totalTransactions: number;
  totalDebits: number;
  totalCredits: number;
  avgMonthlySpending: string;
  avgMonthlyIncome: string;
  lastTransactionDate: string;
  transactionPeriod: string;
}

/**
 * Transform bank accounts to insights format for chat analysis
 * Excludes sensitive information like bank name, account number, IFSC code
 */
export function transformBankAccountsToInsights(
  accounts: BankAccount[],
): AccountInsights[] {
  return accounts.map((account) => {
    const insights = calculateTransactionInsights(account);

    return {
      accountType: account.Summary.type || "UNKNOWN",
      currentBalance: formatCurrency(account.Summary.currentBalance) || "₹0",
      totalTransactions: insights.totalTransactions,
      totalDebits: insights.totalDebits,
      totalCredits: insights.totalCredits,
      avgMonthlySpending: insights.avgMonthlySpending,
      avgMonthlyIncome: insights.avgMonthlyIncome,
      lastTransactionDate: insights.lastTransactionDate,
      transactionPeriod: insights.transactionPeriod,
    };
  });
}

/**
 * Format account insights as natural text for chat
 */
export function formatAccountsAsText(insights: AccountInsights[]): string {
  if (insights.length === 0) return "No bank accounts found.";

  const lines: string[] = [];

  insights.forEach((account, index) => {
    lines.push(`Account ${index + 1} (${account.accountType}):`);
    lines.push(`  Current Balance: ${account.currentBalance}`);
    lines.push(`  Transaction Period: ${account.transactionPeriod}`);
    lines.push(`  Total Transactions: ${account.totalTransactions} (${account.totalDebits} debits, ${account.totalCredits} credits)`);
    lines.push(`  Avg Monthly Spending: ${account.avgMonthlySpending}`);
    lines.push(`  Avg Monthly Income: ${account.avgMonthlyIncome}`);
    lines.push(`  Last Transaction: ${account.lastTransactionDate}`);
    lines.push("");
  });

  return lines.join("\n");
}
