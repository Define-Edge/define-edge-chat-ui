/**
 * Mutation hook for importing ETFs to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ETFFiDataResponse } from "@/modules/import-data/types/etf";
import { transformETFsToMarkdownFormat } from "../utils/etf-transformer";

interface ImportEtfParams {
  data: ETFFiDataResponse;
}

/**
 * Mutation hook for importing ETF data to chat
 * Formats ETFs as markdown table and submits to stream
 */
export function useImportEtfMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data }: ImportEtfParams) => {
      // Extract all ETFs from FI data
      const allETFs = data.flatMap((account) =>
        account.Summary?.Investment?.Holdings?.Holding || []
      );

      if (allETFs.length === 0) {
        throw new Error("No ETF holdings found in the imported data");
      }

      // Transform to markdown format
      const formattedETFs = transformETFsToMarkdownFormat(allETFs);

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedETFs);

      const messageText = `I've imported my ETF holdings. Here's the data:\n\n${markdownTable}\n\nPlease analyze my portfolio and provide insights.`;

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

      return { assetType: "ETF", holdingsCount: allETFs.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType} holdings added to chat (${result.holdingsCount} holdings)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import ETF holdings", {
        description: error.message,
      });
    },
  });
}
