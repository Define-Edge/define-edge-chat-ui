type HoldingsSummaryCardProps = {
  /** Total number of holdings */
  totalHoldings: number;
  /** Asset type display name (e.g., "Equity", "Mutual Fund") */
  assetType: string;
};

/**
 * Summary card displaying holdings statistics
 * Pure presentational component with no business logic
 */
export function HoldingsSummaryCard({
  totalHoldings,
  assetType,
}: HoldingsSummaryCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-blue-600 font-medium">Total Holdings</p>
          <p className="text-2xl font-bold text-blue-900">{totalHoldings}</p>
        </div>
        <div>
          <p className="text-sm text-blue-600 font-medium">Asset Type</p>
          <p className="text-2xl font-bold text-blue-900">{assetType}</p>
        </div>
      </div>
    </div>
  );
}
