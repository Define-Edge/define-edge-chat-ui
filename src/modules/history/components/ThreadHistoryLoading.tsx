import { Skeleton } from "@/components/ui/skeleton";

export default function ThreadHistoryLoading() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-32 w-full"
        />
      ))}
    </div>
  );
}
