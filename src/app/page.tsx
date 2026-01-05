"use client";

import { Thread } from "@/components/thread";
import { ArtifactProvider } from "@/components/thread/artifact";

export default function ChatPage() {
  return (
    <ArtifactProvider>
      <Thread />
    </ArtifactProvider>
  );
}
