import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect } from "react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Compass,
  Database,
  History,
  PanelRightClose,
  PanelRightOpen,
  Plus,
} from "lucide-react";
import { parseAsBoolean, useQueryStates } from "nuqs";
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

export default function ThreadHistory() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [{ chatHistoryOpen }, setQuery] = useQueryStates(
    {
      chatHistoryOpen: parseAsBoolean.withDefault(false),
    },
    { shallow: false },
  );

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
            className="w-full justify-start gap-2 shadow-md"
            asChild
          >
            <Link href="/">
              <Plus className="h-4 w-4" />
              New chat
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 shadow-md"
            asChild
          >
            <Link href="/import">
              <Database className="h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 shadow-md"
            asChild
          >
            <Link href="/discover">
              <Compass className="h-4 w-4" />
              Discover
            </Link>
          </Button>
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="chat-history"
          className="w-full px-4"
        >
          <AccordionItem
            value="chat-history"
            className="rounded-md shadow-md"
          >
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
      </div>
      <div className="lg:hidden">
        <Sheet
          open={!!chatHistoryOpen && !isLargeScreen}
          onOpenChange={(open) => {
            if (isLargeScreen) return;
            setQuery({ chatHistoryOpen: open });
          }}
        >
          <SheetContent
            side="left"
            className="flex flex-col lg:hidden"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Thread History</SheetTitle>
            </SheetHeader>
            <div className="flex w-full flex-col gap-2 px-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 shadow-md"
                asChild
              >
                <Link href="/">
                  <Plus className="h-4 w-4" />
                  New chat
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 shadow-md"
                asChild
              >
                <Link href="/import">
                  <Database className="h-4 w-4" />
                  Import
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 shadow-md"
                asChild
              >
                <Link href="/discover">
                  <Compass className="h-4 w-4" />
                  Discover
                </Link>
              </Button>
            </div>
            <Accordion
              type="single"
              collapsible
              defaultValue="chat-history"
              className="w-full px-4"
            >
              <AccordionItem
                value="chat-history"
                className="rounded-md shadow-md"
              >
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Chat History</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="scrollbar-thin max-h-[calc(100vh-300px)] overflow-y-auto pb-2">
                  <ThreadList threads={threads} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
