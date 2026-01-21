import { useQuery } from "@tanstack/react-query";
import { useApiUrl, useAssistantId } from "@/hooks/useDefaultApiValues";
import { getApiKey } from "@/lib/api-key";
import { Thread } from "@langchain/langgraph-sdk";
import { createClient } from "@/providers/client";
import { validate } from "uuid";

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function useThreadsQuery() {
  const [apiUrl] = useApiUrl();
  const [assistantId] = useAssistantId();

  return useQuery({
    queryKey: ["threads", apiUrl, assistantId],
    queryFn: async (): Promise<Thread[]> => {
      if (!apiUrl || !assistantId) return [];
      const client = createClient(apiUrl, getApiKey() ?? undefined);

      const threads = await client.threads.search({
        metadata: {
          ...getThreadSearchMetadata(assistantId),
        },
        limit: 100,
      });

      return threads;
    },
    enabled: !!apiUrl && !!assistantId,
  });
}
