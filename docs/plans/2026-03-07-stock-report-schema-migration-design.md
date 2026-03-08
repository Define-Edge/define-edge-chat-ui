# Stock Report Schema Migration Design

> Date: 2026-03-07
> Status: Approved

## Summary

Migrate the stock analysis frontend from the old flat schema (14 top-level Section fields) to the new grouped schema (7 logical groups with embedded charts). Clean cutover — no backward compatibility.

## Decisions

- **Section layout**: Card-based with colored left borders (matching PF report pattern)
- **Chart components**: Generic reusable (FundamentalChart, PeerComparisonChart)
- **Compatibility**: Clean cutover, new schema only
- **Risk metrics**: Styled HTML table with proper formatting

## Files to Modify

1. `src/types/stock-analysis.ts` — Replace hardcoded types with re-exports from generated types
2. `src/components/thread/messages/client-components/stock-analysis.tsx` — Restructure for grouped schema + card layout
3. `src/components/thread/messages/client-components/stock-analysis-download-dialog.tsx` — Update section keys
4. `src/components/pdfs_templates/stock-report/stock-report.tsx` — Restructure for grouped schema

## New Components to Create

1. **FundamentalChart** — Generic bar/line chart for `FundamentalChartData` (revenue_profit_chart, margin_chart)
2. **PeerComparisonChart** — Grouped bar chart for `PeerChartData` (valuation_chart, profitability_chart)
3. **RiskMetricsTable** — Styled HTML table for technical_analysis.risk_metrics

## Section Rendering (7 groups)

| # | Group | Border Color | Contents |
|---|-------|-------------|----------|
| 1 | Company Overview | blue/indigo | business_overview, management_strategy?, sector_outlook |
| 2 | Technical Analysis | rose | analysis + returns_chart + drawdown_chart + monthly_returns + rolling_sortino + risk_metrics |
| 3 | Fundamental Analysis | amber | analysis + revenue_profit_chart (bar) + margin_chart (line) |
| 4 | Peer Comparison | cyan | analysis + valuation_chart + profitability_chart |
| 5 | Market Sentiment | emerald | news_sentiment + conference_call? + corporate_actions? + shareholding_pattern |
| 6 | FinSharpe Analysis | violet | analysis + radar + overall_gauge + risk_gauge (entire group nullable) |
| 7 | Outlook | slate | summary + red_flags + simulation_chart? |

## Reusable Components (from PF report)

- LineChart (returns_chart, rolling_sortino_chart)
- DrawdownChart (drawdown_chart)
- MonthlyReturnsHeatmapTables (monthly_returns)
- FinSharpeScoresRadarChart (finsharpe radar)
- OverallScorePie / RiskScorePie (gauge charts)
- SimulationChart (simulation_chart)

## Null Handling

Nullable fields render nothing when null:
- company_overview.management_strategy
- market_sentiment.conference_call
- market_sentiment.corporate_actions
- finsharpe_analysis (entire group)
- All chart fields (returns_chart, drawdown_chart, etc.)
- Charts with all-null data values skip rendering

## Download Dialog Section Keys (new)

```
company_overview, technical_analysis, fundamental_analysis,
peer_comparison, market_sentiment, finsharpe_analysis, outlook
```
