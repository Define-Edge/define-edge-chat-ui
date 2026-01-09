import { AdvisorStrategyDetailsPage } from "@/modules/discover/components/advisor-details/AdvisorStrategyDetailsPage";
import { notFound } from "next/navigation";
import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";

type PageProps = {
  params: Promise<{ strategy: string }>;
};

export default async function StrategyDetailsPage({ params }: PageProps) {
  const { strategy: strategyId } = await params;

  // For server-side rendering, construct the full URL
  const baseUrl = process.env.LANGGRAPH_API_URL || "http://127.0.0.1:2024";
  const url = `${baseUrl}/api/strategies/${strategyId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);

    if (res.status === 404) {
      notFound();
    }
    // For other errors, throw to trigger error boundary
    throw new Error(`Failed to fetch strategy: ${res.status} ${res.statusText}`);
  }

  const strategy: StrategyAnalyticsResponse = await res.json();

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AdvisorStrategyDetailsPage strategy={strategy} />
      </div>
    </div>
  );
}
