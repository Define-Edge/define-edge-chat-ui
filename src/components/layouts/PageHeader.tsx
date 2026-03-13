"use client";

import { Button } from "@/components/ui/button";
import { PanelRightClose } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

/**
 * Reusable page header component with consistent styling
 * - Left: Sidebar toggle button + Title
 * - Right: Optional children (actions, buttons, etc.)
 */
export function PageHeader({ title, children }: PageHeaderProps) {
  const [, setSidebarOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  return (
    <div className="sticky top-0 z-10 bg-gray-50 border-b">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-gray-100 md:hidden"
          >
            <PanelRightClose className="size-5" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
