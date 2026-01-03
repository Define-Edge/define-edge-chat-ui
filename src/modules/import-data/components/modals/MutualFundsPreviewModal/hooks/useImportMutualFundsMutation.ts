/**
 * Mutation hook for importing mutual funds to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { MutualFundsFiDataResponse } from "@/modules/import-data/types/mutual-funds";
import { transformMutualFundsToMarkdownFormat } from "../utils/mutual-funds-transformer";

interface ImportMutualFundsParams {
  data: MutualFundsFiDataResponse;
}

/**
 * Mutation hook for importing mutual funds data to chat
 * Formats mutual funds as markdown table and submits to stream
 */
export function useImportMutualFundsMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data }: ImportMutualFundsParams) => {
      // Extract all mutual funds from FI data
      const allMutualFunds = data.flatMap((account) =>
        account.Summary?.Investment?.Holdings?.Holding || []
      );

      if (allMutualFunds.length === 0) {
        throw new Error("No mutual fund holdings found in the imported data");
      }

      // Transform to markdown format
      const formattedMutualFunds = transformMutualFundsToMarkdownFormat(allMutualFunds);

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedMutualFunds);

      const messageText = `I've imported my Mutual Fund holdings. Here's the data:\n\n${markdownTable}\n\nPlease analyze my portfolio and provide insights.`;

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

      return { assetType: "Mutual Fund", holdingsCount: allMutualFunds.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType} holdings added to chat (${result.holdingsCount} holdings)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import mutual fund holdings", {
        description: error.message,
      });
    },
  });
}
