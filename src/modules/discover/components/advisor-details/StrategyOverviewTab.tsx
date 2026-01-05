import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  mockSectorAllocation,
  mockSizeAllocation,
} from "../../constants/advisor-strategy-mock-data";

/**
 * Strategy Overview Tab Component
 * Displays key metrics, sector allocation pie chart, and market cap allocation
 * Component size: ~180 lines
 */
export function StrategyOverviewTab() {
  return (
    <div className="space-y-6 pb-28">
      {/* Sector Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">Sector Allocation</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockSectorAllocation}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {mockSectorAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-4">
          {mockSectorAllocation.map((sector, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sector.color }}
                ></div>
                <span className="text-sm text-text-secondary">{sector.name}</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {sector.value}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Size Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Market Cap Allocation
        </h3>
        <div className="space-y-3">
          {mockSizeAllocation.map((size, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">{size.name}</span>
                <span className="text-sm font-medium text-text-primary">
                  {size.value}%
                </span>
              </div>
              <div className="w-full bg-border-default rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${size.value}%`,
                    backgroundColor: size.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
