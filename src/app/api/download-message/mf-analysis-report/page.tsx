import MfAnalysisReportMessageComponent from "@/components/pdfs_templates/mf-report/mf-report";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import { createClient } from "@/providers/client";
import { MfAnalysis } from "@/types/mf-analysis";
import { UIMessage } from "@langchain/langgraph-sdk/react-ui";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MfAnalysisReportPage({ searchParams }: Props) {
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
          ClientComponentsRegistry[
            uiComponent.name as keyof typeof ClientComponentsRegistry
          ];

        if (uiComponent.name === "mf_analysis")
          return (
            <MfAnalysisReportMessageComponent
              key={uiComponent.id}
              analysis={uiComponent.props as MfAnalysis}
            />
          );
        return (
          <Component
            key={uiComponent.id}
            {...(uiComponent.props as any)}
          />
        );
      })}
    </main>
  );
}
