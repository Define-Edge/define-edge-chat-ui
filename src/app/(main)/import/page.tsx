"use client";

import { ImportDataPage } from "@/modules/import-data";
import { PageHeader } from "@/components/layouts/PageHeader";

export default function ImportPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Import Data" />
      <div className="flex-1 overflow-y-auto">
        <ImportDataPage />
      </div>
    </div>
  );
}
