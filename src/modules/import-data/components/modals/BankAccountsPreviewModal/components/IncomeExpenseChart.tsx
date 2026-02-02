/**
 * Income vs Expense Chart Component
 * Displays monthly income and expenses comparison using a bar chart
 */

"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { MonthlyData, formatCurrency } from "../utils/transaction-analytics";

interface IncomeExpenseChartProps {
  data: MonthlyData[];
  startDate?: string;
  endDate?: string;
  className?: string;
}

/**
 * Custom tooltip for income/expense chart
 */
function CustomTooltip({ active, payload, label, startDate, endDate }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as MonthlyData;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Month</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Income:
            </span>
            <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
              {formatCurrency(data.income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Expenses:
            </span>
            <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
              {formatCurrency(data.expenses)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Net Flow:
            </span>
            <span
              className={`text-sm font-bold ${
                data.netFlow >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(data.netFlow)}
            </span>
          </div>
        </div>
        {startDate && endDate && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing monthly summary from {startDate} to {endDate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Format Y-axis values to compact currency format
 */
function formatYAxis(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
}

/**
 * Income vs Expense Chart Component
 */
export function IncomeExpenseChart({
  data,
  startDate,
  endDate,
  className,
}: IncomeExpenseChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 pt-2 md:pt-4">
            <BarChart3 className="w-4 h-4" />
            Income vs Expenses
          </CardTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Compare monthly income and expenses side-by-side
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">
            No monthly data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Limit to last 12 months for better readability
  const displayData = data.slice(-12);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 pt-2 md:pt-4">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Income vs Expenses
        </CardTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compare monthly income and expenses to track your cash flow patterns
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={displayData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
            <Tooltip
              content={
                <CustomTooltip startDate={startDate} endDate={endDate} />
              }
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#10b981"
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
