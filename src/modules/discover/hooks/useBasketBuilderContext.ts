import { useContext } from "react";
import { BasketBuilderContext } from "../providers/BasketBuilderProvider";

/**
 * Hook to access basket builder context
 * Must be used within BasketBuilderProvider
 */
export function useBasketBuilderContext() {
  const context = useContext(BasketBuilderContext);

  if (!context) {
    throw new Error(
      "useBasketBuilderContext must be used within BasketBuilderProvider"
    );
  }

  return context;
}
