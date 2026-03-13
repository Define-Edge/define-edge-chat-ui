import BottomNavbar from "@/components/layouts/BottomNavbar";
import Navbar from "@/components/layouts/Navbar";
import { NavigationShell } from "@/components/layouts/NavigationShell";
import { SideNavStrip } from "@/components/layouts/SideNavStrip";
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
          <SideNavStrip />
          <div className="flex min-h-dvh flex-col md:pl-10">
            <Navbar />
            {children}
            <BottomNavbar />
          </div>
        </NavigationShell>
      </ClientProviders>
    </React.Suspense>
  );
}
