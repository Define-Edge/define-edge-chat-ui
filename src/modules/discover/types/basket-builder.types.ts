import { LucideIcon } from "lucide-react";
import type {
  InvestmentStyle,
  MarketCap,
  PortfolioAllocation,
} from "@/api/generated/portfolio-apis/models";
import type { PlanType } from "@/api/generated/mf-portfolio-apis/models/planType";
import type { FundCategory } from "@/api/generated/mf-portfolio-apis/models/fundCategory";

/**
 * Investment type selection (before config is created)
 */
export type InvestmentType = "" | "stocks" | "mutualFunds";

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
  planType: PlanType | "";
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
  id: PlanType;
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
 * @deprecated Use MFPortfolioItem from @/types/mf-portfolio instead
 */
// MutualFund interface removed - use MFPortfolioItem from @/types/mf-portfolio

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
 * @deprecated Use CreateMFPortfolioResponse from @/api/generated/mf-portfolio-apis/models instead
 */
// GeneratedMutualFundBasket interface removed - use CreateMFPortfolioResponse from API

/**
 * Discriminated union for generated baskets
 * Note: For mutual funds, use CreateMFPortfolioResponse directly
 */
export type GeneratedBasket = GeneratedStockBasket;

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
