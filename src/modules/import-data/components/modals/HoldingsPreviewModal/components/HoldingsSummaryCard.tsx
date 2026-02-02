type HoldingsSummaryCardProps = {
  /** Total number of holdings */
  totalHoldings: number;
  /** Asset type display name (e.g., "Equity", "Mutual Fund") */
  assetType: string;
  /** Optional current value to display */
  currentValue?: string | null;
};

/**
 * Format number as Indian currency (INR)
 */
function formatIndianCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Summary card displaying holdings statistics
 * Pure presentational component with no business logic
 */
export function HoldingsSummaryCard({
  totalHoldings,
  assetType,
  currentValue,
}: HoldingsSummaryCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <div className={`grid gap-3 sm:gap-4 ${currentValue ? "grid-cols-3" : "grid-cols-2"}`}>
        <div>
          <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Holdings</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-900">{totalHoldings}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-blue-600 font-medium">Asset Type</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-900">{assetType}</p>
        </div>
        {currentValue && (
          <div>
            <p className="text-xs sm:text-sm text-blue-600 font-medium">Current Value</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-900">{formatIndianCurrency(currentValue)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
