import { PageHeader } from "@/components/layouts/PageHeader";

export default function Loading() {
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
