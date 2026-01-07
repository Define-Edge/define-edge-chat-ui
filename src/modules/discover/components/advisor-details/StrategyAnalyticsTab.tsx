import {
  ReturnsChartData,
  ScoreChartDataItem,
} from "@/api/generated/strategy-apis/models";
import LineChart from "@/components/thread/messages/client-components/LineChart";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";

interface StrategyAnalyticsTabProps {
  riskLevel: string;
  returnsChartData: ReturnsChartData;
  overallScoreChartData: ScoreChartDataItem[];
  riskScoreChartData: ScoreChartDataItem[];
}

/**
 * Strategy Analytics Tab Component
 * Displays benchmark comparison and risk analysis
 * Component size: ~130 lines
 */
export function StrategyAnalyticsTab({
  riskLevel,
  returnsChartData,
  overallScoreChartData,
  riskScoreChartData,
}: StrategyAnalyticsTabProps) {
  return (
    <div className="space-y-6 pb-28">
      {/* Returns Chart */}
      <LineChart
        data={returnsChartData.data}
        colors={returnsChartData.colors}
        title={returnsChartData.title}
        description={returnsChartData.description}
        className="min-w-0"
      />

      {/* Score Charts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Overall Score Chart */}
        <div className="bg-bg-card border-border-subtle rounded-lg border p-6 shadow-sm">
          <h3 className="text-text-primary mb-4 text-lg font-semibold">
            Overall Score
          </h3>
          <OverallScorePie
            data={overallScoreChartData}
            shouldRenderActiveShapeLabel={true}
          />
        </div>

        {/* Risk Score Chart */}
        <div className="bg-bg-card border-border-subtle rounded-lg border p-6 shadow-sm">
          <h3 className="text-text-primary mb-4 text-lg font-semibold">
            Risk Score
          </h3>
          <RiskScorePie
            data={riskScoreChartData}
            shouldRenderActiveShapeLabel={true}
          />
        </div>
      </div>
    </div>
  );
}
