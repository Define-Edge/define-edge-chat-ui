import {
  Zap,
  Heart,
  Shield,
  Coins,
  TrendingUp,
} from "lucide-react";
import type {
  Theme,
  InvestmentStyleOption,
  MarketCapOption,
  PortfolioSizeOption,
  Stock,
} from "../types/basket-builder.types";

/**
 * Available investment themes
 */
export const themes: Theme[] = [
  {
    id: "technology",
    name: "Technology & Innovation",
    icon: Zap,
    color: "bg-accent-blue",
    description: "AI, Cloud, Semiconductors",
  },
  {
    id: "sustainable",
    name: "Sustainable & ESG",
    icon: Heart,
    color: "bg-accent-green",
    description: "Clean energy, ESG leaders",
  },
  {
    id: "healthcare",
    name: "Healthcare & Biotech",
    icon: Shield,
    color: "bg-accent-purple",
    description: "Pharma, medical devices",
  },
  {
    id: "financial",
    name: "Financial Services",
    icon: Coins,
    color: "bg-accent-orange",
    description: "Banks, fintech, insurance",
  },
  {
    id: "dividend",
    name: "Dividend & Income",
    icon: TrendingUp,
    color: "bg-accent-amber",
    description: "High dividend stocks",
  },
];

/**
 * Available investment styles
 */
export const investmentStyleOptions: InvestmentStyleOption[] = [
  {
    id: "growth",
    name: "Growth",
    description: "High growth potential companies",
  },
  {
    id: "value",
    name: "Value",
    description: "Undervalued quality stocks",
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Trending upward stocks",
  },
  {
    id: "quality",
    name: "Quality",
    description: "Strong fundamentals focus",
  },
];

/**
 * Available market cap options
 */
export const marketCapOptions: MarketCapOption[] = [
  {
    id: "Large",
    name: "Large Cap",
    description: "₹20,000Cr+ market cap",
  },
  {
    id: "Mid",
    name: "Mid Cap",
    description: "₹5,000-20,000Cr market cap",
  },
  {
    id: "Small",
    name: "Small Cap",
    description: "₹500-5,000Cr market cap",
  },
];

/**
 * Available portfolio size options
 */
export const portfolioSizeOptions: PortfolioSizeOption[] = [
  {
    id: "focused",
    name: "8-12 stocks",
    description: "Focused portfolio",
  },
  {
    id: "balanced",
    name: "15-20 stocks",
    description: "Balanced diversification",
  },
  {
    id: "diversified",
    name: "25-30 stocks",
    description: "High diversification",
  },
];

/**
 * Mock stocks for basket generation
 */
export const mockStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    weight: 12.5,
    price: 2456.5,
    change: 2.3,
    sector: "Energy",
    marketCap: "Large",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    weight: 11.8,
    price: 3890.75,
    change: 1.8,
    sector: "IT",
    marketCap: "Large",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    weight: 10.5,
    price: 1567.3,
    change: -0.5,
    sector: "IT",
    marketCap: "Large",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank Limited",
    weight: 9.7,
    price: 1678.9,
    change: 1.2,
    sector: "Banking",
    marketCap: "Large",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    weight: 8.9,
    price: 1234.6,
    change: 0.8,
    sector: "Banking",
    marketCap: "Large",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Limited",
    weight: 7.6,
    price: 987.4,
    change: -1.1,
    sector: "Telecom",
    marketCap: "Large",
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    weight: 6.8,
    price: 1876.25,
    change: 1.5,
    sector: "Banking",
    marketCap: "Large",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    weight: 6.2,
    price: 3456.8,
    change: 2.1,
    sector: "Infrastructure",
    marketCap: "Large",
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies",
    weight: 5.9,
    price: 1543.7,
    change: 0.3,
    sector: "IT",
    marketCap: "Large",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India",
    weight: 5.4,
    price: 10567.9,
    change: -0.8,
    sector: "Auto",
    marketCap: "Large",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Limited",
    weight: 4.8,
    price: 543.2,
    change: 1.7,
    sector: "IT",
    marketCap: "Large",
  },
  {
    symbol: "TECHM",
    name: "Tech Mahindra",
    weight: 4.2,
    price: 1687.5,
    change: -0.3,
    sector: "IT",
    marketCap: "Large",
  },
  {
    symbol: "TITAN",
    name: "Titan Company",
    weight: 3.8,
    price: 3234.4,
    change: 2.5,
    sector: "Consumer",
    marketCap: "Large",
  },
  {
    symbol: "NESTLEIND",
    name: "Nestle India",
    weight: 3.5,
    price: 2987.65,
    change: 0.9,
    sector: "FMCG",
    marketCap: "Large",
  },
  {
    symbol: "HDFCLIFE",
    name: "HDFC Life Insurance",
    weight: 3.2,
    price: 654.3,
    change: 1.4,
    sector: "Insurance",
    marketCap: "Large",
  },
];

/**
 * Step definitions for the multi-step form
 */
export const steps = [
  { number: 1, title: "Theme", description: "Choose investment theme" },
  { number: 2, title: "Style", description: "Investment approach" },
  { number: 3, title: "Market Cap", description: "Select company sizes" },
  { number: 4, title: "Portfolio Size", description: "Number of stocks" },
  { number: 5, title: "Considerations", description: "Specific requirements" },
];
