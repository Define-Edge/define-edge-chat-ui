/**
 * Portfolio item type based on the MF Portfolio API response
 * This is a typed version of CreateMFPortfolioResponsePortfolioItem
 */
export interface MFPortfolioItem {
  ISIN: string;
  id: string;
  Created_Date: string;
  OverallRank: number;
  PerformanceScore: number;
  RiskAdjReturn: number;
  RiskScore: number;
  Scheme_Name: string;
  Sebi_Category: string;
  Investment_Type: string;
  weight: number;
  // Performance returns
  oneM_per: number;
  threeM_per: number;
  sixM_per: number;
  Y_per: number;
  // Category benchmarks
  Category_1M_per: number;
  Category_3M_per: number;
  Category_6M_per: number;
  Category_1Y_per: number;
  // CAGR values
  threeY_CAGR_per: number;
  fiveY_CAGR_per: number;
  sevenY_CAGR_per: number;
  tenY_CAGR_per: number;
  // Category CAGR benchmarks
  Category_3Y_CAGR_per: number;
  Category_5Y_CAGR_per: number;
  Category_7Y_CAGR_per: number;
  Category_10Y_CAGR_per: number;
  // Rolling averages
  M_Rolling_Avg_per: number;
  three_M_Rolling_Avg_per: number;
  six_M_Rolling_Avg_per: number;
  Y_Rolling_Avg_per: number;
  two_Y_Rolling_Avg_per: number;
  three_Y_Rolling_Avg_per?: number;
}
