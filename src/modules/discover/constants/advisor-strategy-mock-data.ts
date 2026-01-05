/**
 * Mock data for Advisor Strategy Details page
 * Static data used for UI rendering only
 */

export const mockHoldings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    weight: 15.2,
    price: 2456.5,
    change: 2.3,
    marketCap: "Large Cap",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    weight: 12.8,
    price: 3890.75,
    change: 1.8,
    marketCap: "Large Cap",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    weight: 11.5,
    price: 1567.3,
    change: -0.5,
    marketCap: "Large Cap",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank Limited",
    weight: 10.3,
    price: 1678.9,
    change: 1.2,
    marketCap: "Large Cap",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    weight: 9.7,
    price: 1234.6,
    change: 0.8,
    marketCap: "Large Cap",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Limited",
    weight: 8.9,
    price: 987.4,
    change: -1.1,
    marketCap: "Large Cap",
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    weight: 7.6,
    price: 1876.25,
    change: 1.5,
    marketCap: "Large Cap",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    weight: 6.8,
    price: 3456.8,
    change: 2.1,
    marketCap: "Large Cap",
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies",
    weight: 5.9,
    price: 1543.7,
    change: 0.3,
    marketCap: "Large Cap",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki India",
    weight: 5.2,
    price: 10567.9,
    change: -0.8,
    marketCap: "Large Cap",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Limited",
    weight: 3.8,
    price: 543.2,
    change: 1.7,
    marketCap: "Large Cap",
  },
  {
    symbol: "TECHM",
    name: "Tech Mahindra",
    weight: 2.3,
    price: 1687.5,
    change: -0.3,
    marketCap: "Large Cap",
  },
];

export const mockPerformanceData = [
  { month: "Jan", basket: 8.2, nifty: 6.5, industry: 7.1 },
  { month: "Feb", basket: 12.1, nifty: 9.3, industry: 10.2 },
  { month: "Mar", basket: 15.8, nifty: 11.7, industry: 13.4 },
  { month: "Apr", basket: 18.9, nifty: 14.2, industry: 16.1 },
  { month: "May", basket: 22.3, nifty: 16.8, industry: 18.9 },
  { month: "Jun", basket: 24.5, nifty: 18.1, industry: 20.3 },
];

export const mockSectorAllocation = [
  { name: "Information Technology", value: 35.2, color: "#0088FE" },
  { name: "Financial Services", value: 28.4, color: "#00C49F" },
  { name: "Energy", value: 15.2, color: "#FFBB28" },
  { name: "Telecommunications", value: 8.9, color: "#FF8042" },
  { name: "Infrastructure", value: 6.8, color: "#8884D8" },
  { name: "Automobile", value: 5.5, color: "#82CA9D" },
];

export const mockSizeAllocation = [
  { name: "Large Cap", value: 85.3, color: "#0088FE" },
  { name: "Mid Cap", value: 12.7, color: "#00C49F" },
  { name: "Small Cap", value: 2.0, color: "#FFBB28" },
];

export const mockKeyMetrics = [
  { label: "1Y Returns", value: "+26.3%", change: 26.3 },
  { label: "3Y CAGR", value: "+18.7%", change: 18.7 },
  { label: "5Y CAGR", value: "+15.3%", change: 15.3 },
  { label: "Volatility", value: "16.8%", change: null },
  { label: "Sharpe Ratio", value: "1.46", change: null },
  { label: "Max Drawdown", value: "-12.3%", change: null },
  { label: "Beta", value: "0.98", change: null },
  { label: "Alpha", value: "4.2%", change: 4.2 },
];

export const mockBenchmarkComparison = [
  { metric: "1Y Return", basket: 26.3, nifty: 18.1, industry: 20.3 },
  { metric: "Volatility", basket: 16.8, nifty: 18.9, industry: 17.5 },
  { metric: "Sharpe Ratio", basket: 1.46, nifty: 1.23, industry: 1.34 },
  { metric: "Max Drawdown", basket: -12.3, nifty: -15.7, industry: -14.2 },
];
