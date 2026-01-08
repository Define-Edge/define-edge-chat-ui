"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import ThreadHistory from "@/components/thread/history";
import FetchingFiDataModal from "@/components/moneyone/FetchingFiDataModal";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout component with ThreadHistory sidebar
 * Used across chat, import, and discover pages
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [chatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();

  // Check if we're on a report/download page that needs scrolling
  const isReportPage = pathname?.includes('/download-message/');

  return (
    <div className={`flex w-full ${isReportPage ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      <FetchingFiDataModal />

      {/* Sidebar */}
      <div className="relative hidden lg:flex">
        <motion.div
          className="absolute z-20 h-full overflow-hidden border-r"
          style={{ width: 300 }}
          animate={
            isLargeScreen
              ? { x: chatHistoryOpen ? 0 : -300 }
              : { x: chatHistoryOpen ? 0 : -300 }
          }
          initial={{ x: -300 }}
          transition={
            isLargeScreen
              ? { type: "spring", stiffness: 300, damping: 30 }
              : { duration: 0 }
          }
        >
          <div
            className="relative h-full"
            style={{ width: 300 }}
          >
            <ThreadHistory />
          </div>
        </motion.div>
      </div>

      {/* Main content area */}
      <motion.div
        className={`relative flex min-w-0 flex-1 flex-col ${isReportPage ? 'overflow-auto' : 'overflow-hidden'}`}
        layout={isLargeScreen}
        animate={{
          marginLeft: chatHistoryOpen ? (isLargeScreen ? 300 : 0) : 0,
          width: chatHistoryOpen
            ? isLargeScreen
              ? "calc(100% - 300px)"
              : "100%"
            : "100%",
        }}
        transition={
          isLargeScreen
            ? { type: "spring", stiffness: 300, damping: 30 }
            : { duration: 0 }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
