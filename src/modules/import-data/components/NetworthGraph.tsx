import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const networthData = [
  { month: 'Jan', value: 16.2 },
  { month: 'Feb', value: 16.8 },
  { month: 'Mar', value: 15.9 },
  { month: 'Apr', value: 16.5 },
  { month: 'May', value: 17.1 },
  { month: 'Jun', value: 17.8 },
  { month: 'Jul', value: 17.3 },
  { month: 'Aug', value: 18.0 },
  { month: 'Sep', value: 18.5 },
  { month: 'Oct', value: 18.2 },
  { month: 'Nov', value: 18.9 },
  { month: 'Dec', value: 18.7 }
];

export function NetworthGraph() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="font-medium text-gray-900">My Networth</h3>
        </div>
        <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
          +12.4% YTD
        </Badge>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-semibold text-gray-900">₹18.7L</div>
            <div className="text-sm text-gray-500">Total Portfolio Value</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-green-600">+₹2.1L</div>
            <div className="text-sm text-gray-500">Since last year</div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={networthData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${value}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`₹${value}L`, 'Portfolio Value']}
                labelStyle={{ color: '#374151' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-600">₹12.4L</div>
            <div className="text-xs text-gray-500">Equities</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-purple-600">₹4.8L</div>
            <div className="text-xs text-gray-500">Mutual Funds</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">₹1.5L</div>
            <div className="text-xs text-gray-500">Cash & Others</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
