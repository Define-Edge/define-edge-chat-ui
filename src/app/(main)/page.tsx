"use client";

import { Thread } from "@/components/thread";
import { ArtifactProvider } from "@/components/thread/artifact";
import useDetectKeyboardOpen from "@/hooks/useDetectKeyboardOpen";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const isKeyboardOpen = useDetectKeyboardOpen();

  return (
    <div
      className={cn(
        "md:h-[calc(100dvh-4rem)]",
        isKeyboardOpen
          ? "h-[calc(100dvh-4rem)]"
          : "h-[calc(100dvh-4rem-var(--bottom-navbar-height))]",
      )}
    >
      <ArtifactProvider>
        <Thread />
      </ArtifactProvider>
    </div>
  );
}
