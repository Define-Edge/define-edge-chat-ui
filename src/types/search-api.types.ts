/**
 * API types for stock and mutual fund search endpoints
 */

// Stock Search Types
export type StockSearchRequest = {
  /** Stock symbol or company name to search for */
  query: string;
  /** Maximum number of results to return (1-20, default 6) */
  limit?: number;
};

export type StockSearchResult = {
  /** Stock symbol */
  symbol: string;
  /** Company name */
  name: string;
  /** Relevancy score (0.0 to 1.0) */
  relevancy: number;
};

export type StockSearchResponse = {
  /** List of matching stocks sorted by relevancy */
  results: StockSearchResult[];
  /** Total number of results returned */
  total_count: number;
};

// Mutual Fund Search Types
export type MutualFundSearchRequest = {
  /** Scheme name to search for */
  query: string;
  /** Maximum number of results to return (1-20, default 6) */
  limit?: number;
};

export type MutualFundSearchResult = {
  /** Official legal name of the fund */
  legalNames: string;
  /** Relevancy score (0.0 to 1.0) */
  relevancy: number;
  /** Unique identifier for the scheme */
  schemeCode: string;
  /** Display name of the scheme */
  sName: string;
  /** BSE code for the scheme (if available) */
  bseCode?: string | null;
};

export type MutualFundSearchResponse = {
  /** List of matching mutual fund schemes sorted by relevancy */
  results: MutualFundSearchResult[];
  /** Total number of results returned */
  total_count: number;
};
