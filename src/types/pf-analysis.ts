export type {
  PFAnalysis as PfAnalysis,
  PFAnalysisReportData as PfAnalysisReportData,
  PFFinSharpeAnalysisData,
  Section,
} from "@/api/generated/report-apis/models";

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
