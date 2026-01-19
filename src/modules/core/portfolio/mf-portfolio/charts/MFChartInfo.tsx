/**
 * MF-specific chart info content for info popovers
 */
export const MFChartsInfo = {
  PerformanceScore: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        The Performance Score measures how well the mutual fund schemes in your
        portfolio have performed relative to their category peers.
      </p>
      <p>
        It considers factors such as returns consistency, alpha generation, and
        risk-adjusted returns across various time periods.
      </p>
      <p>
        A higher score indicates better overall performance. Aim for a medium to
        high score for optimal results.
      </p>
    </div>
  ),
  RiskScore: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        The Risk Score evaluates the volatility and downside risk of the mutual
        fund schemes in your portfolio.
      </p>
      <p>
        It considers factors like standard deviation, maximum drawdown, and
        downside deviation compared to category averages.
      </p>
      <p>
        A lower score indicates lower risk. Ideally, your portfolio risk score
        should be low or medium based on your risk tolerance.
      </p>
    </div>
  ),
  CostAnalysis: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        The Cost Analysis shows the weighted average expense ratio of your
        mutual fund portfolio.
      </p>
      <p>
        Expense ratio is the annual fee charged by mutual funds to manage your
        investments. Lower expense ratios mean more of your returns stay with
        you.
      </p>
      <p>
        The estimated annual cost shows how much you would pay in fees on a Rs
        1,00,000 investment.
      </p>
    </div>
  ),
};
