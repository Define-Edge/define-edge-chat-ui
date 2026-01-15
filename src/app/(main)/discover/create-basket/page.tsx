"use client";

import { CustomBasketBuilderPage } from "@/modules/discover/components/custom-basket/CustomBasketBuilderPage";
import { PageHeader } from "@/components/layouts/PageHeader";

/**
 * Route page for custom basket builder
 */
export default function CreateBasketPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Custom Basket Builder" />
      <div className="flex-1 overflow-y-auto">
        <CustomBasketBuilderPage />
      </div>
    </div>
  );
}
