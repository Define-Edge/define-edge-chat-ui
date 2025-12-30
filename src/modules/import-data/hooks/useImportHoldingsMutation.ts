"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { FiDataResponse, Holding } from "@/lib/moneyone/moneyone.types";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ImportHoldingsParams {
  data: FiDataResponse;
  consentType: ConsentType;
}

/**
 * Mutation hook for importing holdings data to chat
 * Formats holdings as markdown table and submits to stream
 */
export function useImportHoldingsMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ data, consentType }: ImportHoldingsParams) => {
      // Extract all holdings from all accounts
      const allHoldings: Holding[] = [];

      data.forEach((account) => {
        if (account.Summary?.Investment?.Holdings?.Holding) {
          allHoldings.push(...account.Summary.Investment.Holdings.Holding);
        }
      });

      if (allHoldings.length === 0) {
        throw new Error("No holdings found in the imported data");
      }

      // Convert holdings to a simplified format for the markdown table
      const formattedHoldings = allHoldings.map((holding) => {
        if (consentType === ConsentType.EQUITIES) {
          return {
            Issuer: holding.issuerName || "",
            ISIN: holding.isin || "",
            Units: holding.units || "",
          };
        } else {
          // Mutual Funds
          return {
            Description: holding.isinDescription || holding.schemeTypes || "",
            ISIN: holding.isin || "",
            "Closing Units": holding.closingUnits || "",
          };
        }
      });

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedHoldings);

      // Create message content
      const assetType =
        consentType === ConsentType.EQUITIES ? "Equity" : "Mutual Fund";
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

      return { assetType, holdingsCount: allHoldings.length };
    },
    onSuccess: (result) => {
      toast.success(
        `${result.assetType} holdings added to chat (${result.holdingsCount} holdings)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import holdings", {
        description: error.message,
      });
    },
  });
}
