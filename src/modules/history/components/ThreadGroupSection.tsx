import { Thread } from "@langchain/langgraph-sdk";
import { Calendar } from "lucide-react";
import ThreadCard from "./ThreadCard";

export default function ThreadGroupSection({
  title,
  threads,
}: {
  title: string;
  threads: Thread[];
}) {
  if (threads.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 flex-shrink-0 text-gray-500" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        {threads.map((t) => (
          <ThreadCard
            key={t.thread_id}
            thread={t}
          />
        ))}
      </div>
    </div>
  );
}
