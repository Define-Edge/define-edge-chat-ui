import { NewsSourcesContent } from "./stock-analysis";

export type Section = {
  title: string;
  content: string;
  in_depth_analysis?: string;
  sources?: string[] | string | NewsSourcesContent | Record<string, any>;
};

export type MfAnalysisReportData = {
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
};

export type MfAnalysis = {
  id: string;
  scheme_code: number;
  scheme_name: string;
  data: MfAnalysisReportData;
  date: string;
};
