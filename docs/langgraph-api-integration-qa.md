# Client Call Prep: LangGraph API Integration Q&A

## 1. What exactly is the API we're providing?

**A:** It's a standard LangGraph server exposing REST endpoints. The core endpoints are:

| Endpoint | Method | Purpose |
|---|---|---|
| `/info` | GET | Health check / server info |
| `/threads` | POST | Create a new conversation thread |
| `/threads/{id}` | GET | Get thread details |
| `/threads/search` | POST | List/search threads |
| `/threads/{id}/runs/stream` | POST | Send a message and stream the response |
| `/threads/{id}/runs` | POST | Send a message (non-streaming) |
| `/threads/{id}/state` | GET | Get current thread state |

The API follows the LangGraph Platform spec — any LangGraph-compatible SDK or plain HTTP calls will work.

---

## 2. What's the simplest way to integrate in a **web application** (React/Next.js/Vue)?

**A:** Use the official **`@langchain/langgraph-sdk`** npm package. Install:

```bash
npm install @langchain/langgraph-sdk
```

**Minimal example — create a thread and send a message:**

```typescript
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiUrl: "https://your-langgraph-server.com",
});

// 1. Create a thread
const thread = await client.threads.create();

// 2. Send a message and get streamed response
const stream = client.runs.stream(thread.thread_id, "agent", {
  input: {
    messages: [{ role: "human", content: "Hello!" }],
  },
  streamMode: ["values"],
});

for await (const event of stream) {
  // event.data.messages contains the conversation
  console.log(event);
}
```

**With React hooks (recommended for React apps):**

```typescript
import { useStream } from "@langchain/langgraph-sdk/react";

function Chat() {
  const stream = useStream({
    apiUrl: "https://your-langgraph-server.com",
    assistantId: "agent",
    threadId: threadId,
  });

  const sendMessage = () => {
    stream.submit({
      messages: [{ role: "human", content: "Hello!" }],
    }, { streamMode: ["values"] });
  };

  // stream.messages contains the full conversation
  return <div>{/* render messages */}</div>;
}
```

---

## 3. What's the simplest way to integrate in a **mobile application** (React Native / Flutter / Swift / Kotlin)?

**A:** Two options depending on the platform:

**Option A — React Native:** Use the same `@langchain/langgraph-sdk` package. It works in React Native since it uses standard `fetch` under the hood. The `useStream` React hook also works.

**Option B — Native iOS/Android (or Flutter):** Use plain HTTP calls. The LangGraph API is just REST + SSE (Server-Sent Events). No special SDK needed.

**Plain HTTP example (works from any language):**

```bash
# 1. Create a thread
curl -X POST https://your-langgraph-server.com/threads \
  -H "Content-Type: application/json" \
  -d '{}'

# Response: { "thread_id": "abc-123", ... }

# 2. Send a message (streaming via SSE)
curl -X POST https://your-langgraph-server.com/threads/abc-123/runs/stream \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "agent",
    "input": {
      "messages": [{"role": "human", "content": "Hello!"}]
    },
    "stream_mode": ["values"]
  }'
```

**For Swift/Kotlin:** Use any SSE (Server-Sent Events) library to consume the streaming endpoint. For non-streaming, just POST to `/threads/{id}/runs/wait` and you get a single JSON response.

**Non-streaming endpoint (simpler for mobile):**
```
POST /threads/{id}/runs/wait
```
This blocks until the agent finishes and returns the final state as JSON — no SSE parsing needed. Great for simpler mobile integrations.

---

## 4. What libraries/SDKs are available?

| Platform | Library | Install |
|---|---|---|
| JavaScript/TypeScript | `@langchain/langgraph-sdk` | `npm i @langchain/langgraph-sdk` |
| Python | `langgraph-sdk` | `pip install langgraph-sdk` |
| Any other language | Plain HTTP + SSE | No SDK needed |

The JS SDK is what we use in this project (v0.0.73+). The Python SDK has the same API surface. For other languages (Swift, Kotlin, Dart, Go), use raw HTTP — the API is straightforward REST.

---

## 5. Do they need an API key or authentication?

**A:** Since they won't have our Keycloak auth setup, it depends on how the LangGraph server is deployed:

- **LangGraph Cloud (hosted by LangChain):** They'll need a `LANGSMITH_API_KEY`, passed as `X-Api-Key` header or via the SDK's `apiKey` parameter.
- **Self-hosted LangGraph server:** No auth by default. They can add their own auth middleware if needed.
- **Our deployment for them:** We'll provide the API URL. If we add auth, we'll give them the credentials/token to pass in headers.

```typescript
// With API key
const client = new Client({
  apiUrl: "https://the-server.com",
  apiKey: "lsv2_...",
});

// With custom auth header
const client = new Client({
  apiUrl: "https://the-server.com",
  defaultHeaders: {
    "Authorization": "Bearer their-token",
  },
});
```

---

## 6. How do we handle streaming responses in the UI?

**A:** The stream endpoint returns **Server-Sent Events (SSE)**. Each event has a type and data:

