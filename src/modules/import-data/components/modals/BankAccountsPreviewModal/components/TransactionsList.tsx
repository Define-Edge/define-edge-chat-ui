/**
 * Transactions List Component
 * Displays recent transactions in a scrollable table format
 */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import {
  ProcessedTransaction,
  formatCurrency,
} from "../utils/transaction-analytics";
import { cn } from "@/lib/utils";

interface TransactionsListProps {
  transactions: ProcessedTransaction[];
  className?: string;
  maxHeight?: string;
}

/**
 * Transaction row component
 */
function TransactionRow({ transaction }: { transaction: ProcessedTransaction }) {
  const isCredit = transaction.type === "CREDIT";

  return (
    <div className="flex items-start gap-3 py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
      {/* Icon */}
      <div
        className={cn(
          "mt-1 p-2 rounded-full",
          isCredit
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-red-100 dark:bg-red-900/30",
        )}
      >
        {isCredit ? (
          <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
        )}
      </div>

      {/* Transaction details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {transaction.narration || "No description"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {transaction.formattedDate} • {transaction.formattedTime}
            </p>
            {transaction.mode && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                via {transaction.mode}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-semibold",
                isCredit
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {isCredit ? "+" : "-"}
              {formatCurrency(transaction.parsedAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Bal: {formatCurrency(transaction.parsedBalance)}
            </p>
          </div>
        </div>

        {/* Reference (if available) */}
        {transaction.reference && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Ref: {transaction.reference}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Transactions List Component
 */
export function TransactionsList({
  transactions,
  className,
  maxHeight = "400px",
}: TransactionsListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 pt-2 md:pt-4">
            <Receipt className="w-4 h-4" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-gray-500 text-sm">
            No transactions available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 pt-2 md:pt-4">
          <Receipt className="w-4 h-4 text-indigo-600" />
          Recent Transactions
          <span className="ml-auto text-xs font-normal text-gray-500">
            {transactions.length} transactions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{ maxHeight }}
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900 pr-2"
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.map((transaction, index) => (
              <TransactionRow key={`${transaction.txnId}-${index}`} transaction={transaction} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
