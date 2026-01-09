"use client";

import { NavigationMenu } from "@/components/navigation/NavigationMenu";
import ThreadHistory from "@/components/thread/history";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import appConfig from "@/configs/app.config";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ReactNode } from "react";

interface NavigationShellProps {
  children: ReactNode;
}

/**
 * Navigation shell component that wraps all main app pages
 * Provides a Sheet-based sidebar for all screen sizes
 * Composes NavigationMenu and ThreadHistory
 * Simpler than AppLayout - no complex animations or positioning
 */
export function NavigationShell({ children }: NavigationShellProps) {
  const [sidebarOpen, setSidebarOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo and App Name */}
          <Link
            href="/"
            className="flex items-center gap-3 px-6 pt-6 pb-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold tracking-tight">
              {appConfig.appName}
            </span>
          </Link>

          {/* Navigation buttons */}
          <div className="pb-4">
            <NavigationMenu />
          </div>

          {/* Thread history */}
          <div className="flex-1 overflow-hidden">
            <ThreadHistory />
          </div>
        </SheetContent>
      </Sheet>

      {children}
    </>
  );
}
