/**
 * Bank Account Card Component
 * Card-based layout for bank accounts with expandable analytics
 * Responsive design optimized for both mobile and desktop
 */

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Building2,
} from "lucide-react";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import { AccountAnalytics } from "./AccountAnalytics";
import { cn } from "@/lib/utils";

interface BankAccountCardProps {
  /** Bank account data */
  account: BankAccountWithFormData;
  /** Index of this account in the field array */
  index: number;
  /** Callback to remove this account */
  onRemove: (index: number) => void;
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
  className,
}: BankAccountCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {account.displayBank || "Unknown Bank"}
                  </h3>
                  {hasTransactions && (
                    <span
                      title="Has transaction analytics"
                      className="flex-shrink-0"
                    >
                      <BarChart3 className="w-4 h-4 text-blue-500" />
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
              title="Remove account"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Account Details Grid */}
          <div className="space-y-3">
            {/* Account Number */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Account Number
              </span>
              <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                {account.displayAccountNumber || "N/A"}
              </span>
            </div>

            {/* Balance - Highlighted */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
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
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Analytics
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    View Transaction Analytics
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Expanded Analytics Section */}
        {isExpanded && hasTransactions && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-3 md:p-6">
            <AccountAnalytics account={account} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
