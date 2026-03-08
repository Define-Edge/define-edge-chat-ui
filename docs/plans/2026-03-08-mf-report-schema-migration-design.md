# MF Report Schema Migration Design

> **Date**: 2026-03-08
> **Scope**: Migrate MF analysis UI from flat schema to grouped schema

## Summary

Migrate the mutual fund analysis component from 13 flat `Section` fields to 7 grouped sections with embedded chart data. Follow the stock analysis component pattern (SectionCard with accent borders, FormatSection + SectionFormatter, inline chart rendering).

## Files to Change

### 1. `src/types/mf-analysis.ts`

Replace hardcoded types with re-exports from generated API types:

```typescript
export type {
  MFAnalysis as MfAnalysis,
  MFAnalysisReportData as MfAnalysisReportData,
  MFFinSharpeAnalysisData,
  Section,
} from "@/api/generated/report-apis/models";
```

Remove `NewsSourcesContent` import and manual type definitions.

### 2. `src/components/thread/messages/client-components/mf-analysis.tsx`

Full redesign following stock-analysis SectionCard pattern. 7 sections:

| #   | Section            | Accent  | Content                                                                                                                                                                              |
| --- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Fund Overview      | indigo  | scheme_overview + optional fund_manager                                                                                                                                              |
| 2   | Performance        | rose    | analysis + returns_chart (LineChart) + trailing_returns_chart (PeerComparisonChart) + drawdown_chart (DrawdownChart) + monthly_returns (Heatmap) + rolling_sortino_chart (LineChart) |
| 3   | Ratios             | amber   | risk_metrics + cost_analysis + optional valuation_metrics                                                                                                                            |
| 4   | Portfolio          | cyan    | asset_allocation + top_holdings + top_holdings_chart (PeerComparisonChart) + sector_distribution + sector_chart (pie) + mcap_chart (pie)                                             |
| 5   | Peer Comparison    | emerald | analysis + returns_chart (PeerComparisonChart) + risk_adjusted_chart (PeerComparisonChart)                                                                                           |
| 6   | FinSharpe Analysis | violet  | analysis + gauge charts (OverallScorePie/RiskScorePie)                                                                                                                               |
| 7   | Outlook            | slate   | summary + conclusion                                                                                                                                                                 |

Chart components reused from stock/portfolio reports:

- `LineChart` for returns_chart, rolling_sortino_chart
- `DrawdownChart` for drawdown_chart
- `PeerComparisonChart` for trailing_returns, top_holdings, peer comparisons
- `MonthlyReturnsHeatmapTables` for monthly_returns
- `OverallScorePie` / `RiskScorePie` for FinSharpe gauges

New: `SimplePieChart` component for sector_chart and mcap_chart (`{name, value}[]` data).

### 3. `src/components/thread/messages/client-components/mf-analysis-download-dialog.tsx`

Update `MF_SECTIONS` to 7 grouped keys:

```typescript
const MF_SECTIONS = [
  { key: "fund_overview", label: "Fund Overview" },
  { key: "performance", label: "Performance" },
  { key: "ratios", label: "Ratios" },
  { key: "portfolio", label: "Portfolio" },
  { key: "peer_comparison", label: "Peer Comparison" },
  { key: "finsharpe_analysis", label: "FinSharpe Analysis" },
  { key: "outlook", label: "Outlook" },
];
```

### 4. `src/components/pdfs_templates/mf-report/mf-report.tsx`

Update to navigate new grouped paths. Same section filtering by new keys. Add chart rendering with `disableAnimation={true}`.

### 5. `src/components/thread/messages/client-components/registry.ts`

No change needed (already registers `mf_analysis`).

## Nullable Field Handling

All nullable/optional fields use conditional rendering (`{field && <Component />}`):

- `fund_manager` -- render nothing if absent
- `valuation_metrics` -- render nothing if absent
- `finsharpe_analysis` -- entire SectionCard hidden if null
- All chart fields -- render nothing if absent

## Pie Chart Component

For `sector_chart` and `mcap_chart` (`{name: string, value: number}[]`), create a `SimplePieChart` using Recharts PieChart + Pie + Cell with PIE_COLORS from `src/configs/chart-colors`.

## PDF Data Sources Section

The PDF appendix iterates over all Section objects extracted from grouped structure for in-depth analysis and sources display.
