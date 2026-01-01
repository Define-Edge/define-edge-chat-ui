/**
 * Account Analytics Container Component
 * Combines all analytics visualizations for a single bank account
 */

"use client";
import { useMemo } from "react";
import { BankAccount } from "@/modules/import-data/types/bank-accounts";
import {
  prepareBalanceTrendData,
  aggregateMonthlyData,
  processTransactionsForDisplay,
  calculateTransactionStats,
} from "../utils/transaction-analytics";
import { BalanceTrendChart } from "./BalanceTrendChart";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { TransactionsList } from "./TransactionsList";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils/transaction-analytics";
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Calendar,
} from "lucide-react";

interface AccountAnalyticsProps {
  account: BankAccount;
  className?: string;
}

/**
 * Stats Card Component
 */
function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div
            className={`p-2 rounded-lg ${
              trend === "up"
                ? "bg-green-100 dark:bg-green-900/30"
                : trend === "down"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-blue-100 dark:bg-blue-900/30"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-blue-600"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Account Analytics Component
 */
export function AccountAnalytics({ account, className }: AccountAnalyticsProps) {
  // Extract transactions (memoized to prevent recreating array on every render)
  const transactions = useMemo(
    () => account.Transactions?.Transaction || [],
    [account.Transactions?.Transaction],
  );

  // Prepare data for visualizations (memoized)
  const balanceTrendData = useMemo(
    () => prepareBalanceTrendData(transactions),
    [transactions],
  );

  const monthlyData = useMemo(
    () => aggregateMonthlyData(transactions),
    [transactions],
  );

  const recentTransactions = useMemo(
    () => processTransactionsForDisplay(transactions, 15),
    [transactions],
  );

  const stats = useMemo(
    () => calculateTransactionStats(transactions),
    [transactions],
  );

  // Date range
  const startDate = account.Transactions?.startDate;
  const endDate = account.Transactions?.endDate;

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">
          No transaction data available for this account
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Range Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Transaction History: {startDate} to {endDate}
          </span>
          <span className="ml-auto text-sm text-blue-700 dark:text-blue-300">
            {stats.transactionCount} transactions
          </span>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          label="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon={TrendingDown}
          trend="down"
        />
        <StatsCard
          label="Net Cash Flow"
          value={formatCurrency(stats.netFlow)}
          icon={ArrowRightLeft}
          trend={stats.netFlow >= 0 ? "up" : "down"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrendChart data={balanceTrendData} />
        <IncomeExpenseChart data={monthlyData} />
      </div>

      {/* Recent Transactions */}
      <TransactionsList transactions={recentTransactions} maxHeight="500px" />
    </div>
  );
}
