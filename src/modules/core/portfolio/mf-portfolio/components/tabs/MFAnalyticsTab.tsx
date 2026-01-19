import {
  ReturnsChartData,
  ScoreChartDataItem,
  MFCostAnalysis,
} from "@/api/generated/mf-portfolio-apis/models";
import LineChart from "@/components/thread/messages/client-components/LineChart";
import PerformanceScorePie from "../../charts/PerformanceScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import { CostAnalysisCard } from "../CostAnalysisCard";

interface MFAnalyticsTabProps {
  returnsChartData: ReturnsChartData;
  performanceScoreChartData: ScoreChartDataItem[];
  riskScoreChartData: ScoreChartDataItem[];
  costAnalysis: MFCostAnalysis;
}

/**
 * MF Portfolio Analytics Tab Component
 * Displays returns chart, performance/risk score pies, and cost analysis
 */
export function MFAnalyticsTab({
  returnsChartData,
  performanceScoreChartData,
  riskScoreChartData,
  costAnalysis,
}: MFAnalyticsTabProps) {
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
        {/* Performance Score Chart */}
        <div className="bg-bg-card border-border-subtle rounded-lg border p-6 shadow-sm">
          <h3 className="text-text-primary mb-4 text-lg font-semibold">
            Performance Score
          </h3>
          <PerformanceScorePie
            data={performanceScoreChartData}
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

      {/* Cost Analysis */}
      <CostAnalysisCard costAnalysis={costAnalysis} />
    </div>
  );
}
