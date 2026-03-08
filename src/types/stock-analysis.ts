// Re-export generated types as the source of truth
export type {
  StockAnalysis,
  StockAnalysisReportData,
  Section,
} from "@/api/generated/report-apis/models";

// These types are used by FormatNewsSentiment and PDF report for news source rendering.
// They are not part of the generated API types.
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
