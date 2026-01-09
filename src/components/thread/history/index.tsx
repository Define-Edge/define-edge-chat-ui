import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { History } from "lucide-react";
import { getContentString } from "../utils";

function ThreadList({ threads }: { threads: Thread[] }) {
  return (
    <div>
      <div className="flex w-full flex-col items-start justify-start gap-2">
        {threads.map((t) => {
          let itemText = t.thread_id;
          if (
            typeof t.values === "object" &&
            t.values &&
            "messages" in t.values &&
            Array.isArray(t.values.messages) &&
            t.values.messages?.length > 0
          ) {
            const firstMessage = t.values.messages[0];
            itemText = getContentString(firstMessage.content);
          }
          return (
            <div
              key={t.thread_id}
              className="w-full px-1"
            >
              <Button
                variant="ghost"
                className="w-[250px] items-start justify-start text-left font-normal md:w-[280px]"
                asChild
              >
                <Link href={`/?threadId=${t.thread_id}`}>
                  <p className="truncate text-ellipsis">{itemText}</p>
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className="scrollbar-thin flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-auto">
      {Array.from({ length: 30 }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-10 w-[280px]"
        />
      ))}
    </div>
  );
}

/**
 * Simplified ThreadHistory component
 * Now just renders the accordion with thread list
 * NavigationShell handles the Sheet wrapper and NavigationMenu
 */
export default function ThreadHistory() {
  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, [getThreads, setThreads, setThreadsLoading]);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="chat-history"
      className="w-full px-4"
    >
      <AccordionItem value="chat-history" className="rounded-md shadow-md">
        <AccordionTrigger className="px-4 py-2 hover:no-underline">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Chat History</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="scrollbar-thin max-h-[calc(100vh-300px)] overflow-y-auto pb-2">
          {threadsLoading ? (
            <ThreadHistoryLoading />
          ) : (
            <ThreadList threads={threads} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
