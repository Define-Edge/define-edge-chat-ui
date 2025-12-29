import { BarChart3, PieChart, Landmark, Building, Shield, CreditCard, Home, Coins, Globe } from "lucide-react";

export const importMethods = [
  {
    icon: BarChart3,
    title: "Equity Holdings",
    description: "Connect your demat account to sync equity stocks and derivatives",
    status: "connected" as const,
    lastUpdated: "1 hour ago"
  },
  {
    icon: PieChart,
    title: "Mutual Fund Holdings",
    description: "Import mutual fund portfolios from AMCs and platforms",
    status: "connected" as const,
    lastUpdated: "2 hours ago"
  },
  {
    icon: Landmark,
    title: "Fixed Deposits",
    description: "Connect bank FDs, corporate bonds, and term deposits",
    status: "available" as const
  },
  {
    icon: Building,
    title: "NPS",
    description: "Import National Pension System contributions and NAV data",
    status: "pending" as const
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Connect life, health, and general insurance policies",
    status: "available" as const
  },
  {
    icon: CreditCard,
    title: "Bank Accounts",
    description: "Import savings, current account statements and transactions",
    status: "connected" as const,
    lastUpdated: "3 hours ago"
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Add property details, rental income, and market valuations",
    status: "available" as const
  },
  {
    icon: Coins,
    title: "Commodities",
    description: "Connect gold, silver, and other commodity investments",
    status: "available" as const
  },
  {
    icon: Globe,
    title: "Other Investments",
    description: "Add unlisted shares, global stocks, crypto, bonds, and alternative investments",
    status: "available" as const
  }
];
