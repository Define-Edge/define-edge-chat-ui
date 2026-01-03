/**
 * Mutation hook for importing equities to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { EquitiesFiDataResponse } from "@/modules/import-data/types/equities";
import { transformEquitiesToMarkdownFormat } from "../utils/equities-transformer";

interface ImportEquitiesParams {
  data: EquitiesFiDataResponse;
}

/**
 * Mutation hook for importing equities data to chat
 * Formats equities as markdown table and submits to stream
 */
export function useImportEquitiesMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data }: ImportEquitiesParams) => {
      // Extract all equities from FI data
      const allEquities = data.flatMap((account) =>
        account.Summary?.Investment?.Holdings?.Holding || []
      );

      if (allEquities.length === 0) {
        throw new Error("No equity holdings found in the imported data");
      }

      // Transform to markdown format
      const formattedEquities = transformEquitiesToMarkdownFormat(allEquities);

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedEquities);

      const messageText = `I've imported my Equity holdings. Here's the data:\n\n${markdownTable}\n\nPlease analyze my portfolio and provide insights.`;

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

      return { assetType: "Equity", holdingsCount: allEquities.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType} holdings added to chat (${result.holdingsCount} holdings)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import equity holdings", {
        description: error.message,
      });
    },
  });
}
