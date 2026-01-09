import { ClientProviders } from "@/components/providers/ClientProviders";
import { NavigationShell } from "@/components/layouts/NavigationShell";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ClientProviders>
        <NavigationShell>{children}</NavigationShell>
      </ClientProviders>
    </React.Suspense>
  );
}
