import type {
  InvestmentStyleOption,
  MarketCapOption,
  PortfolioSizeOption,
  PortfolioAllocationOption,
  Stock,
} from "../types/basket-builder.types";
import {
  InvestmentStyle,
  MarketCap,
  PortfolioAllocation,
} from "@/api/generated/portfolio-apis/models";

/**
 * Available investment styles for stock baskets
 * Uses generated enum values from portfolio API
 */
export const investmentStyleOptions: InvestmentStyleOption[] = [
  {
    id: InvestmentStyle.growth,
    name: "Growth",
    description: "High growth potential companies",
  },
  {
    id: InvestmentStyle.value,
    name: "Value",
    description: "Undervalued quality stocks",
  },
  {
    id: InvestmentStyle.momentum,
    name: "Momentum",
    description: "Trending upward stocks",
  },
  {
    id: InvestmentStyle.quality,
    name: "Quality",
    description: "Strong fundamentals focus",
  },
];

/**
 * Available market cap options for stock baskets
 * Uses generated enum values from portfolio API (Large, Mid, Small)
 * "custom" is UI-only for custom range selection
 */
export const marketCapOptions: MarketCapOption[] = [
  {
    id: MarketCap.Large,
    name: "Large Cap",
    description: "₹20,000Cr+ market cap",
  },
  {
    id: MarketCap.Mid,
    name: "Mid Cap",
    description: "₹5,000-20,000Cr market cap",
  },
  {
    id: MarketCap.Small,
    name: "Small Cap",
    description: "₹500-5,000Cr market cap",
  },
  {
    id: "custom",
    name: "Custom Range",
    description: "Select your own market cap range",
  },
];

/**
 * Available portfolio size options for stock baskets
 */
export const portfolioSizeOptions: PortfolioSizeOption[] = [
  {
    id: "concentrated",
    name: "Concentrated",
    description: "15 stocks",
    stockCount: "15",
  },
  {
    id: "diversified",
    name: "Diversified",
    description: "25 stocks",
    stockCount: "25",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Enter number of stocks",
    stockCount: "",
  },
];

/**
 * Available portfolio allocation strategies for stock baskets
 * Uses generated enum values from portfolio API
 */
export const portfolioAllocationOptions: PortfolioAllocationOption[] = [
  {
    id: PortfolioAllocation.balanced,
    name: "Overall Balanced",
    description: "Balanced weightage based on fundamentals & technicals",
  },
  {
    id: PortfolioAllocation.performance,
    name: "Performance Weighted",
    description: "Higher weights to top performers",
  },
  {
    id: PortfolioAllocation.growth,
    name: "Growth Weighted",
    description: "Focus on high growth stocks",
  },
  {
    id: PortfolioAllocation.value,
    name: "Value Weighted",
    description: "Emphasis on value stocks",
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
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints",
    weight: 2.9,
    price: 2876.4,
    change: 0.7,
    sector: "Consumer",
    marketCap: "Large",
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    weight: 2.6,
    price: 7234.5,
    change: 1.9,
    sector: "Financial",
    marketCap: "Large",
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports",
    weight: 2.3,
    price: 1123.8,
    change: -0.4,
    sector: "Infrastructure",
    marketCap: "Large",
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    weight: 2.1,
    price: 1456.2,
    change: 0.6,
    sector: "Pharma",
    marketCap: "Large",
  },
  {
    symbol: "ITC",
    name: "ITC Limited",
    weight: 1.9,
    price: 456.8,
    change: 1.3,
    sector: "FMCG",
    marketCap: "Large",
  },
];

/**
 * Step definitions for stock basket builder
 */
export const stockBasketSteps = [
  { number: 1, title: "Investment Style", description: "Choose your approach" },
  { number: 2, title: "Market Cap", description: "Select company sizes" },
  { number: 3, title: "Portfolio Size", description: "Number of stocks" },
  {
    number: 4,
    title: "Portfolio Allocation",
    description: "Weight distribution",
  },
];
