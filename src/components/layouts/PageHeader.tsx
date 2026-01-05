"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

interface PageHeaderProps {
  title?: string;
}

/**
 * Shared page header with sidebar toggle
 * Used on import and discover pages
 */
export function PageHeader({ title }: PageHeaderProps) {
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-white p-4">
      <div className="flex items-center gap-4">
        {(!chatHistoryOpen || !isLargeScreen) && (
          <Button
            className="hover:bg-gray-100"
            variant="ghost"
            onClick={() => setChatHistoryOpen((p) => !p)}
          >
            {chatHistoryOpen ? (
              <PanelRightOpen className="size-5" />
            ) : (
              <PanelRightClose className="size-5" />
            )}
          </Button>
        )}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>
    </div>
  );
}
