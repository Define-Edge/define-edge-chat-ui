/**
 * Mutation hook for importing strategy holdings to chat
 */

"use client";
import { useMutation } from "@tanstack/react-query";
import { useStreamContext } from "@/providers/Stream";
import { convertToMarkdownTable } from "@/lib/convertToMarkdownTable";
import { ensureToolCallsHaveResponses } from "@/lib/ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { StrategyAnalyticsResponse } from "@/api/generated/strategy-apis/models";

interface ImportStrategyParams {
  strategy: StrategyAnalyticsResponse;
}

/**
 * Transforms strategy holdings to markdown table format
 */
function transformStrategyHoldingsToMarkdown(
  strategy: StrategyAnalyticsResponse,
) {
  return strategy.holdings.map((holding) => ({
    Ticker: holding.Ticker,
    "Company Name": holding.Company_Name || "N/A",
    Industry: holding.Industry || "N/A",
    Size: holding.Size || "N/A",
    "Weight (%)": holding.weight.toFixed(2),
    "Market Cap (Cr)": holding.T3M_Avg_Mcap
      ? `₹${(holding.T3M_Avg_Mcap / 1000).toFixed(2)}K`
      : "N/A",
  }));
}

/**
 * Mutation hook for importing strategy data to chat
 * Formats strategy holdings as markdown table and submits to stream
 */
export function useImportStrategyMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({ strategy }: ImportStrategyParams) => {
      if (!strategy.holdings || strategy.holdings.length === 0) {
        throw new Error("No holdings found in the strategy");
      }

      // Transform holdings to markdown format
      const formattedHoldings = transformStrategyHoldingsToMarkdown(strategy);

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedHoldings);

      // Create the message with strategy context
      const messageText = `I'm interested in analyzing the "${strategy.display_name}" strategy. Here are the details:

**Strategy Overview:**
- **Name:** ${strategy.display_name}
- **Category:** ${strategy.category}
- **Risk Level:** ${strategy.risk_level}
- **Description:** ${strategy.description}
- **Total Stocks:** ${strategy.total_stock_count}

**Portfolio Holdings:**

${markdownTable}

Please analyze this strategy and provide insights on:
1. Overall portfolio composition and diversification
2. Risk assessment based on the holdings
3. Key strengths and potential concerns
4. Suitability for different investor profiles`;

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

      return {
        strategyName: strategy.display_name,
        holdingsCount: strategy.holdings.length,
      };
    },
    onSuccess: (result) => {
      toast.success(
        `Strategy "${result.strategyName}" added to chat (${result.holdingsCount} holdings)`,
      );
    },
    onError: (error: Error) => {
      toast.error("Failed to import strategy", {
        description: error.message,
      });
    },
  });
}
