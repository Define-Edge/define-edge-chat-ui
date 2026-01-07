import { LucideIcon } from "lucide-react";

/**
 * Risk level classification for investment baskets
 */
export type RiskLevel = "Low" | "Medium" | "High";

/**
 * Base interface for investment basket cards
 */
export interface InvestmentBasket {
  title: string;
  description: string;
  returns: string;
  riskLevel: RiskLevel;
  stocks: number;
  category: string;
  performance: number;
  trending?: boolean;
  isRedFlag?: boolean;
  isIPO?: boolean;
  isCorporateAction?: boolean;
}

/**
 * Thematic basket interface for trending investment themes
 */
export interface ThematicBasket {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  stockCount: number;
  returns: string;
  performance: number;
}

/**
 * Advisor strategy interface for FinSharpe curated strategies
 */
export interface AdvisorStrategy {
  title: string;
  description: string;
  returns: string;
  riskLevel: RiskLevel;
  stocks: number;
  category: string;
  performance: number;
  advisor: string;
  methodology: string;
}

/**
 * Famous investor basket interface
 */
export interface InvestorBasket {
  investor: string;
  strategy: string;
  philosophy: string;
  icon: LucideIcon;
  color: string;
  stockCount: number;
  returns: string;
  performance: number;
  riskLevel: RiskLevel;
}

/**
 * Dropdown section props for collapsible sections
 */
export interface DropdownSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

/**
 * Collapsible info card props
 */
export interface CollapsibleInfoProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  iconColor: string;
  defaultExpanded?: boolean;
}
