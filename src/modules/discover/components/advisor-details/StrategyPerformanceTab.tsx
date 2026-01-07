import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockPerformanceData } from "../../constants/advisor-strategy-mock-data";

/**
 * Strategy Performance Tab Component
 * Displays performance comparison chart vs benchmarks
 * Component size: ~100 lines
 */
export function StrategyPerformanceTab() {
  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">
          Performance Comparison
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="basket"
                stroke="#0088FE"
                strokeWidth={2}
                name="This Strategy"
                dot={{ fill: "#0088FE", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="nifty"
                stroke="#00C49F"
                strokeWidth={2}
                name="Nifty 50"
                dot={{ fill: "#00C49F", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="industry"
                stroke="#FFBB28"
                strokeWidth={2}
                name="Industry Avg"
                dot={{ fill: "#FFBB28", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">This Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Nifty 50</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Industry Avg</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
