import type {
  FundCategoryOption,
  PlanTypeOption,
  MutualFund,
  CategoryPreferenceOption,
} from "../types/basket-builder.types";

/**
 * Available plan types for mutual fund baskets
 */
export const planTypeOptions: PlanTypeOption[] = [
  {
    id: "direct",
    name: "Direct Plan",
    description: "Lower expense ratio, higher returns",
  },
  {
    id: "regular",
    name: "Regular Plan",
    description: "With distributor commission",
  },
];

/**
 * Available fund categories for mutual fund baskets
 */
export const fundCategoryOptions: FundCategoryOption[] = [
  { id: "largecap", name: "Large Cap" },
  { id: "midcap", name: "Mid Cap" },
  { id: "smallcap", name: "Small Cap" },
  { id: "multicap", name: "Multi Cap" },
  { id: "flexicap", name: "Flexi Cap" },
  { id: "focusedfund", name: "Focused Fund" },
  { id: "sectoral", name: "Sectoral/Thematic" },
  { id: "equity", name: "Equity Linked Savings (ELSS)" },
  { id: "balanced", name: "Balanced/Hybrid" },
  { id: "debt", name: "Debt Fund" },
  { id: "liquid", name: "Liquid Fund" },
  { id: "index", name: "Index Fund" },
  { id: "international", name: "International/Global" },
];

/**
 * Category preference options with preset allocations
 */
export const categoryPreferenceOptions: CategoryPreferenceOption[] = [
  {
    id: "largecap",
    name: "Largecap Focus",
    description: "Primarily large cap funds",
    categories: [
      { id: "largecap", name: "Large Cap", percentage: 60, schemesCount: 1 },
      { id: "flexicap", name: "Flexi Cap", percentage: 25, schemesCount: 1 },
      { id: "debt", name: "Debt Fund", percentage: 15, schemesCount: 1 },
    ],
  },
  {
    id: "midcap",
    name: "Midcap Focus",
    description: "Primarily mid cap funds",
    categories: [
      { id: "midcap", name: "Mid Cap", percentage: 50, schemesCount: 1 },
      { id: "largecap", name: "Large Cap", percentage: 30, schemesCount: 1 },
      { id: "debt", name: "Debt Fund", percentage: 20, schemesCount: 1 },
    ],
  },
  {
    id: "smallcap",
    name: "Smallcap Focus",
    description: "Primarily small cap funds",
    categories: [
      { id: "smallcap", name: "Small Cap", percentage: 40, schemesCount: 1 },
      { id: "midcap", name: "Mid Cap", percentage: 35, schemesCount: 1 },
      { id: "largecap", name: "Large Cap", percentage: 25, schemesCount: 1 },
    ],
  },
  {
    id: "international",
    name: "International Focus",
    description: "Global diversification",
    categories: [
      {
        id: "international",
        name: "International/Global",
        percentage: 50,
        schemesCount: 1,
      },
      { id: "largecap", name: "Large Cap", percentage: 30, schemesCount: 1 },
      { id: "debt", name: "Debt Fund", percentage: 20, schemesCount: 1 },
    ],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Build your own allocation",
    categories: [],
  },
];

/**
 * Mock mutual funds for basket generation
 */
