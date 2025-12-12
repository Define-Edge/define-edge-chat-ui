export type Section = {
  title: string;
  content: string;
  in_depth_analysis?: string;
  sources?: string[] | string;
};

export type StockAnalysisReportData = {
  business_overview: Section;
  management_strategy: Section;
  sector_outlook: Section;
  technical_analysis: Section;
  fundamental_analysis: Section;
  peer_comparison: Section;
  conference_call_analysis: Section;
  shareholding_pattern: Section;
  corporate_actions: Section;
  news_sentiment: Section;
  summary: Section;
  red_flags: Section;

  simulation_chart: Record<string, any>;
};

export type StockAnalysis = {
  id: string;
  ticker: string;
  company_name: string;
  data: StockAnalysisReportData;
  date: string;
};
