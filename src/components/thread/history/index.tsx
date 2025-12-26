import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread, Message } from "@langchain/langgraph-sdk";
import { useEffect } from "react";

import ImportHoldings from "@/components/moneyone/import-holdings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { FiDataResponse, Holding } from "@/lib/moneyone/moneyone.types";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { getContentString } from "../utils";
import FetchingFiDataModal from "@/components/moneyone/FetchingFiDataModal";
import { useStreamContext } from "@/providers/Stream";
import { v4 as uuidv4 } from "uuid";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";

function ThreadList({
  threads,
  onThreadClick,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
}) {
  const [threadId, setThreadId] = useQueryState("threadId");

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
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
                setThreadId(t.thread_id);
              }}
            >
              <p className="truncate text-ellipsis">{itemText}</p>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
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
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const [_threadId] = useQueryState("threadId");

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  const stream = useStreamContext();

  // Handle import holdings by adding message to existing thread or creating new one
  const handleImportHoldings = (
    data: FiDataResponse,
    consentType: ConsentType
  ) => {
    // Extract all holdings from all accounts
    const allHoldings: Holding[] = [];

    data.forEach((account) => {
      if (account.Summary?.Investment?.Holdings?.Holding) {
        allHoldings.push(...account.Summary.Investment.Holdings.Holding);
      }
    });

    if (allHoldings.length === 0) {
      console.warn("No holdings found in the imported data");
      return;
    }

    // Convert holdings to a simplified format for the markdown table
    const formattedHoldings = allHoldings.map((holding) => {
      if (consentType === ConsentType.EQUITIES) {
        return {
          "Issuer": holding.issuerName || "",
          "ISIN": holding.isin || "",
          "Description": holding.isinDescription || "",
          "Units": holding.units || "",
          "Last Traded Price": holding.lastTradedPrice || "",
        };
      } else {
        // Mutual Funds
        return {
          "Scheme": holding.schemeTypes || "",
          "AMC": holding.amc || "",
          "Folio No": holding.folioNo || "",
          "Closing Units": holding.closingUnits || "",
          "NAV": holding.nav || "",
          "NAV Date": holding.navDate || "",
        };
      }
    });

    // Create markdown table
    const markdownTable = convertToMarkdownTable(formattedHoldings);

    // Create message content
    const assetType = consentType === ConsentType.EQUITIES ? "Equity" : "Mutual Fund";
    const messageText = `I've imported my ${assetType} holdings. Here's the data:\n\n${markdownTable}\n\nPlease analyze my portfolio and provide insights.`;

    // Create a human message
    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [{ type: "text", text: messageText }] as Message["content"],
    };

    // Get tool messages to ensure consistency
    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    // Submit to stream (will use existing thread or create new one)
    stream.submit(
      { messages: [...toolMessages, newHumanMessage] },
      {
        streamMode: ["values"],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );
  };

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
            onClick={() => setChatHistoryOpen((p) => !p)}
          >
            {chatHistoryOpen ? (
              <PanelRightOpen className="size-5" />
            ) : (
              <PanelRightClose className="size-5" />
            )}
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">
            Thread History
          </h1>
        </div>
        <FetchingFiDataModal handleImportHoldings={handleImportHoldings} />
        <div className="flex w-full flex-col gap-2 px-4">
          <ImportHoldings
            consentType={ConsentType.EQUITIES}
            handlePfAction={handleImportHoldings}
          />
          <ImportHoldings
            consentType={ConsentType.MUTUAL_FUNDS}
            handlePfAction={handleImportHoldings}
          />
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
            setChatHistoryOpen(open);
          }}
        >
          <SheetContent
            side="left"
            className="flex flex-col lg:hidden"
          >
            <SheetHeader>
              <SheetTitle>Thread History</SheetTitle>
            </SheetHeader>
            <FetchingFiDataModal handleImportHoldings={handleImportHoldings} />
            <div className="flex w-full flex-col gap-2 px-4 pb-4">
              <ImportHoldings
                consentType={ConsentType.EQUITIES}
                handlePfAction={handleImportHoldings}
              />
              <ImportHoldings
                consentType={ConsentType.MUTUAL_FUNDS}
                handlePfAction={handleImportHoldings}
              />
            </div>
            <ThreadList
              threads={threads}
              onThreadClick={() => setChatHistoryOpen((o) => !o)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
