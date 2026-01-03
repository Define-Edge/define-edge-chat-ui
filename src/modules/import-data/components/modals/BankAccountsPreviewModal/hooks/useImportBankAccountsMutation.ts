/**
 * Mutation hook for importing bank accounts to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { BankAccountsFiDataResponse } from "@/modules/import-data/types/bank-accounts";
import {
  transformBankAccountsToInsights,
  formatAccountsAsText,
} from "../utils/bank-accounts-transformer";

interface ImportBankAccountsParams {
  data: BankAccountsFiDataResponse;
}

/**
 * Mutation hook for importing bank accounts data to chat
 * Formats bank accounts as markdown table and submits to stream
 */
export function useImportBankAccountsMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data }: ImportBankAccountsParams) => {
      if (!data || data.length === 0) {
        throw new Error("No bank accounts found in the imported data");
      }

      // Transform to insights format (excludes sensitive info)
      const accountInsights = transformBankAccountsToInsights(data);

      // Format as natural text
      const formattedText = formatAccountsAsText(accountInsights);

      const messageText = `I've imported my Bank Accounts. Here's the data:\n\n${formattedText}\nPlease analyze my accounts and provide insights on my financial health, spending patterns, and cash flow.`;

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

      return { assetType: "Bank Account", accountsCount: data.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType}s added to chat (${result.accountsCount} accounts)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import bank accounts", {
        description: error.message,
      });
    },
  });
}
