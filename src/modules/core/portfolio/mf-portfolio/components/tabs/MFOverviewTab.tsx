import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DistributionItem } from "@/api/generated/mf-portfolio-apis/models";

interface MFOverviewTabProps {
  categoryWiseAllocations: DistributionItem[];
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

/**
 * MF Portfolio Overview Tab Component
 * Displays SEBI category allocation pie chart
 */
export function MFOverviewTab({
  categoryWiseAllocations,
}: MFOverviewTabProps) {
  // Add colors to distribution items
  const categoriesWithColors = categoryWiseAllocations.map((item, index) => ({
    ...item,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  return (
    <div className="space-y-6 pb-28">
      {/* SEBI Category Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          SEBI Category Allocation
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-48 md:w-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoriesWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 flex-1">
            {categoriesWithColors.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-text-secondary truncate">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {category.value.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
