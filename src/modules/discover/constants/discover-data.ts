import {
  BarChart3,
  Crown,
  PieChart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  AdvisorStrategy,
  InvestmentBasket,
  InvestorBasket,
  ThematicBasket,
} from "../types/discover.types";

/**
 * Curated investment baskets - handpicked by FinSharpe
 */
export const curatedBaskets: InvestmentBasket[] = [
  {
    title: "AI & Technology Leaders",
    description:
      "Top companies driving the AI revolution with strong fundamentals and growth prospects",
    returns: "+24.5%",
    riskLevel: "Medium",
    stocks: 15,
    category: "Technology",
    performance: 24.5,
    trending: true,
  },
  {
    title: "ESG Champions",
    description:
      "Sustainable companies with excellent environmental, social, and governance practices",
    returns: "+18.2%",
    riskLevel: "Low",
    stocks: 20,
    category: "ESG",
    performance: 18.2,
  },
  {
    title: "High Dividend Yield",
    description:
      "Stable companies offering consistent and attractive dividend payments",
    returns: "+12.8%",
    riskLevel: "Low",
    stocks: 25,
    category: "Income",
    performance: 12.8,
  },
  {
    title: "Small Cap Gems",
    description: "Promising small-cap companies with high growth potential",
    returns: "+31.7%",
    riskLevel: "High",
    stocks: 12,
    category: "Growth",
    performance: 31.7,
    trending: true,
  },
];

/**
 * Thematic investment themes - trending sectors and industries
 */
export const thematicBaskets: ThematicBasket[] = [
  {
    title: "Electric Vehicles",
    subtitle: "EV manufacturers & battery tech",
    icon: Zap,
    color: "bg-green-500",
    stockCount: 18,
    returns: "+28.4%",
    performance: 28.4,
  },
  {
    title: "Renewable Energy",
    subtitle: "Solar, wind & clean energy",
    icon: Target,
    color: "bg-blue-500",
    stockCount: 22,
    returns: "+15.6%",
    performance: 15.6,
  },
  {
    title: "Healthcare Innovation",
    subtitle: "Biotech & pharmaceutical",
    icon: PieChart,
    color: "bg-purple-500",
    stockCount: 16,
    returns: "+19.3%",
    performance: 19.3,
  },
  {
    title: "Fintech Revolution",
    subtitle: "Digital banking & payments",
    icon: BarChart3,
    color: "bg-orange-500",
    stockCount: 14,
    returns: "+22.1%",
    performance: 22.1,
  },
];

/**
 * Special investment opportunities - IPOs, corporate actions, capacity expansion
 */
export const specialBaskets: InvestmentBasket[] = [
  {
    title: "IPO Corner",
    description:
      "Upcoming IPOs with comprehensive DRHP analysis and public information scanning",
    returns: "N/A",
    riskLevel: "High",
    stocks: 12,
    category: "IPO",
    performance: 0,
    isIPO: true,
  },
  {
    title: "Corporate Actions",
    description:
      "Opportunities from mergers, acquisitions, buybacks, spin-offs, preference share allotments, and special dividends",
    returns: "+14.3%",
    riskLevel: "Medium",
    stocks: 18,
    category: "Corporate",
    performance: 14.3,
    isCorporateAction: true,
  },
  {
    title: "Capacity Expansion",
    description:
      "Companies announcing major capacity expansion plans and capital expenditure investments",
    returns: "+22.7%",
    riskLevel: "Medium",
    stocks: 20,
    category: "Special",
    performance: 22.7,
  },
  {
    title: "Large Order Books",
    description:
      "Companies with significant order book wins and long-term contract announcements",
    returns: "+18.9%",
    riskLevel: "Medium",
    stocks: 16,
    category: "Special",
    performance: 18.9,
  },
  {
    title: "Mergers & Acquisitions",
    description:
      "Companies involved in merger, acquisition, or takeover activities with potential arbitrage opportunities",
    returns: "+16.8%",
    riskLevel: "High",
    stocks: 22,
    category: "Special",
    performance: 16.8,
  },
  {
    title: "Re-rating Opportunities",
    description:
      "Undervalued companies with catalysts for potential re-rating and multiple expansion",
    returns: "+25.3%",
    riskLevel: "Medium",
    stocks: 24,
    category: "Special",
    performance: 25.3,
  },
  {
    title: "Red Flag Stocks",
    description:
      "Stocks with deteriorating fundamentals and technicals - for contrarian or short strategies",
    returns: "-8.5%",
    riskLevel: "High",
    stocks: 25,
    category: "Alert",
    performance: -8.5,
    isRedFlag: true,
  },
];

