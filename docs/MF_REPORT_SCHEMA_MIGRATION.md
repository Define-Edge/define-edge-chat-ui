# MF Report Schema Migration Guide

> **For**: Frontend team
> **Date**: March 2026
> **Breaking Change**: Yes — the `mf_analysis` UI component payload has a new structure.

## Summary

The mutual fund analysis report schema has been redesigned from a **flat structure** (13 top-level `Section` fields) to a **grouped structure** with 7 logical groups, each containing text analysis + optional chart data.

The component name (`mf_analysis`) and top-level fields (`id`, `scheme_code`, `scheme_name`, `date`) remain the same.

---

## What Changed

### Old Schema (flat)

```typescript
interface MfAnalysisReportData {
  // All flat Section fields
  scheme_overview: Section;
  performance_analysis: Section;
  risk_metrics: Section;
  asset_allocation: Section;
  portfolio_holdings: Section;
  sector_distribution: Section;
  fund_manager_profile: Section;
  cost_analysis: Section;
  peer_comparison: Section;
  valuation_metrics: Section;
  conclusion: Section;
  summary: Section;
  finsharpe_scores: Section;
}
```

### New Schema (grouped)

```typescript
interface MfAnalysisReportData {
  fund_overview: FundOverviewGroup;
  performance: PerformanceGroup;
  ratios: RatiosGroup;
  portfolio: PortfolioGroup;
  peer_comparison: MFPeerComparisonGroup;
  finsharpe_analysis: MFFinSharpeAnalysisData | null;
  outlook: MFOutlookGroup;
}
```

---

## New Type Definitions

### Shared types (already exist from Portfolio Report)

```typescript
// schemas/report/common.py
interface Section {
  title: string;
  content: string;
  in_depth_analysis?: string | null;
  sources?: Record<string, any> | any[] | string | null;
}

// schemas/report/pf_report.py — reused from portfolio report
interface ScoreSection {
  title: string;
  summary: string; // LLM-generated summary
  chart_type: "radar" | "gauge";
  scores_comparison: FinSharpeScoreItem[]; // only for radar
  chart_data: ScoreChartDataItem[]; // only for gauge
}

interface MonthlyReturnsSection {
  heatmap: Record<string, any> | null;
  summary: string;
}

// schemas/api/portfolio_analytics.py — reused
interface FinSharpeScoreItem {
  metric: string;
  portfolio: number;
  industry: number;
}

interface ScoreChartDataItem {
  label: string;
  value: number;
}
```

### Reused chart data types (from Stock Report)

```typescript
// schemas/report/stock_report.py
interface PeerChartData {
  data: Record<string, any>[]; // e.g. [{period: "1Y", Fund: 12.5, Category: 10.2, ...}]
  metrics: string[]; // metric keys shown in chart
  colors: Record<string, string>; // metric name → hex color
  highlighted_company: string; // fund name to highlight
  title: string;
  description: string;
}
```

### Grouped section types

```typescript
interface FundOverviewGroup {
  scheme_overview: Section;
  fund_manager: Section | null; // null when no fund manager data available
}

interface PerformanceGroup {
  analysis: Section; // text analysis (performance summary)
  returns_chart: Record<string, any> | null; // cumulative returns (fund vs benchmark)
  trailing_returns_chart: PeerChartData | null; // grouped bar: 1M/3M/1Y/3Y/5Y
  drawdown_chart: Record<string, any> | null; // underwater plot + worst periods
  monthly_returns: MonthlyReturnsSection | null; // heatmap + summary
  rolling_sortino_chart: Record<string, any> | null; // rolling 1Y Sortino ratio
}

interface RatiosGroup {
  risk_metrics: Section; // Sharpe, Sortino, Beta, StdDev, Alpha, etc.
  cost_analysis: Section; // Expense ratio, loads, turnover
  valuation_metrics: Section | null; // P/E, P/B (null for debt/liquid funds)
}

interface PortfolioGroup {
  asset_allocation: Section; // Asset class breakdown
  top_holdings: Section; // Top companies held
  top_holdings_chart: PeerChartData | null; // Bar chart: top 10 holdings by weight
  sector_distribution: Section; // Sector breakdown
  sector_chart: { name: string; value: number }[] | null; // Pie chart data
  mcap_chart: { name: string; value: number }[] | null; // Pie chart data
}

interface MFPeerComparisonGroup {
  analysis: Section; // Comparison text
  returns_chart: PeerChartData | null; // Grouped bars: 1Y/3Y/5Y across peers
  risk_adjusted_chart: PeerChartData | null; // Grouped bars: Sharpe/Sortino/Alpha
}

interface MFFinSharpeAnalysisData {
  analysis: Section; // text analysis
  sections: ScoreSection[]; // [performance_gauge, risk_gauge]
}

interface MFOutlookGroup {
  summary: Section;
  conclusion: Section;
}
```

