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
  isLongShort: boolean;
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
 * For long-short portfolios, uses diverging bar charts to show positive and negative weights
 * Component size: ~180 lines
 */
export function StrategyOverviewTab({
  industryDistribution,
  sizeDistribution,
  isLongShort,
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

  // Helper to render left-aligned bar for industry
  const renderIndustryBar = (
    item: DistributionItem & { color: string },
    index: number
  ) => {
    const isPositive = item.value >= 0;
    const absValue = Math.abs(item.value);
    // Use varying colors based on positive/negative if needed, or keeping the palette
    // For industry, usually distinct colors per industry is better, but here we can stick to palette
    // or use Green/Red if strictly emphasizing Long/Short. 
    // Given the previous code used a palette, let's keep the palette for identity but maybe
    // add an indicator for Long/Short? 
    // Actually, plan said: "Use Color to distinguish Long (Primary Color) vs Short (Destructive/Red Color)"

    const barColor = isPositive ? "#10B981" : "#EF4444"; // Green for Long, Red for Short

    return (
      <div key={index} className="grid grid-cols-[minmax(140px,1fr)_3fr_60px] gap-4 items-center">
        {/* Label */}
        <div
          className="text-right text-sm text-text-secondary truncate"
          title={item.name}
        >
          {item.name}
        </div>

        {/* Left Aligned Bar */}
        <div className="w-full h-8 flex items-center">
          <div className="relative w-full h-5 bg-bg-subtle rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-all"
              style={{
                backgroundColor: barColor,
                width: `${Math.min(absValue, 100)}%`, // Scale 0-100%
              }}
            ></div>
          </div>
        </div>

        {/* Value */}
        <div className={`text-right text-sm font-medium tabular-nums ${isPositive ? 'text-success-text' : 'text-error-text'}`}>
          {item.value >= 0 ? "+" : ""}{item.value.toFixed(1)}%
        </div>
      </div>
    );
  };

  // Helper for Stacked Bar (Market Cap)
  const renderStackedBar = () => {
    // Calculate total absolute value to normalize percentages if they don't sum to 100 (though usually they do)
    const total = sizeWithColors.reduce((acc, item) => acc + Math.abs(item.value), 0);

    if (total === 0) return null;

    return (
      <div className="mt-2">
        {/* Stacked Bar */}
        <div className="w-full h-8 flex rounded-md overflow-hidden bg-bg-subtle">
          {sizeWithColors.map((item, index) => {
            const widthPct = (Math.abs(item.value) / total) * 100;
            if (widthPct === 0) return null;
            return (
              <div
                key={index}
                style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                className="h-full hover:opacity-90 transition-opacity relative group"
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-bg-card p-2 rounded shadow-lg border border-border-default whitespace-nowrap text-xs text-text-primary">
                  {item.name}: {item.value.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {sizeWithColors.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-text-secondary">{item.name} ({item.value.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Industry Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Industry Allocation {isLongShort && <span className="text-xs text-text-tertiary ml-2">(Long/Short)</span>}
        </h3>
        {isLongShort ? (
          // Left-aligned bar chart for long-short portfolios
          <div className="space-y-2">
            {industryWithColors.map((industry, index) =>
              renderIndustryBar(industry, index)
            )}
          </div>
        ) : (
          // Pie chart for long-only portfolios
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-48 md:w-48 flex-shrink-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 flex-1">
              {industryWithColors.map((industry, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
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
          </div>
        )}
      </Card>

      {/* Size Allocation */}
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Market Cap Allocation {isLongShort && <span className="text-xs text-text-tertiary ml-2">(Long/Short)</span>}
        </h3>
        {isLongShort ? (
          // Stacked bar for long-short portfolios
          renderStackedBar()
        ) : (
          // Standard progress bars for long-only portfolios
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
        )}
      </Card>
    </div>
  );
}
