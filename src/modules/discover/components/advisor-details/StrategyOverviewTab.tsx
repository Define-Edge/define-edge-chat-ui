import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DistributionItem } from "@/api/generated/strategy-apis/models";

interface StrategyOverviewTabProps {
  industryDistribution: DistributionItem[];
  sizeDistribution: DistributionItem[];
}

// Color palette for pie charts
const PIE_COLORS = [
  "#4F46E5", // Indigo
  "#06B6D4", // Cyan
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Green
  "#EF4444", // Red
  "#6366F1", // Blue
  "#14B8A6", // Teal
  "#F97316", // Orange
];

// Color palette for size distribution bars
const SIZE_COLORS = {
  Large: "#4F46E5", // Indigo
  Mid: "#06B6D4", // Cyan
  Small: "#8B5CF6", // Purple
};

/**
 * Strategy Overview Tab Component
 * Displays key metrics, sector allocation pie chart, and market cap allocation
 * Component size: ~180 lines
 */
export function StrategyOverviewTab({
  industryDistribution,
  sizeDistribution,
}: StrategyOverviewTabProps) {
  // Add colors to distribution items
  const industryWithColors = industryDistribution.map((item, index) => ({
    ...item,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const sizeWithColors = sizeDistribution.map((item) => ({
    ...item,
    color: SIZE_COLORS[item.name as keyof typeof SIZE_COLORS] || PIE_COLORS[0],
  }));

  return (
    <div className="space-y-6 pb-28">
      {/* Industry Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Industry Allocation
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={industryWithColors}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {industryWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-4">
          {industryWithColors.map((industry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: industry.color }}
                ></div>
                <span className="text-sm text-text-secondary">
                  {industry.name}
                </span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {industry.value.toFixed(2)}%
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
          {sizeWithColors.map((size, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">{size.name}</span>
                <span className="text-sm font-medium text-text-primary">
                  {size.value.toFixed(2)}%
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
