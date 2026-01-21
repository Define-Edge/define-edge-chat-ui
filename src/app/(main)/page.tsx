"use client";

import { Thread } from "@/components/thread";
import { ArtifactProvider } from "@/components/thread/artifact";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem-var(--bottom-navbar-height))] md:h-[calc(100vh-4rem)]">
      <ArtifactProvider>
        <Thread />
      </ArtifactProvider>
    </div>
  );
}
