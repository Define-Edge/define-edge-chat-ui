"use client";

import { Button } from "@/components/ui/button";
import { Compass, Database, History, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Navigation menu with main app navigation buttons
 * Separated from ThreadHistory for better composability
 */
export function NavigationMenu() {
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/">
          <Plus className="size-4" />
          New chat
        </Link>
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/import">
          <Database className="size-4" />
          Import
        </Link>
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/discover">
          <Compass className="size-4" />
          Discover
        </Link>
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/history">
          <History className="size-4" />
          Memory
        </Link>
      </Button>
    </div>
  );
}
