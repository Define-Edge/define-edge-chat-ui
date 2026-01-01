/**
 * Balance Trend Chart Component
 * Displays account balance over time using a line chart
 */

"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  BalanceDataPoint,
  formatCurrency,
} from "../utils/transaction-analytics";

interface BalanceTrendChartProps {
  data: BalanceDataPoint[];
  className?: string;
}

/**
 * Custom tooltip for balance trend chart
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as BalanceDataPoint;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {data.formattedDate}
      </p>
      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
        Balance: {formatCurrency(data.balance)}
      </p>
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
 * Balance Trend Chart Component
 */
export function BalanceTrendChart({ data, className }: BalanceTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Balance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">
            No transaction data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Limit data points for better performance (show every nth point if too many)
  const MAX_POINTS = 100;
  let displayData = data;
  if (data.length > MAX_POINTS) {
    const step = Math.ceil(data.length / MAX_POINTS);
    displayData = data.filter((_, index) => index % step === 0);
    // Always include the last point
    if (displayData[displayData.length - 1] !== data[data.length - 1]) {
      displayData.push(data[data.length - 1]);
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Balance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={displayData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
