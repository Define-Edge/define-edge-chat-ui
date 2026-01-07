/**
 * Bank Account Card Component
 * Card-based layout for bank accounts with expandable analytics
 * Responsive design optimized for both mobile and desktop
 */

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { AccountAnalytics } from "./AccountAnalytics";

interface BankAccountCardProps {
  /** Bank account data */
  account: BankAccountWithFormData;
  /** Index of this account in the field array */
  index: number;
  /** Callback to remove this account */
  onRemove: (index: number) => void;
  /** Whether the card is currently expanded */
  isExpanded: boolean;
  /** Callback to toggle the expanded state */
  onToggleExpand: () => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * Bank Account Card Component with expandable analytics
 */
export function BankAccountCard({
  account,
  index,
  onRemove,
  isExpanded,
  onToggleExpand,
  className,
}: BankAccountCardProps) {
  // Check if account has transaction data
  const hasTransactions =
    account.Transactions?.Transaction &&
    account.Transactions.Transaction.length > 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Main Account Info */}
        <div className="p-4 md:p-6">
          {/* Header: Bank Name and Actions */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                    {account.displayBank || "Unknown Bank"}
                  </h3>
                  {hasTransactions && (
                    <span
                      title="Has transaction analytics"
                      className="flex-shrink-0"
                    >
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {account.displayAccountType || "Unknown Type"}
                </p>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
              title="Remove account"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Account Details Grid */}
          <div className="space-y-3">
            {/* Account Number */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Account Number
              </span>
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {account.displayAccountNumber || "N/A"}
              </span>
            </div>

            {/* Balance - Highlighted */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Balance
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {account.displayBalance || "₹0.00"}
              </span>
            </div>
          </div>

          {/* Analytics Toggle Button */}
          {hasTransactions && (
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleExpand}
                className="flex w-full items-center justify-center gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Analytics
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    View Transaction Analytics
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Expanded Analytics Section */}
        {isExpanded && hasTransactions && (
          <div className="overflow-hidden border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gray-50/50 p-3 md:p-6 dark:bg-gray-900/50">
              <AccountAnalytics account={account} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
