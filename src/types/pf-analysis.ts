import { Section } from "./stock-analysis";

export type { Section };

export type ChartData = {
  data: Array<Record<string, number>>;
  colors: Record<string, string>;
  title: string;
  description: string;
};

// Keep for backward compatibility
export type ReturnsChart = ChartData;

export type DrawdownChartData = {
  underwater_plot: Array<Record<string, number>>;
  worst_periods: Array<{
    start_date: number;
    end_date: number;
    drawdown_pct: number;
    duration: string;
  }>;
  colors: Record<string, string>;
  title: string;
  description?: string;
};

export type PFFinSharpeAnalysisData = {
  analysis: Section;
  overall_score_chart_data: Array<Record<string, number>>;
  risk_score_chart_data: Array<Record<string, number>>;
  size_distribution: Array<Record<string, any>>;
  industry_distribution: Array<Record<string, any>>;
};

export type PfAnalysisReportData = {
  portfolio_overview: Section;
  performance_analysis: Section;
  risk_assessment: Section;
  risk_adjusted_returns: Section;
  drawdown_analysis: Section;
  correlation_analysis: Section;
  finsharpe_analysis: PFFinSharpeAnalysisData | null;
  returns_chart: ChartData | null;
  drawdown_chart: DrawdownChartData | null;
  summary: Section;
  recommendation: Section;
};

export type PfAnalysis = {
  id: string;
  portfolio_name: string;
  portfolio_type: "stock" | "mutual_fund";
  holdings_count: number;
  portfolio?: Record<string, any>[];
  data: PfAnalysisReportData;
  date: string;
};
