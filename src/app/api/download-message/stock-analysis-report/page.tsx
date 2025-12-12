import StockAnalysisReportMessageComponent from "@/components/pdfs_templates/stock-report/stock-report";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import { createClient } from "@/providers/client";
import { StockAnalysis } from "@/types/stock-analysis";
import { UIMessage } from "@langchain/langgraph-sdk/react-ui";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StockAnalysisReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const threadId = params.threadId;
  const analysisId = params.analysisId;

  const client = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.LANGSMITH_API_KEY,
  );
  const state = await client.threads.getState(threadId as string);

  const ui = (state.values as any)?.ui as UIMessage[] | undefined;
  

  const uiComponents = ui?.filter(
    (uiItem: UIMessage) => uiItem.props?.id === analysisId,
  );

  if (!uiComponents) {
    return null;
  }

  return (
    <main>
      {uiComponents.map((uiComponent: UIMessage) => {
        const Component =
          ClientComponentsRegistry[uiComponent.name as keyof typeof ClientComponentsRegistry];

        if (uiComponent.name === "stock_analysis")
          return (
            <StockAnalysisReportMessageComponent
              key={uiComponent.id}
              analysis={uiComponent.props as StockAnalysis}
            />
          );
        return (
          <Component
            key={uiComponent.id}
            {...(uiComponent.props as any)}
          />
        );
      })}
      {/* <MarkdownText>{String(message.content ?? "")}</MarkdownText>; */}
    </main>
  );
}