### Top-level (unchanged shape)

```typescript
interface MfAnalysis {
  id: string;
  scheme_code: number;
  scheme_name: string;
  data: MfAnalysisReportData;
  date: string;
}
```

---

## Field Mapping: Old → New

| Old field path              | New field path                                                 |
| --------------------------- | -------------------------------------------------------------- |
| `data.scheme_overview`      | `data.fund_overview.scheme_overview`                           |
| `data.fund_manager_profile` | `data.fund_overview.fund_manager` (**now nullable**)           |
| `data.performance_analysis` | `data.performance.analysis`                                    |
| _(new)_                     | `data.performance.returns_chart`                               |
| _(new)_                     | `data.performance.trailing_returns_chart`                      |
| _(new)_                     | `data.performance.drawdown_chart`                              |
| _(new)_                     | `data.performance.monthly_returns`                             |
| _(new)_                     | `data.performance.rolling_sortino_chart`                       |
| `data.risk_metrics`         | `data.ratios.risk_metrics`                                     |
| `data.cost_analysis`        | `data.ratios.cost_analysis`                                    |
| `data.valuation_metrics`    | `data.ratios.valuation_metrics` (**now nullable**)             |
| `data.asset_allocation`     | `data.portfolio.asset_allocation`                              |
| `data.portfolio_holdings`   | `data.portfolio.top_holdings` (**renamed**)                    |
| _(new)_                     | `data.portfolio.top_holdings_chart`                            |
| `data.sector_distribution`  | `data.portfolio.sector_distribution`                           |
| _(new)_                     | `data.portfolio.sector_chart`                                  |
| _(new)_                     | `data.portfolio.mcap_chart`                                    |
| `data.peer_comparison`      | `data.peer_comparison.analysis`                                |
| _(new)_                     | `data.peer_comparison.returns_chart`                           |
| _(new)_                     | `data.peer_comparison.risk_adjusted_chart`                     |
| `data.finsharpe_scores`     | `data.finsharpe_analysis.analysis` (**now has gauges**)        |
| _(new)_                     | `data.finsharpe_analysis.sections` (performance + risk gauges) |
| `data.summary`              | `data.outlook.summary`                                         |
| `data.conclusion`           | `data.outlook.conclusion`                                      |

---

## Chart Data Formats

### returns_chart / rolling_sortino_chart

Same format as portfolio report's `returns_chart`:

```json
{
  "data": [
    {
      "date": 1672531200000,
      "HDFC Mid-Cap Opportunities": 0.05,
      "NIFTY500": 0.03
    },
    {
      "date": 1672617600000,
      "HDFC Mid-Cap Opportunities": 0.06,
      "NIFTY500": 0.04
    }
  ],
  "colors": { "HDFC Mid-Cap Opportunities": "#035BFF", "NIFTY500": "#46D7A7" },
  "title": "Cumulative Returns - HDFC Mid-Cap Opportunities vs NIFTY500",
  "description": "This chart shows..."
}
```

### trailing_returns_chart (PeerChartData)

```json
{
  "data": [
    { "period": "1M", "Fund": 2.5, "Category": 2.1, "Benchmark": 1.8 },
    { "period": "3M", "Fund": 7.2, "Category": 6.5, "Benchmark": 5.9 },
    { "period": "1Y", "Fund": 18.3, "Category": 15.1, "Benchmark": 14.2 },
    { "period": "3Y", "Fund": 22.5, "Category": 18.7, "Benchmark": 16.4 },
    { "period": "5Y", "Fund": 19.8, "Category": 16.2, "Benchmark": 14.9 }
  ],
  "metrics": ["Fund", "Category", "Benchmark"],
  "colors": {
    "Fund": "#035BFF",
    "Category": "#46D7A7",
    "Benchmark": "#FFA500"
  },
  "highlighted_company": "HDFC Mid-Cap Opportunities",
  "title": "Trailing Returns Comparison",
  "description": "Fund vs category average and benchmark trailing returns."
}
```

### drawdown_chart

Same format as portfolio report's drawdown chart:

```json
{
  "underwater_plot": [
    {
      "date": 1672531200000,
      "HDFC Mid-Cap Opportunities": -0.05,
      "NIFTY500": -0.02
    }
  ],
  "worst_periods": [
    {
      "start_date": 1672531200000,
      "end_date": 1675209600000,
      "drawdown_pct": -15.3
    }
  ],
  "colors": { "HDFC Mid-Cap Opportunities": "#035BFF", "NIFTY500": "#46D7A7" },
  "title": "Drawdown Analysis",
  "description": "Drawdown analysis..."
}
```

