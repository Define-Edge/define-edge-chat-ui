"use client";

import { useGetAllStrategiesApiStrategiesGet } from "@/api/generated/strategy-apis/strategy-apis/strategy-apis";
import { PageHeader } from "@/components/layouts/PageHeader";
import { AdvisorStrategyDetailsPage } from "@/modules/discover/components/advisor-details/AdvisorStrategyDetailsPage";
import { useParams } from "next/navigation";

export default function StrategyDetailsPage() {
  const params = useParams();
  const strategyId = params.strategy as string;

  const { data, isLoading, error } = useGetAllStrategiesApiStrategiesGet();
  const strategy = data?.data.strategies.find((s) => s.strategy === strategyId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <PageHeader title="Strategy Details" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-text-secondary py-8 text-center">
            Loading strategy details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <PageHeader title="Strategy Details" />
        <div className="flex flex-1 items-center justify-center">
          <div className="py-8 text-center text-red-500">
            Failed to load strategy details. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <PageHeader title="Strategy Details" />
      <div className="flex-1 overflow-y-auto">
        <AdvisorStrategyDetailsPage strategy={strategy} />
      </div>
    </div>
  );
}
