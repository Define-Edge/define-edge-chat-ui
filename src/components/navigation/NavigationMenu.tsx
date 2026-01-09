"use client";

import { Button } from "@/components/ui/button";
import { Compass, Database, Plus } from "lucide-react";
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
          <Plus className="h-4 w-4" />
          New chat
        </Link>
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/import">
          <Database className="h-4 w-4" />
          Import
        </Link>
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 shadow-md"
        asChild
      >
        <Link href="/discover">
          <Compass className="h-4 w-4" />
          Discover
        </Link>
      </Button>
    </div>
  );
}
