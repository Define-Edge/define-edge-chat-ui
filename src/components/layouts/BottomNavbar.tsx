"use client";
import React from "react";
import { Search, List, TrendingUp, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();
  const tabs = [
    { id: "chat", icon: Search, label: "Chat", href: "/" },
    { id: "discover", icon: TrendingUp, label: "Discover", href: "/discover" },
    { id: "import", icon: Upload, label: "Import", href: "/import" },
    { id: "history", icon: List, label: "Memory", href: "/history" },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 h-[var(--bottom-navbar-height)] bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 px-4 pt-3 pb-2 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const activeTab = pathname === tab.href;
          return (
            <Link
              href={tab.href}
              key={tab.id}
              className={`flex transform flex-col items-center space-y-1 rounded-xl p-2 transition-all duration-200 hover:scale-105 ${
                activeTab
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-white/80 hover:bg-white/15 hover:text-white hover:shadow-md"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