```
event: values
data: {"messages": [{"role": "ai", "content": "Here is..."}]}

event: values
data: {"messages": [{"role": "ai", "content": "Here is my answer..."}]}
```

With `stream_mode: ["values"]`, each event contains the **full updated state** (all messages so far). You just replace your UI state with the latest event's messages.

**JS SDK handles this automatically:**
```typescript
for await (const event of stream) {
  setMessages(event.data.messages); // just replace with latest
}
```

**For manual SSE parsing** (mobile/other languages), use an EventSource library or parse the text/event-stream format.

---

## 7. How do we manage conversation threads (history)?

**A:** Threads are first-class in the API:

```typescript
const client = new Client({ apiUrl: "..." });

// Create a new conversation
const thread = await client.threads.create();

// List existing conversations
const threads = await client.threads.search({
  metadata: { graph_id: "agent" },
  limit: 100,
});

// Continue an existing conversation (just use the same thread_id)
const stream = client.runs.stream(existingThreadId, "agent", {
  input: { messages: [{ role: "human", content: "Follow-up question" }] },
  streamMode: ["values"],
});

// Delete a thread
await client.threads.delete(threadId);
```

Store `thread_id` on the client side (localStorage, database, etc.) to let users return to past conversations.

---

## 8. Can we use this with a backend proxy (to hide the API URL from clients)?

**A:** Yes, absolutely. This is what our project does. Create a simple API route that proxies to the LangGraph server:

```typescript
// Next.js example: app/api/[...path]/route.ts
async function proxyRequest(request) {
  const subpath = new URL(request.url).pathname.replace(/^\/api/, "");
  const targetUrl = `${LANGGRAPH_API_URL}${subpath}`;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: { "Content-Type": "application/json" },
    body: request.method !== "GET" ? await request.arrayBuffer() : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") },
  });
}
```

Then point the SDK at `/api` instead of the LangGraph server directly. This lets you inject auth server-side and avoid CORS issues.

---

## 9. What `stream_mode` options are available?

| Mode | Description | Use case |
|---|---|---|
| `["values"]` | Full state snapshot on each update | Simplest — just render latest state |
| `["messages"]` | Only new message chunks (tokens) | Token-by-token streaming for chat UIs |
| `["updates"]` | Only the diff/delta of state | Efficient for complex state |
| `["events"]` | All LangGraph internal events | Debugging, detailed tracing |

For most chat UIs, `["values"]` is the simplest. Use `["messages"]` if you want character-by-character typing effect.

---

## 10. What's the `assistant_id` / `graph_id` parameter?

**A:** This identifies which agent/graph to run on the server.

- If the server has a single agent, it's typically just `"agent"`.
- It can be a graph name (string) or a UUID (if using LangGraph Cloud assistants).
- We'll tell them what value to use for our deployment.

---

## 11. How do we handle errors and retries?

**A:** Standard HTTP error codes apply:

- `400` — Bad request (malformed input)
- `404` — Thread not found
- `422` — Validation error
- `500/502` — Server error

The SDK throws exceptions on errors. Implement standard retry logic with exponential backoff for 5xx errors. For streaming, if the connection drops mid-stream, create a new run on the same thread — the thread state is persisted server-side.

---

## 12. What about CORS for browser-based apps?

**A:** If calling the LangGraph server directly from a browser, CORS headers must be configured on the server. Two approaches:

1. **Proxy through your backend** (recommended) — avoids CORS entirely
2. **Configure CORS on the LangGraph server** — if using LangGraph Cloud, CORS is handled; if self-hosted, add CORS middleware

---

## 13. Can we send files/images along with messages?

**A:** Yes. The messages format supports multimodal content:

```typescript
stream.submit({
  messages: [{
    role: "human",
    content: [
      { type: "text", text: "What's in this image?" },
      { type: "image_url", image_url: { url: "data:image/png;base64,..." } },
    ],
  }],
}, { streamMode: ["values"] });
```

---

## 14. Is there a Python equivalent for backend integration?

**A:**

```python
from langgraph_sdk import get_client

client = get_client(url="https://your-langgraph-server.com")

# Create thread
thread = await client.threads.create()

# Stream a response
async for event in client.runs.stream(
    thread["thread_id"],
    "agent",
    input={"messages": [{"role": "human", "content": "Hello!"}]},
    stream_mode=["values"],
):
    print(event.data)
```

---

## 15. What's the minimum integration for a quick POC?

**A:** A single HTML file with no build tools:

```html
<script type="module">
  import { Client } from "https://esm.sh/@langchain/langgraph-sdk";

  const client = new Client({ apiUrl: "https://your-server.com" });
  const thread = await client.threads.create();
  
  const stream = client.runs.stream(thread.thread_id, "agent", {
    input: { messages: [{ role: "human", content: "Hello" }] },
    streamMode: ["values"],
  });

  for await (const event of stream) {
    const msgs = event.data?.messages;
    if (msgs) document.body.innerText = msgs[msgs.length - 1].content;
  }
</script>
```

No build step, no framework, works in any modern browser.

---

**Key takeaway:** It's just REST + SSE — any language/platform can integrate via HTTP, and JS/Python have official SDKs that make it even easier.
