/**
 * Bank Account Table Row with Analytics
 * Expandable row component that shows transaction analytics
 */

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import { AccountAnalytics } from "./AccountAnalytics";

interface BankAccountTableRowProps {
  /** Bank account data */
  account: BankAccountWithFormData;
  /** Index of this row in the field array */
  index: number;
  /** Callback to remove this account */
  onRemove: (index: number) => void;
}

/**
 * Bank Account Table Row Component with expandable analytics
 */
export function BankAccountTableRow({
  account,
  index,
  onRemove,
}: BankAccountTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if account has transaction data
  const hasTransactions =
    account.Transactions?.Transaction &&
    account.Transactions.Transaction.length > 0;

  return (
    <>
      {/* Main Row */}
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
        {/* Expand/Collapse Button Column */}
        <td className="px-4 py-3">
          {hasTransactions ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-auto"
              title="View transaction analytics"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-blue-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          ) : (
            <div className="w-6 h-6" /> // Placeholder for alignment
          )}
        </td>

        {/* Bank Name Column */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {account.displayBank || "-"}
            </span>
            {hasTransactions && (
              <span title="Has analytics">
                <BarChart3 className="w-3 h-3 text-blue-500" />
              </span>
            )}
          </div>
        </td>

        {/* Account Type Column */}
        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
          {account.displayAccountType || "-"}
        </td>

        {/* Account Number Column */}
        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
          {account.displayAccountNumber || "-"}
        </td>

        {/* Balance Column */}
        <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100 font-semibold">
          {account.displayBalance || "-"}
        </td>

        {/* Remove Button */}
        <td className="px-4 py-3 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </td>
      </tr>

      {/* Expanded Analytics Row */}
      {isExpanded && hasTransactions && (
        <tr>
          <td colSpan={6} className="bg-gray-50/50 dark:bg-gray-900/50 p-0">
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <AccountAnalytics account={account} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
