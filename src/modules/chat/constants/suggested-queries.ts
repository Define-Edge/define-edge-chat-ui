export type SuggestedPrompt = {
  id: number;
  text: string;
  icon: "TrendingUp" | "BarChart3" | "Sparkles" | "Activity" | "Shield" | "Wallet";
};

export const suggestedQueries: Record<string, SuggestedPrompt[]> = {
  Stocks: [
    { id: 1, text: "Analyze ICICI Bank's financial health, key metrics, and future growth potential", icon: "TrendingUp" },
    { id: 2, text: "Deep dive into TCS Q4 concall: revenue guidance, margin outlook, and strategic initiatives", icon: "BarChart3" },
    { id: 3, text: "Evaluate DMART's FinSharpe Score breakdown with sector comparison and investment recommendation", icon: "Sparkles" },
    { id: 4, text: "Compare Reliance vs Adani Power: valuation, debt levels, growth trajectory, and risk factors", icon: "Activity" },
    { id: 5, text: "HDFC Bank Q4 earnings deep dive: NII trends, asset quality, provisioning, and ROE analysis", icon: "BarChart3" },
    { id: 6, text: "Top 10 IT sector stocks by market cap with P/E ratios, growth prospects, and buy signals", icon: "TrendingUp" },
  ],
  "Mutual Funds": [
    { id: 1, text: "Top 10 performing equity mutual funds in 2026 with 3-year & 5-year CAGR analysis", icon: "BarChart3" },
    { id: 2, text: "Calculate SIP returns for ₹10,000/month invested over 5, 10, and 15 years in large-cap funds", icon: "TrendingUp" },
    { id: 3, text: "Best ELSS tax-saving funds with lock-in period, returns, and Section 80C benefits explained", icon: "Shield" },
    { id: 4, text: "Index funds vs actively managed funds: cost comparison, alpha generation, and suitability", icon: "Activity" },
    { id: 5, text: "Top debt funds for conservative investors in 2026: yield, duration, and credit risk analysis", icon: "Wallet" },
    { id: 6, text: "Best hybrid/balanced advantage funds for moderate risk with downside protection strategy", icon: "Shield" },
  ],
  "Personal Finance": [
    { id: 1, text: "Create a comprehensive monthly budget plan based on 50/30/20 rule with savings tracker", icon: "Wallet" },
    { id: 2, text: "Tax optimization strategies for salaried employees: HRA, 80C, 80D, NPS, and new tax regime", icon: "Shield" },
    { id: 3, text: "Retirement corpus calculator: ₹5 Cr by age 60 with current savings and investment roadmap", icon: "Activity" },
    { id: 4, text: "Emergency fund planning: calculate ideal amount, best instruments, and liquidity management", icon: "Shield" },
    { id: 5, text: "Top reward credit cards in 2026: cashback vs points, annual fees, and optimal usage strategy", icon: "Sparkles" },
    { id: 6, text: "Home loan vs renting analysis: EMI burden, tax benefits, appreciation, and break-even point", icon: "TrendingUp" },
  ],
};

export const suggestedQueriesCategories = [
  "Stocks",
  "Mutual Funds",
  "Personal Finance",
];