### monthly_returns (heatmap)

Same format as portfolio report's `monthly_returns`:

```json
{
  "heatmap": {
    "months": ["Jan", "Feb", "Mar", "..."],
    "portfolio": [{ "year": 2024, "Jan": 2.5, "Feb": -1.3, "...": "..." }],
    "benchmark": [{ "year": 2024, "Jan": 1.8, "Feb": -0.9, "...": "..." }],
    "active": [{ "year": 2024, "Jan": 0.7, "Feb": -0.4, "...": "..." }]
  },
  "summary": "The fund consistently outperformed..."
}
```

### top_holdings_chart (PeerChartData)

```json
{
  "data": [
    { "company": "HDFC Bank", "weight": 8.5 },
    { "company": "ICICI Bank", "weight": 6.2 },
    { "company": "Infosys", "weight": 5.1 }
  ],
  "metrics": ["weight"],
  "colors": { "weight": "#035BFF" },
  "highlighted_company": "HDFC Mid-Cap Opportunities",
  "title": "Top 10 Holdings",
  "description": "Top 10 holdings by portfolio weight."
}
```

### sector_chart / mcap_chart (Pie chart data)

```json
[
  { "name": "Financial Services", "value": 32.5 },
  { "name": "Technology", "value": 18.2 },
  { "name": "Healthcare", "value": 12.8 },
  { "name": "Consumer Goods", "value": 10.1 }
]
```

### peer_comparison.returns_chart (PeerChartData)

```json
{
  "data": [
    {
      "fund": "HDFC Mid-Cap Opportunities",
      "1Y": 18.3,
      "3Y": 22.5,
      "5Y": 19.8
    },
    { "fund": "SBI Magnum Mid-Cap", "1Y": 15.1, "3Y": 18.7, "5Y": 16.2 },
    { "fund": "Kotak Emerging Equity", "1Y": 16.5, "3Y": 20.1, "5Y": 17.5 }
  ],
  "metrics": ["1Y", "3Y", "5Y"],
  "colors": { "1Y": "#035BFF", "3Y": "#46D7A7", "5Y": "#FFA500" },
  "highlighted_company": "HDFC Mid-Cap Opportunities",
  "title": "Peer Returns Comparison",
  "description": "1Y, 3Y, and 5Y returns across top peers in the category."
}
```

### peer_comparison.risk_adjusted_chart (PeerChartData)

```json
{
  "data": [
    {
      "fund": "HDFC Mid-Cap Opportunities",
      "Sharpe": 1.23,
      "Sortino": 1.85,
      "Alpha": 4.2
    },
    {
      "fund": "SBI Magnum Mid-Cap",
      "Sharpe": 0.95,
      "Sortino": 1.42,
      "Alpha": 2.1
    }
  ],
  "metrics": ["Sharpe", "Sortino", "Alpha"],
  "colors": { "Sharpe": "#035BFF", "Sortino": "#46D7A7", "Alpha": "#FFA500" },
  "highlighted_company": "HDFC Mid-Cap Opportunities",
  "title": "Risk-Adjusted Metrics Comparison",
  "description": "Sharpe ratio, Sortino ratio, and Alpha across peers."
}
```

### finsharpe_analysis.sections

Array of 2 `ScoreSection` items — same format as portfolio report:

```json
[
  {
    "title": "Performance Score",
    "summary": "HDFC Mid-Cap Opportunities has a Performance Score of 78.5, indicating...",
    "chart_type": "gauge",
    "scores_comparison": [],
    "chart_data": [
      { "label": "Performance Score", "value": 78.5 },
      { "label": "Total", "value": 21.5 }
    ]
  },
  {
    "title": "Risk Score",
    "summary": "The fund's Risk Score of 42.3 indicates moderate risk...",
    "chart_type": "gauge",
    "scores_comparison": [],
    "chart_data": [
      { "label": "Risk Score", "value": 42.3 },
      { "label": "Total", "value": 57.7 }
    ]
  }
]
```

---

## Frontend Changes Required

### 1. Update TypeScript types

Generate types from the new dummy endpoint at `GET /api/reports/mf-analysis` or manually update the `MfAnalysis` type to match the grouped structure above.

### 2. Remove hardcoded types — use generated types instead

Delete the following hardcoded types from `src/types/mf-analysis.ts`:

- `Section` (imported from `stock-analysis.ts`)
- `MfAnalysisReportData`
- `MfAnalysis`

