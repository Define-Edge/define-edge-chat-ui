"use client";

import Image from "next/image";
import appConfig from "@/configs/app.config";

export default function WelcomeFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} />
          <span className="font-semibold text-primary-main-dark">
            {appConfig.appName}
          </span>
        </div>
        <p className="text-sm text-text-tertiary">
          Finance Agents by FinSharpe
        </p>
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} FinSharpe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
