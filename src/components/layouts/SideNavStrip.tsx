"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Compass, Database, History, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";

const NAV_ITEMS = [
  { href: "/", icon: Plus, label: "New Chat", exact: true },
  { href: "/import", icon: Database, label: "Import", exact: false },
  { href: "/discover", icon: Compass, label: "Discover", exact: false },
  { href: "/history", icon: History, label: "Memory", exact: false },
] as const;

export function SideNavStrip() {
  const pathname = usePathname();
  const [, setSidebarOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  return (
    <div className="fixed left-0 top-0 z-10 hidden h-full w-10 flex-col items-center bg-slate-900 py-2 md:flex">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
        className="mb-2 text-white hover:bg-slate-800 hover:text-white"
      >
        <Menu className="size-5" />
      </Button>

      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname.startsWith(href);
        return (
          <Tooltip key={href}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={label}
                className={
                  isActive
                    ? "text-blue-400 hover:bg-slate-800 hover:text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
                asChild
              >
                <Link href={href}>
                  <Icon className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
