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
import { CreateCustomPortfolioResponse } from "@/api/generated/portfolio-apis/models";
import { CreateMFPortfolioResponse } from "@/api/generated/mf-portfolio-apis/models/createMFPortfolioResponse";
import { MFPortfolioItem } from "@/types/mf-portfolio";

type PortfolioType = "strategy" | "stock-basket" | "mf-basket";

interface ImportStrategyParams {
  strategy:
    | StrategyAnalyticsResponse
    | CreateCustomPortfolioResponse
    | CreateMFPortfolioResponse;
  type?: PortfolioType;
  customIntro?: string;
}

/**
 * Transforms strategy holdings to markdown table format
 */
function transformStrategyHoldingsToMarkdown(
  strategy:
    | StrategyAnalyticsResponse
    | CreateCustomPortfolioResponse
    | CreateMFPortfolioResponse,
  type: PortfolioType = "strategy",
) {
  if (type === "mf-basket") {
    const mfStrategy = strategy as CreateMFPortfolioResponse;
    return (mfStrategy.analytics.holdings as unknown as MFPortfolioItem[]).map(
      (holding) => ({
        "Scheme Name": String(holding.Scheme_Name ?? "N/A"),
        "SEBI Category": String(holding.Sebi_Category ?? "N/A"),
        "Weight (%)": Number(holding.weight ?? 0).toFixed(2),
        ISIN: String(holding.ISIN ?? "N/A"),
      }),
    );
  }

  // Handle Strategy and Stock Basket (they share similar structure)
  const stockStrategy = strategy as
    | StrategyAnalyticsResponse
    | CreateCustomPortfolioResponse;

  return stockStrategy.analytics.holdings.map((holding) => ({
    Ticker: String(holding.Ticker ?? ""),
    "Company Name": String(holding.Company_Name ?? "N/A"),
    Industry: String(holding.Industry ?? "N/A"),
    Size: String(holding.Size ?? "N/A"),
    "Weight (%)": Number(holding.weight ?? 0).toFixed(2),
  }));
}

/**
 * Mutation hook for importing strategy data to chat
 * Formats strategy holdings as markdown table and submits to stream
 */
export function useImportStrategyMutation() {
  const stream = useStreamContext();

  return useMutation({
    mutationFn: async ({
      strategy,
      type = "strategy",
      customIntro,
    }: ImportStrategyParams) => {
      if (
        !strategy.analytics.holdings ||
        strategy.analytics.holdings.length === 0
      ) {
        throw new Error("No holdings found in the portfolio");
      }

      // Transform holdings to markdown format
      const formattedHoldings = transformStrategyHoldingsToMarkdown(
        strategy,
        type,
      );

      // Create markdown table
      const markdownTable = convertToMarkdownTable(formattedHoldings);

      let messageText = "";

      if (customIntro) {
        // Use custom intro if provided
        messageText = `${customIntro}

**Portfolio Holdings:**

${markdownTable}
`;
      } else {
        // Default strategy intro
        const s = strategy as StrategyAnalyticsResponse;
        messageText = `I'm interested in analyzing the "${s.display_name}" strategy. Here are the details:

**Strategy Overview:**
- **Name:** ${s.display_name}
- **Category:** ${s.category}
- **Risk Level:** ${s.risk_level}
- **Description:** ${s.description}
- **Total Stocks:** ${s.analytics.total_stocks}

**Portfolio Holdings:**

${markdownTable}

Please analyze this strategy and provide insights on:
1. Overall portfolio composition and diversification
2. Risk assessment based on the holdings
3. Key strengths and potential concerns
4. Suitability for different investor profiles`;
      }

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
        strategyName:
          (strategy as StrategyAnalyticsResponse).display_name ||
          "Custom Portfolio",
        holdingsCount: strategy.analytics.holdings.length,
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
