import PfAnalysisReportMessageComponent from "@/components/pdfs_templates/pf-report/pf-report";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import { createClient } from "@/providers/client";
import { PfAnalysis } from "@/types/pf-analysis";
import { UIMessage } from "@langchain/langgraph-sdk/react-ui";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PfAnalysisReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const threadId = params.threadId;
  const analysisId = params.analysisId;
  const selectedSectionsParam = params.selectedSections as string | undefined;
  const personalComment = params.personalComment as string | undefined;

  // Parse selected sections from JSON string
  let selectedSections: string[] | undefined;
  if (selectedSectionsParam) {
    try {
      selectedSections = JSON.parse(selectedSectionsParam);
    } catch (e) {
      console.error("Failed to parse selectedSections:", e);
    }
  }

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
    <>
      {uiComponents.map((uiComponent: UIMessage) => {
        const Component =
          ClientComponentsRegistry[
            uiComponent.name as keyof typeof ClientComponentsRegistry
          ];

        if (uiComponent.name === "pf_analysis")
          return (
            <PfAnalysisReportMessageComponent
              key={uiComponent.id}
              analysis={uiComponent.props as unknown as PfAnalysis}
              selectedSections={selectedSections}
              personalComment={personalComment}
            />
          );
        return (
          <Component
            key={uiComponent.id}
            {...(uiComponent.props as any)}
          />
        );
      })}
    </>
  );
}
