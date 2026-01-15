import { LucideIcon } from "lucide-react";

/**
 * Configuration for a custom investment basket
 */
export interface BasketConfig {
  theme: string;
  investmentStyle: string;
  marketCap: string[];
  numberOfStocks: string;
  specificConsiderations: string;
}

/**
 * Investment theme option
 */
export interface Theme {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

/**
 * Investment style option
 */
export interface InvestmentStyleOption {
  id: string;
  name: string;
  description: string;
}


/**
 * Market capitalization option
 */
export interface MarketCapOption {
  id: string;
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
 * Generated basket data
 */
export interface GeneratedBasket {
  name: string;
  stocks: Stock[];
  expectedReturn: string;
  riskLevel: "Low" | "Medium" | "High";
  volatility: string;
  sharpeRatio: string;
}

/**
 * Step definition for multi-step form
 */
export interface Step {
  number: number;
  title: string;
  description: string;
}