/**
 * News-based investment baskets - driven by current market events
 */
export const newsBasedBaskets: InvestmentBasket[] = [
  {
    title: "Fed Rate Cut Beneficiaries",
    description: "Stocks likely to benefit from potential interest rate cuts",
    returns: "+16.8%",
    riskLevel: "Medium",
    stocks: 20,
    category: "News",
    performance: 16.8,
  },
  {
    title: "Earnings Beat Winners",
    description: "Companies that consistently exceed earnings expectations",
    returns: "+21.4%",
    riskLevel: "Medium",
    stocks: 18,
    category: "News",
    performance: 21.4,
  },
  {
    title: "Affected by Trade Tariffs",
    description:
      "Companies significantly impacted by international trade tariffs and import/export regulations",
    returns: "-3.2%",
    riskLevel: "High",
    stocks: 22,
    category: "News",
    performance: -3.2,
  },
];

/**
 * Research paper-based baskets - insights from analysis and reports
 */
export const researchPaperBaskets: InvestmentBasket[] = [
  {
    title: "Union Budget",
    description:
      "Companies positioned to benefit from latest Union Budget allocations and policy announcements",
    returns: "+19.5%",
    riskLevel: "Medium",
    stocks: 24,
    category: "Research",
    performance: 19.5,
  },
  {
    title: "Semiconductor Boost",
    description:
      "Semiconductor and related companies benefiting from government PLI schemes and global chip shortage",
    returns: "+35.8%",
    riskLevel: "High",
    stocks: 16,
    category: "Research",
    performance: 35.8,
  },
  {
    title: "Pharma Approvals",
    description:
      "Pharmaceutical companies with promising drug pipeline approvals and regulatory clearances",
    returns: "+26.4%",
    riskLevel: "High",
    stocks: 18,
    category: "Research",
    performance: 26.4,
  },
];

/**
 * Advisor strategies - curated by FinSharpe team
 */
export const advisorStrategies: AdvisorStrategy[] = [
  {
    title: "FinSharpe FlexiCap Strategy",
    description:
      "Dynamic multi-cap approach balancing growth and value stocks across market capitalizations based on market conditions",
    returns: "+26.3%",
    riskLevel: "Medium",
    stocks: 35,
    category: "Multi-Cap",
    performance: 26.3,
    advisor: "FinSharpe Research Team",
    methodology:
      "Proprietary algorithm combining momentum, quality, and value factors",
  },
  {
    title: "FinSharpe BlueChip Focus Strategy",
    description:
      "Conservative large-cap portfolio focused on established market leaders with consistent dividend history",
    returns: "+18.7%",
    riskLevel: "Low",
    stocks: 25,
    category: "Large-Cap",
    performance: 18.7,
    advisor: "FinSharpe Advisory Board",
    methodology:
      "Fundamental analysis with focus on quality metrics and dividend sustainability",
  },
  {
    title: "FinSharpe Growth Accelerator Strategy",
    description:
      "High-growth companies with strong earnings momentum and expanding market opportunities",
    returns: "+32.1%",
    riskLevel: "High",
    stocks: 20,
    category: "Growth",
    performance: 32.1,
    advisor: "FinSharpe Growth Specialists",
    methodology: "Revenue growth, margin expansion, and market share analysis",
  },
];

/**
 * Famous investor strategies - inspired by legendary investors
 */
export const investorBaskets: InvestorBasket[] = [
  {
    investor: "Warren Buffett",
    strategy: "Value Investing",
    philosophy:
      "Buy wonderful companies at fair prices and hold forever. Focus on strong moats and predictable earnings.",
    icon: Crown,
    color: "bg-amber-500",
    stockCount: 15,
    returns: "+19.8%",
    performance: 19.8,
    riskLevel: "Low",
  },
  {
    investor: "Peter Lynch",
    strategy: "Growth at Reasonable Price",
    philosophy:
      "Invest in what you know. Look for companies with strong growth but reasonable valuations (PEG ratio).",
    icon: TrendingUp,
    color: "bg-blue-500",
    stockCount: 25,
    returns: "+23.5%",
    performance: 23.5,
    riskLevel: "Medium",
  },
  {
    investor: "Cathie Wood",
    strategy: "Disruptive Innovation",
    philosophy:
      "Invest in companies creating and benefiting from technological disruption and innovation.",
    icon: Zap,
    color: "bg-purple-500",
    stockCount: 18,
    returns: "+28.7%",
    performance: 28.7,
    riskLevel: "High",
  },
];
