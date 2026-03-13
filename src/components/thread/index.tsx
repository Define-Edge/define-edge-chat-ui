import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlannerModels } from "@/configs/models";
import { useFileUpload } from "@/hooks/use-file-upload";
import useDetectKeyboardOpen from "@/hooks/useDetectKeyboardOpen";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  DO_NOT_RENDER_ID_PREFIX,
  ensureToolCallsHaveResponses,
} from "@/lib/ensure-tool-responses";
import { cn } from "@/lib/utils";
import SuggestedQueries from "@/modules/chat/components/SuggestedQueries";
import { useStreamContext } from "@/providers/Stream";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { startCase } from "lodash";
import {
  ArrowDown,
  LoaderCircle,
  MoreVertical,
  Plus,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ContentBlocksPreview } from "./ContentBlocksPreview";
import {
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
  useArtifactOpen,
} from "./artifact";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";
import { HumanMessage } from "./messages/human";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div
        ref={context.contentRef}
        className={props.contentClassName}
      >
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

// Helper function to format model display names
function getModelDisplayName(modelKey: string): string {
  const formatted = startCase(modelKey.toLowerCase());
  // Replace spaces between numbers with dots (e.g., "4 5" -> "4.5")
  return formatted.replace(/(\d)\s+(\d)/g, "$1.$2");
}

// function OpenGitHubRepo() {
//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <a
//             href="https://github.com/langchain-ai/agent-chat-ui"
//             target="_blank"
//             className="flex items-center justify-center"
//           >
//             <GitHubSVG
//               width="24"
//               height="24"
//             />
//           </a>
//         </TooltipTrigger>
//         <TooltipContent side="left">
//           <p>Open GitHub repo</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }

