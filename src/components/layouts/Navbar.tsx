"use client";
import appConfig from "@/configs/app.config";
import { PanelRightClose } from "lucide-react";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "../ui/button";

export default function Navbar() {
  const [, setSidebarOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );
  return (
    <div className="sticky top-0 z-50 h-16 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="flex h-full items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="hidden text-blue-600 hover:bg-slate-900 hover:text-blue-500 md:block"
        >
          <PanelRightClose className="size-5" />
        </Button>

        <div className="w-9 md:hidden" />
        <Link
          href="/"
          title="New Chat"
          className="flex items-center justify-center"
        >
          <h1 className="text-secondary text-lg font-semibold">
            {appConfig.appName}
          </h1>
        </Link>
        <div className="w-9" />
      </div>
    </div>
  );
}
