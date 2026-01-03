import { Message } from "@langchain/langgraph-sdk";

export interface Todo {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm?: string;
}

/**
 * Extracts todos from AI messages and associates them with the corresponding human message.
 *
 * Algorithm:
 * 1. Iterate through messages
 * 2. When we find a human message, track its index
 * 3. For subsequent AI messages (until the next human message), look for write_todos tool calls
 * 4. Keep only the LAST write_todos tool call for each human message (most recent state)
 * 5. Return a map of humanMessageId -> todos
 */
export function extractTodosFromMessages(
  messages: Message[]
): Map<string, Todo[]> {
  const todosMap = new Map<string, Todo[]>();
  let currentHumanMessageId: string | null = null;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (message.type === "human") {
      currentHumanMessageId = message.id || null;
    } else if (message.type === "ai" && currentHumanMessageId) {
      // Check if this AI message has tool_calls
      if (message.tool_calls && Array.isArray(message.tool_calls)) {
        // Look for write_todos tool call
        const writeTodosCalls = message.tool_calls.filter(
          (tc) => tc.name === "write_todos"
        );

        // If we found write_todos calls, use the last one (most recent)
        if (writeTodosCalls.length > 0) {
          const lastWriteTodosCall =
            writeTodosCalls[writeTodosCalls.length - 1];

          if (lastWriteTodosCall.args?.todos) {
            // Store the todos for this human message
            // This will overwrite any previous todos for the same human message
            // ensuring we always have the latest state
            todosMap.set(currentHumanMessageId, lastWriteTodosCall.args.todos);
          }
        }
      }
    }
  }

  return todosMap;
}

/**
 * Gets the todos associated with a specific human message
 */
export function getTodosForMessage(
  messages: Message[],
  messageId: string
): Todo[] | undefined {
  const todosMap = extractTodosFromMessages(messages);
  return todosMap.get(messageId);
}
