"use client";

import { ImportDataPage } from "@/modules/import-data";
import { PageHeader } from "@/components/layouts/PageHeader";

export default function ImportPage() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <PageHeader title="Import Data" />
      <div className="flex-1 overflow-y-auto">
        <ImportDataPage />
      </div>
    </div>
  );
}
