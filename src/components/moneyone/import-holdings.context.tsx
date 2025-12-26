"use client";
import { ImportHoldingsContextType } from "@/lib/moneyone/moneyone.types";
import { createContext, PropsWithChildren, useContext } from "react";

const ImportHoldingsContext = createContext<
  ImportHoldingsContextType | undefined
>(undefined);

export function ImportHoldingsProvider({
  children,
  ...props
}: ImportHoldingsContextType & PropsWithChildren) {
  return (
    <ImportHoldingsContext.Provider value={props}>
      {children}
    </ImportHoldingsContext.Provider>
  );
}

export function useImportHoldingsContext() {
  const context = useContext(ImportHoldingsContext);
  if (context === undefined) {
    throw new Error(
      "useImportHoldingsContext must be used within a ImportHoldingsProvider"
    );
  }
  return context;
}
