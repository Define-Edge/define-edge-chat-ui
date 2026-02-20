import type { Metadata } from "next";
import { WelcomePage } from "@/modules/welcome";

export const metadata: Metadata = {
  title: "Welcome to FinSharpeGPT — Your AI Financial Companion",
  description:
    "Make smarter investment decisions with AI-powered financial guidance. Discover opportunities, analyze your portfolio, and get personalized insights through natural conversation.",
};

export default function WelcomeRoute() {
  return <WelcomePage />;
}