export const mockMutualFunds: MutualFund[] = [
  {
    symbol: "AXIS-LC",
    name: "Axis Bluechip Fund",
    weight: 0,
    nav: 45.67,
    change: 1.2,
    category: "Large Cap",
    aum: "₹45,000 Cr",
  },
  {
    symbol: "ICICI-LC",
    name: "ICICI Prudential Bluechip Fund",
    weight: 0,
    nav: 78.34,
    change: 0.9,
    category: "Large Cap",
    aum: "₹52,300 Cr",
  },
  {
    symbol: "HDFC-MC",
    name: "HDFC Mid-Cap Opportunities Fund",
    weight: 0,
    nav: 125.34,
    change: 2.1,
    category: "Mid Cap",
    aum: "₹22,500 Cr",
  },
  {
    symbol: "KOTAK-MC",
    name: "Kotak Emerging Equity Fund",
    weight: 0,
    nav: 67.89,
    change: 1.8,
    category: "Mid Cap",
    aum: "₹18,700 Cr",
  },
  {
    symbol: "SBI-SC",
    name: "SBI Small Cap Fund",
    weight: 0,
    nav: 87.45,
    change: -0.5,
    category: "Small Cap",
    aum: "₹18,200 Cr",
  },
  {
    symbol: "AXIS-SC",
    name: "Axis Small Cap Fund",
    weight: 0,
    nav: 56.23,
    change: 2.3,
    category: "Small Cap",
    aum: "₹12,400 Cr",
  },
  {
    symbol: "ICICI-MF",
    name: "ICICI Prudential Multi Cap Fund",
    weight: 0,
    nav: 156.78,
    change: 1.5,
    category: "Multi Cap",
    aum: "₹31,200 Cr",
  },
  {
    symbol: "NIPPON-MC",
    name: "Nippon India Multi Cap Fund",
    weight: 0,
    nav: 98.45,
    change: 1.1,
    category: "Multi Cap",
    aum: "₹24,600 Cr",
  },
  {
    symbol: "PARAG-FC",
    name: "Parag Parikh Flexi Cap Fund",
    weight: 0,
    nav: 62.89,
    change: 1.8,
    category: "Flexi Cap",
    aum: "₹35,600 Cr",
  },
  {
    symbol: "CANARA-FC",
    name: "Canara Robeco Flexi Cap Fund",
    weight: 0,
    nav: 234.56,
    change: 0.7,
    category: "Flexi Cap",
    aum: "₹19,800 Cr",
  },
  {
    symbol: "KOTAK-FF",
    name: "Kotak Focused Equity Fund",
    weight: 0,
    nav: 67.45,
    change: 0.6,
    category: "Focused Fund",
    aum: "₹15,800 Cr",
  },
  {
    symbol: "SBI-FF",
    name: "SBI Focused Equity Fund",
    weight: 0,
    nav: 234.12,
    change: 1.3,
    category: "Focused Fund",
    aum: "₹21,300 Cr",
  },
  {
    symbol: "QUANT-SEC",
    name: "Quant Infrastructure Fund",
    weight: 0,
    nav: 76.23,
    change: 2.3,
    category: "Sectoral/Thematic",
    aum: "₹6,200 Cr",
  },
  {
    symbol: "ICICI-TECH",
    name: "ICICI Prudential Technology Fund",
    weight: 0,
    nav: 145.67,
    change: 1.9,
    category: "Sectoral/Thematic",
    aum: "₹8,900 Cr",
  },
  {
    symbol: "AXIS-ELSS",
    name: "Axis Long Term Equity Fund",
    weight: 0,
    nav: 89.12,
    change: 1.1,
    category: "Equity Linked Savings (ELSS)",
    aum: "₹42,100 Cr",
  },
  {
    symbol: "MIRAE-ELSS",
    name: "Mirae Asset Tax Saver Fund",
    weight: 0,
    nav: 34.78,
    change: 0.8,
    category: "Equity Linked Savings (ELSS)",
    aum: "₹16,500 Cr",
  },
  {
    symbol: "HDFC-BAL",
    name: "HDFC Balanced Advantage Fund",
    weight: 0,
    nav: 234.56,
    change: 0.8,
    category: "Balanced/Hybrid",
    aum: "₹54,300 Cr",
  },
  {
    symbol: "ICICI-BAL",
    name: "ICICI Prudential Equity & Debt Fund",
    weight: 0,
    nav: 187.23,
    change: 0.6,
    category: "Balanced/Hybrid",
    aum: "₹38,900 Cr",
  },
  {
    symbol: "ICICI-DEBT",
    name: "ICICI Prudential Corporate Bond Fund",
    weight: 0,
    nav: 28.45,
    change: 0.3,
    category: "Debt Fund",
    aum: "₹38,700 Cr",
  },
  {
    symbol: "HDFC-DEBT",
    name: "HDFC Corporate Bond Fund",
    weight: 0,
    nav: 25.67,
    change: 0.2,
    category: "Debt Fund",
    aum: "₹42,100 Cr",
  },
  {
    symbol: "AXIS-LIQUID",
    name: "Axis Liquid Fund",
    weight: 0,
    nav: 2345.67,
    change: 0.1,
    category: "Liquid Fund",
    aum: "₹25,900 Cr",
  },
  {
    symbol: "SBI-LIQUID",
    name: "SBI Liquid Fund",
    weight: 0,
    nav: 3456.89,
    change: 0.1,
    category: "Liquid Fund",
    aum: "₹32,400 Cr",
  },
  {
    symbol: "NIFTY-50",
    name: "ICICI Prudential Nifty 50 Index Fund",
    weight: 0,
    nav: 187.34,
    change: 1.0,
    category: "Index Fund",
    aum: "₹12,400 Cr",
  },
  {
    symbol: "HDFC-INDEX",
    name: "HDFC Index Fund - Nifty 50 Plan",
    weight: 0,
    nav: 156.78,
    change: 0.9,
    category: "Index Fund",
    aum: "₹9,800 Cr",
  },
  {
    symbol: "MOTILAL-US",
    name: "Motilal Oswal S&P 500 Index Fund",
    weight: 0,
    nav: 34.89,
    change: 1.9,
    category: "International/Global",
    aum: "₹8,500 Cr",
  },
  {
    symbol: "PPFAS-INT",
    name: "PPFAS Parag Parikh International Equity Fund",
    weight: 0,
    nav: 56.34,
    change: 1.5,
    category: "International/Global",
    aum: "₹11,200 Cr",
  },
];

/**
 * Step definitions for mutual fund basket builder
 */
export const mutualFundBasketSteps = [
  { number: 1, title: "Plan Type", description: "Direct or Regular" },
  {
    number: 2,
    title: "Category Preference",
    description: "Choose allocation style",
  },
  {
    number: 3,
    title: "Category Allocation",
    description: "Adjust weightages",
  },
  {
    number: 4,
    title: "Scheme per Category",
    description: "Number of schemes",
  },
];
