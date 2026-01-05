import { RiskLevel } from "../../types/discover.types";

interface StrategyAnalyticsTabProps {
  riskLevel: RiskLevel;
}

/**
 * Strategy Analytics Tab Component
 * Displays benchmark comparison and risk analysis
 * Component size: ~130 lines
 */
export function StrategyAnalyticsTab({
  riskLevel,
}: StrategyAnalyticsTabProps) {
  return (
    <div className="space-y-6 pb-28">
      <p className="text-sm text-gray-500 text-center py-8">
        Analytics content will be displayed here.
      </p>
    </div>
  );
}
