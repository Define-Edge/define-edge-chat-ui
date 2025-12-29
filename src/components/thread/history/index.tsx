import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Database, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  parseAsBoolean,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { getContentString } from "../utils";

function ThreadList({
  threads,
  onThreadClick,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
}) {
  const [{ threadId }, setQuery] = useQueryStates(
    {
      importViewOpen: parseAsBoolean.withDefault(false),
      threadId: parseAsString,
    },
    { shallow: false },
  );
  // const [threadId, setThreadId] = useQueryState("threadId");

  return (
    <div>
      <div className="px-4 pb-1">
        <p className="text-muted-foreground text-sm">Recents</p>
      </div>
      <div className="scrollbar-thin flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-auto">
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
                className="w-[280px] items-start justify-start text-left font-normal"
                onClick={(e) => {
                  e.preventDefault();
                  onThreadClick?.(t.thread_id);
                  if (t.thread_id === threadId) return;
                  // setThreadId(t.thread_id);
                  setQuery({
                    importViewOpen: null,
                    threadId: t.thread_id,
                  });
                }}
              >
                <p className="truncate text-ellipsis">{itemText}</p>
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

export default function ThreadHistory() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [{ chatHistoryOpen }, setQuery] = useQueryStates(
    {
      chatHistoryOpen: parseAsBoolean.withDefault(false),
      importViewOpen: parseAsBoolean.withDefault(false),
      threadId: parseAsString,
    },
    { shallow: false },
  );
  // const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
  //   "chatHistoryOpen",
  //   parseAsBoolean.withDefault(false),
  // );
  // const [_threadId, setThreadId] = useQueryState("threadId");
  // const [_importViewOpen, setImportViewOpen] = useQueryState(
  //   "importViewOpen",
  //   parseAsBoolean.withDefault(false),
  // );

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  // Handle import holdings by adding message to existing thread or creating new one


  useEffect(() => {
    if (typeof window === "undefined") return;
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, [getThreads, setThreads, setThreadsLoading]);

  return (
    <>
      <div className="shadow-inner-right hidden h-screen w-[300px] shrink-0 flex-col items-start justify-start gap-6 border-r-[1px] border-slate-300 lg:flex">
        <div className="flex w-full items-center justify-between px-4 pt-1.5">
          <Button
            className="hover:bg-gray-100"
            variant="ghost"
            onClick={() =>
              setQuery((p) => ({ chatHistoryOpen: !p.chatHistoryOpen }))
            }
          >
            {chatHistoryOpen ? (
              <PanelRightOpen className="size-5" />
            ) : (
              <PanelRightClose className="size-5" />
            )}
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2 px-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              setQuery({
                importViewOpen: true,
                threadId: null,
              });
            }}
          >
            <Database className="h-4 w-4" />
            Import
          </Button>
        </div>
        {threadsLoading ? (
          <ThreadHistoryLoading />
        ) : (
          <ThreadList threads={threads} />
        )}
      </div>
      <div className="lg:hidden">
        <Sheet
          open={!!chatHistoryOpen && !isLargeScreen}
          onOpenChange={(open) => {
            if (isLargeScreen) return;
            setQuery({ chatHistoryOpen: true });
          }}
        >
          <SheetContent
            side="left"
            className="flex flex-col lg:hidden"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Thread History</SheetTitle>
            </SheetHeader>
            <div className="flex w-full flex-col gap-2 px-4 pb-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setQuery({
                    importViewOpen: true,
                    threadId: null,
                    chatHistoryOpen: false,
                  });
                }}
              >
                <Database className="h-4 w-4" />
                Import
              </Button>
            </div>
            <ThreadList
              threads={threads}
              onThreadClick={() =>
                setQuery((p) => ({ chatHistoryOpen: !p.chatHistoryOpen }))
              }
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
