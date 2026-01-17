import { LucideIcon } from "lucide-react";
import type {
  InvestmentStyle,
  MarketCap,
  PortfolioAllocation,
} from "@/api/generated/portfolio-apis/models";

/**
 * Investment type selection (before config is created)
 */
export type InvestmentType = "" | "stocks" | "mutualFunds";

/**
 * Fund category with percentage allocation and scheme count
 */
export interface FundCategory {
  id: string;
  name: string;
  percentage: number;
  schemesCount: number;
}

/**
 * Stock basket configuration
 * Uses generated API enum types for type safety
 */
export interface StockBasketConfig {
  type: "stocks";
  investmentStyle: InvestmentStyle | "";
  marketCap: (MarketCap | "custom")[];
  customMarketCapRange: [number, number];
  portfolioSize: string;
  customStockCount: string;
  portfolioAllocation: PortfolioAllocation | "";
  stockPreferences: string;
}

/**
 * Mutual fund basket configuration
 */
export interface MutualFundBasketConfig {
  type: "mutualFunds";
  planType: string; // "direct" | "regular"
  categoryPreference: string; // "largecap" | "midcap" | "smallcap" | "international" | "custom"
  fundCategories: FundCategory[];
  mfPreferences: string;
}

/**
 * Discriminated union for basket configurations
 */
export type BasketConfig = StockBasketConfig | MutualFundBasketConfig;

/**
 * Investment style option
 */
export interface InvestmentStyleOption {
  id: InvestmentStyle;
  name: string;
  description: string;
}

/**
 * Market capitalization option
 * Includes "custom" for UI-only custom range selection
 */
export interface MarketCapOption {
  id: MarketCap | "custom";
  name: string;
  description: string;
}

/**
 * Portfolio size option
 */
export interface PortfolioSizeOption {
  id: string;
  name: string;
  description: string;
  stockCount?: string;
}

/**
 * Portfolio allocation option
 */
export interface PortfolioAllocationOption {
  id: PortfolioAllocation;
  name: string;
  description: string;
}

/**
 * Fund category option
 */
export interface FundCategoryOption {
  id: string;
  name: string;
}

/**
 * Plan type option for mutual funds
 */
export interface PlanTypeOption {
  id: string;
  name: string;
  description: string;
}

/**
 * Category preference option with preset allocations
 */
export interface CategoryPreferenceOption {
  id: string;
  name: string;
  description: string;
  categories: FundCategory[];
}

/**
 * Stock holding in generated basket
 */
export interface Stock {
  symbol: string;
  name: string;
  weight: number;
  price: number;
  change: number;
  sector: string;
  marketCap: string;
}

/**
 * Mutual fund holding in generated basket
 */
export interface MutualFund {
  symbol: string;
  name: string;
  weight: number;
  nav: number;
  change: number;
  category: string;
  aum: string;
}

/**
 * Generated stock basket data
 */
export interface GeneratedStockBasket {
  type: "stocks";
  name: string;
  stocks: Stock[];
  expectedReturn: string;
  riskLevel: "Low" | "Medium" | "High";
  volatility: string;
  sharpeRatio: string;
}

/**
 * Generated mutual fund basket data
 */
export interface GeneratedMutualFundBasket {
  type: "mutualFunds";
  name: string;
  funds: MutualFund[];
  expectedReturn: string;
  riskLevel: "Low" | "Medium" | "High";
  volatility: string;
  sharpeRatio: string;
}

/**
 * Discriminated union for generated baskets
 */
export type GeneratedBasket = GeneratedStockBasket | GeneratedMutualFundBasket;

/**
 * Step definition for multi-step form
 */
export interface Step {
  number: number;
  title: string;
  description: string;
}

/**
 * Deprecated - kept for backward compatibility
 * @deprecated Use StockBasketConfig or MutualFundBasketConfig instead
 */
export interface Theme {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}
