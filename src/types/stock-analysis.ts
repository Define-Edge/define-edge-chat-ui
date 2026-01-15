export type NewsSource = {
  dbId: number;
  title: string;
  type: string;
  description: string | null;
  guid: string;
  date: string;
  enclosure: number;
  link: string;
  sentimentScore: number;
  company?: {
    dbId: number;
    nse: string;
    [key: string]: any;
  };
};

export type NewsSourcesContent = {
  content: NewsSource[];
};

export type Section = {
  title: string;
  content: string;
  in_depth_analysis?: string;
  sources?: string[] | string | NewsSourcesContent | Record<string, any>;
};

export type StockAnalysisReportData = {
  technical_analysis: Section;
  fundamental_analysis: Section;
  peer_comparison: Section;
  corporate_actions: Section;
  news_sentiment: Section;
  red_flags: Section;
  summary: Section;
};

export type StockAnalysis = {
  id: string;
  ticker: string;
  company_name: string;
  data: StockAnalysisReportData;
  date: string;
};
