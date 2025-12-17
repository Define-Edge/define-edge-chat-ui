"use client"
import React, { ReactNode, useContext } from "react";

type TotalPageCtxValue = number

const TotalPageCtx = React.createContext<null | TotalPageCtxValue>(null);

type Props = {
  children: ReactNode;
  value: TotalPageCtxValue;
};

export default function TotalPageCtxProvider({ value, children }: Props) {
  return (
    <TotalPageCtx.Provider value={value}>{children}</TotalPageCtx.Provider>
  );
}

export function useTotalPageCtx() {
  const ctx = useContext(TotalPageCtx);
  if (!ctx) throw new Error("Ctx not found");

  return ctx;
}