export function Thread() {
  const [artifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useDetectKeyboardOpen();

  const [threadId, _setThreadId] = useQueryState("threadId");
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<PlannerModels>(
    PlannerModels.SONNET_4_5,
  );
  const {
    contentBlocks,
    setContentBlocks,
    handleFileUpload,
    dropRef,
    removeBlock,
    dragOver,
    handlePaste,
  } = useFileUpload();
  const [_firstTokenReceived, setFirstTokenReceived] = useState(false);

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  const lastError = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim().length === 0 && contentBlocks.length === 0) || isLoading)
      return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        ...(input.trim().length > 0 ? [{ type: "text", text: input }] : []),
        ...contentBlocks,
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context =
      Object.keys(artifactContext).length > 0 ? artifactContext : undefined;

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context },
      {
        streamMode: ["values"],
        config: {
          configurable: {
            planner_agent_model: selectedModel,
          },
        },
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput("");
    setContentBlocks([]);
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ["values"],
    });
  };

  const handleSuggestedQuery = (query: string) => {
    if (isLoading) return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [{ type: "text", text: query }],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    stream.submit(
      { messages: [...toolMessages, newHumanMessage] },
      {
        streamMode: ["values"],
        config: {
          configurable: {
            planner_agent_model: selectedModel,
          },
        },
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

  const chatStarted = !!threadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  return (
    <div
      className={cn(
        "grid h-full w-full grid-cols-[1fr_0fr] transition-all duration-500",
        artifactOpen && !isMobile && "grid-cols-[3fr_2fr]",
      )}
    >
      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col overflow-hidden",
          !chatStarted && "grid-rows-[1fr]",
        )}
      >
        <StickToBottom className="relative flex-1 overflow-hidden">
          <StickyToBottomContent
            className={cn(
              "scrollbar-thin absolute inset-0 overflow-y-auto",
              !chatStarted &&
                !isKeyboardOpen &&
                "mt-6 flex flex-col items-stretch",
              (chatStarted || isKeyboardOpen) && "grid grid-rows-[1fr_auto]",
            )}
            contentClassName={cn(
              "chat-container mx-auto flex flex-col gap-4 w-full",
              isKeyboardOpen ? "pb-4 justify-end" : "pt-8 pb-10",
            )}
            content={
              <>
                {!chatStarted && (
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={56}
                      height={56}
                    />
                    <h1 className="text-4xl font-semibold text-gray-800">
                      Welcome to FinSharpeGPT
                    </h1>
                  </div>
                )}
                {messages
                  .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                  .map((message, index) =>
                    message.type === "human" ? (
                      <HumanMessage
                        key={message.id || `${message.type}-${index}`}
                        message={message}
                        isLoading={isLoading}
                      />
                    ) : (
                      <AssistantMessage
                        key={message.id || `${message.type}-${index}`}
                        message={message}
                        isLoading={isLoading}
                        handleRegenerate={handleRegenerate}
                      />
                    ),
                  )}
                {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
                    We need to render it outside of the messages list, since there are no messages to render */}
                {hasNoAIOrToolMessages && !!stream.interrupt && (
                  <AssistantMessage
                    key="interrupt-msg"
                    message={undefined}
                    isLoading={isLoading}
                    handleRegenerate={handleRegenerate}
                  />
                )}
                {isLoading && <AssistantMessageLoading />}
                {stream.error && !isLoading && (
                  <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                      An error occurred
                    </p>
                    {typeof stream.error === "string" ? (
                      <p className="mt-1 text-sm text-red-600">
                        {stream.error}
                      </p>
                    ) : (
                      <pre className="mt-1 overflow-auto rounded bg-red-100 p-2 text-xs text-red-600">
                        {JSON.stringify(stream.error, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </>
            }
            footer={
              <div
                className={cn(
                  "sticky bottom-0 flex flex-col items-center bg-gray-50",
                  chatStarted ? "gap-8" : "gap-2",
                )}
              >
                <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                <div
                  ref={dropRef}
                  className={cn(
                    "chat-container relative z-10 mx-auto w-full rounded-2xl shadow-xs transition-all",
                    isKeyboardOpen ? "mb-2" : chatStarted ? "mb-8" : "mb-3",
                    dragOver
                      ? "border-primary border-2 border-dotted"
                      : "border border-solid",
                  )}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="chat-container mx-auto grid grid-rows-[1fr_auto] gap-2"
                  >
                    <ContentBlocksPreview
                      blocks={contentBlocks}
                      onRemove={removeBlock}
                    />
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onPaste={handlePaste}
                      onClick={(e) => {
                        // On mobile, scroll the input into view when keyboard appears
                        const target = e.target as HTMLTextAreaElement;
                        setTimeout(() => {
                          target.scrollIntoView({
                            behavior: "instant",
                            block: "center",
                          });
                        }, 300);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !e.metaKey &&
                          !e.nativeEvent.isComposing
                        ) {
                          e.preventDefault();
                          const el = e.target as HTMLElement | undefined;
                          const form = el?.closest("form");
                          form?.requestSubmit();
                        }
                      }}
                      placeholder="Type your message..."
                      className="field-sizing-content resize-none border-none p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                    />

                    <div className="flex items-center gap-6 p-2 pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="md:hidden"
                          asChild
                        >
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {/* <DropdownMenuItem asChild>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="render-tool-calls"
                                  checked={hideToolCalls ?? false}
                                  onCheckedChange={setHideToolCalls}
                                />
                                <Label
                                  htmlFor="render-tool-calls"
                                  className="text-sm text-gray-600"
                                >
                                  Hide Tool Calls
                                </Label>
                              </div>
                            </DropdownMenuItem> */}
                          <DropdownMenuItem
                            asChild
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="flex flex-col gap-2 p-2">
                              <Select
                                value={selectedModel}
                                onValueChange={(value) =>
                                  setSelectedModel(value as PlannerModels)
                                }
                              >
                                <SelectTrigger className="h-8 w-full text-sm">
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(PlannerModels).map(
                                    ([key, value]) => (
                                      <SelectItem
                                        key={value}
                                        value={value}
                                      >
                                        {getModelDisplayName(key)}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Label
                              htmlFor="file-input"
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <Plus className="size-5 text-gray-600" />
                              <span className="text-sm text-gray-600">
                                Upload File
                              </span>
                            </Label>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {/* <div className="hidden md:flex items-center space-x-2">
                          <Switch
                            id="render-tool-calls"
                            checked={hideToolCalls ?? false}
                            onCheckedChange={setHideToolCalls}
                          />
                          <Label
                            htmlFor="render-tool-calls"
                            className="text-sm text-gray-600"
                          >
                            Hide Tool Calls
                          </Label>
                        </div> */}
                      <div className="hidden items-center gap-2 md:flex">
                        <Select
                          value={selectedModel}
                          onValueChange={(value) =>
                            setSelectedModel(value as PlannerModels)
                          }
                        >
                          <SelectTrigger className="h-8 w-[200px] text-sm">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PlannerModels).map(
                              ([key, value]) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                >
                                  {getModelDisplayName(key)}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Label
                        htmlFor="file-input"
                        className="hidden cursor-pointer items-center gap-2 md:flex"
                      >
                        <Plus className="size-5 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Upload File
                        </span>
                      </Label>
                      <input
                        id="file-input"
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.csv,.xlsx"
                        className="hidden"
                      />
                      {stream.isLoading ? (
                        <Button
                          key="stop"
                          onClick={() => stream.stop()}
                          className="ml-auto"
                        >
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto shadow-md transition-all"
                          disabled={
                            isLoading ||
                            (!input.trim() && contentBlocks.length === 0)
                          }
                        >
                          Send
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
                {!chatStarted && (
                  <div className="chat-container mx-auto w-full">
                    <SuggestedQueries onQuerySelect={handleSuggestedQuery} />
                  </div>
                )}
              </div>
            }
          />
        </StickToBottom>
      </div>
      {artifactOpen && !isMobile && (
        <div className="relative flex h-full flex-col overflow-hidden border-l">
          <div className="absolute inset-0 flex min-w-[30vw] flex-col">
            <div className="grid grid-cols-[1fr_auto] border-b p-4">
              <ArtifactTitle className="truncate overflow-hidden" />
              <button
                onClick={closeArtifact}
                className="cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <ArtifactContent className="relative flex-grow overflow-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
