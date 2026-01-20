import Navbar from "@/components/layouts/Navbar";
import { NavigationShell } from "@/components/layouts/NavigationShell";
import { ClientProviders } from "@/components/providers/ClientProviders";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ClientProviders>
        <NavigationShell>
          <Navbar />
          {children}
        </NavigationShell>
      </ClientProviders>
    </React.Suspense>
  );
}
