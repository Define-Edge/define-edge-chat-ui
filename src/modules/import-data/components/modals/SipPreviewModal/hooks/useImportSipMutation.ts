/**
 * Mutation hook for importing SIP accounts to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { SIPFiDataResponse } from "@/modules/import-data/types/sip";
import { transformSipAccountsToMarkdownFormat } from "../utils/sip-transformer";

interface ImportSipParams {
  data: SIPFiDataResponse;
}

/**
 * Mutation hook for importing SIP data to chat
 * Formats SIP accounts as markdown table and submits to stream
 */
export function useImportSipMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data }: ImportSipParams) => {
      if (data.length === 0) {
        throw new Error("No SIP accounts found in the imported data");
      }

      // Transform to markdown format
      const formattedSIPs = transformSipAccountsToMarkdownFormat(data);

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedSIPs);

      const messageText = `I've imported my SIP registrations. Here's the data:\n\n${markdownTable}\n\n analyze my SIP registrations and provide insights.`;

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

      return { assetType: "SIP", accountsCount: data.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType} registrations added to chat (${result.accountsCount} accounts)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import SIP registrations", {
        description: error.message,
      });
    },
  });
}
