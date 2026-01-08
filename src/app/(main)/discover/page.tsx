"use client";

import { DiscoverPage } from "@/modules/discover";
import { PageHeader } from "@/components/layouts/PageHeader";

export default function DiscoverRoutePage() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <PageHeader title="Discover" />
      <div className="flex-1 overflow-y-auto">
        <DiscoverPage />
      </div>
    </div>
  );
}
