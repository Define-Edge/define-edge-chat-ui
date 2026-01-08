import { ClientProviders } from "@/components/providers/ClientProviders";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ClientProviders>{children}</ClientProviders>
    </React.Suspense>
  );
}
