import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
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
        <AuthProvider>
          <QueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
