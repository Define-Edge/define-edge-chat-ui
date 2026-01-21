"use client";

import { CollapsibleInstructions } from "@/modules/core/common/ui/CollapsibleInstructions";
import { Database } from "lucide-react";
import ThreadHistoryList from "@/modules/history/components/ThreadHistoryList";

export default function page() {
  return (
    <div className="mx-auto max-w-4xl min-w-0 space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-foreground text-2xl font-semibold">Memory</h2>
        <p className="text-muted-foreground text-sm">
          Resume your previous conversations
        </p>
      </div>
      {/* What is Memory Section */}
      <CollapsibleInstructions
        title="Long-term Chat Memory"
        description="Your AI assistant remembers everything about previous conversations, saved investment portfolios, research reports, and enables follow-up questions on your chat history."
        icon={Database}
        bgColor="bg-green-50 border-green-200"
        iconBgColor="bg-green-100"
        textColor="text-green-900"
        iconColor="text-green-600"
        defaultExpanded={true}
      />

      <div className="mt-8">
        <ThreadHistoryList />
      </div>
    </div>
  );
}
