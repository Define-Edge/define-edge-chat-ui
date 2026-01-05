"use client";

import { ReactNode } from "react";
import { ThreadProvider } from "@/providers/Thread";
import { StreamProvider } from "@/providers/Stream";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Toaster } from "@/components/ui/sonner";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <Toaster />
      <ThreadProvider>
        <StreamProvider>
          <AppLayout>{children}</AppLayout>
        </StreamProvider>
      </ThreadProvider>
    </>
  );
}