Also remove the `NewsSourcesContent` import from `stock-analysis.ts` — the new `Section` type uses a simpler `sources` union type.

Replace them with the auto-generated types from the `/api/reports/mf-analysis` endpoint. The generated types will match the new grouped schema exactly.

### 3. Update the MF analysis component

The component receiving the `mf_analysis` UI message needs to navigate the new grouped paths:

```diff
- {data.scheme_overview.content}
+ {data.fund_overview.scheme_overview.content}

- {data.fund_manager_profile.content}
+ {data.fund_overview.fund_manager?.content}

- {data.performance_analysis.content}
+ {data.performance.analysis.content}

- {data.risk_metrics.content}
+ {data.ratios.risk_metrics.content}

- {data.cost_analysis.content}
+ {data.ratios.cost_analysis.content}

- {data.valuation_metrics.content}
+ {data.ratios.valuation_metrics?.content}

- {data.asset_allocation.content}
+ {data.portfolio.asset_allocation.content}

- {data.portfolio_holdings.content}
+ {data.portfolio.top_holdings.content}

- {data.sector_distribution.content}
+ {data.portfolio.sector_distribution.content}

- {data.peer_comparison.content}
+ {data.peer_comparison.analysis.content}

- {data.finsharpe_scores.content}
+ {data.finsharpe_analysis?.analysis.content}

- {data.summary.content}
+ {data.outlook.summary.content}

- {data.conclusion.content}
+ {data.outlook.conclusion.content}
```

### 4. Add new chart components

The following chart sections are **new** and need frontend components:

| Chart                   | Group                                 | Type           | Reusable from PF report?           |
| ----------------------- | ------------------------------------- | -------------- | ---------------------------------- |
| Returns chart           | `performance.returns_chart`           | Line chart     | Yes — same as PF `returns_chart`   |
| Trailing returns        | `performance.trailing_returns_chart`  | Grouped bar    | New (`PeerChartData`)              |
| Drawdown chart          | `performance.drawdown_chart`          | Line + periods | Yes — same as PF `drawdown`        |
| Monthly returns heatmap | `performance.monthly_returns`         | Heatmap        | Yes — same as PF `monthly_returns` |
| Rolling Sortino         | `performance.rolling_sortino_chart`   | Line chart     | Yes — same format as returns chart |
| Top holdings bar        | `portfolio.top_holdings_chart`        | Bar chart      | New (`PeerChartData`)              |
| Sector pie chart        | `portfolio.sector_chart`              | Pie chart      | New (`{name, value}[]`)            |
| Market cap pie chart    | `portfolio.mcap_chart`                | Pie chart      | New (`{name, value}[]`)            |
| Peer returns            | `peer_comparison.returns_chart`       | Grouped bar    | Reuse from Stock `PeerChartData`   |
| Peer risk-adjusted      | `peer_comparison.risk_adjusted_chart` | Grouped bar    | Reuse from Stock `PeerChartData`   |
| Performance gauge       | `finsharpe_analysis.sections[0]`      | Gauge chart    | Yes — same as PF `ScoreSection`    |
| Risk gauge              | `finsharpe_analysis.sections[1]`      | Gauge chart    | Yes — same as PF `ScoreSection`    |

### 5. Handle nullable fields

These fields are now nullable (render nothing or a fallback when `null`):

- `data.fund_overview.fund_manager` — null when no fund manager data found
- `data.ratios.valuation_metrics` — null for debt/liquid funds with no P/E, P/B data
- `data.finsharpe_analysis` — null when scheme not found in screener
- All chart fields (`returns_chart`, `trailing_returns_chart`, `drawdown_chart`, `monthly_returns`, `rolling_sortino_chart`, `top_holdings_chart`, `sector_chart`, `mcap_chart`, `returns_chart`, `risk_adjusted_chart`) — null when data unavailable

### 6. Suggested section rendering order

```
1. Fund Overview
   └─ Scheme Overview → Fund Manager (if present)

2. Performance
   └─ Text Analysis → Returns Chart → Trailing Returns Chart
      → Drawdown Chart → Monthly Returns Heatmap → Rolling Sortino

3. Ratios
   └─ Risk Metrics → Cost Analysis → Valuation Metrics (if present)

4. Portfolio
   └─ Asset Allocation → Top Holdings + Bar Chart
      → Sector Distribution + Pie Chart → Market Cap Pie Chart

5. Peer Comparison
   └─ Text Analysis → Returns Chart → Risk-Adjusted Chart

6. FinSharpe Analysis (if present)
   └─ Text Analysis → Performance Gauge → Risk Gauge

7. Outlook
   └─ Summary → Conclusion
```
