import {
  Bot,
  Compass,
  ShieldCheck,
  BarChart3,
  Brain,
  Lightbulb,
  FileText,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string; // Tailwind bg class for the icon circle
  iconColor: string; // Tailwind text class for the icon
}

export const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Financial Advisor",
    description:
      "Get personalized financial guidance powered by advanced AI that understands your goals and risk profile.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Compass,
    title: "Investment Discovery",
    description:
      "Discover stocks, mutual funds, and investment opportunities tailored to your portfolio and preferences.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data Import",
    description:
      "Import your holdings securely via RBI-regulated Account Aggregator framework with read-only access.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description:
      "Deep-dive into your portfolio with comprehensive analytics, risk metrics, and performance tracking.",
    color: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: Brain,
    title: "Chat Memory",
    description:
      "Your AI assistant remembers context across conversations for a seamless, continuous experience.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Lightbulb,
    title: "Expert Strategies",
    description:
      "Access curated investment strategies and insights from financial experts and market research.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: FileText,
    title: "Comprehensive Reports",
    description:
      "Generate detailed portfolio reports with risk analysis, allocation insights, and actionable recommendations.",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Optimized for every screen size — manage your finances on the go with a seamless mobile experience.",
    color: "bg-sky-100",
    iconColor: "text-sky-600",
  },
];

export interface ShowcaseFeature {
  title: string;
  description: string;
  bullets: string[];
  gradient: string; // Tailwind gradient classes for the visual placeholder
  iconBg: string;
  icon: LucideIcon;
}

export const showcaseFeatures: ShowcaseFeature[] = [
  {
    title: "Your Personal AI Financial Advisor",
    description:
      "Have natural conversations about your finances. Ask questions, get explanations, and receive personalized recommendations — all in plain language.",
    bullets: [
      "Natural language financial Q&A",
      "Personalized to your risk profile",
      "Actionable investment suggestions",
      "Always available, always learning",
    ],
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    icon: Bot,
  },
  {
    title: "Discover Your Next Investment",
    description:
      "Explore a universe of investment opportunities filtered and ranked based on your goals, risk tolerance, and existing portfolio composition.",
    bullets: [
      "Smart stock and MF screening",
      "Risk-adjusted recommendations",
      "Sector and theme-based discovery",
      "Real-time market insights",
    ],
    gradient: "from-purple-500 to-pink-600",
    iconBg: "bg-purple-100",
    icon: Compass,
  },
  {
    title: "Secure & Effortless Data Import",
    description:
      "Connect your financial accounts securely through India's RBI-regulated Account Aggregator framework. Your data stays yours — we only read, never transact.",
    bullets: [
      "RBI-regulated AA framework",
      "256-bit encrypted data transfer",
      "Read-only access to holdings",
      "Supports all major banks & brokers",
    ],
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-green-100",
    icon: ShieldCheck,
  },
];
