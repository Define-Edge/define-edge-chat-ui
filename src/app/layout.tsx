import { ClientProviders } from "@/components/providers/ClientProviders";
import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "FinSharpeGPT",
  description: "Finance Agents by FinSharpe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <QueryProvider>
          <NuqsAdapter>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ClientProviders>{children}</ClientProviders>
            </React.Suspense>
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
