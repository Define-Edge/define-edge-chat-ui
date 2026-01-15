"use client";

import { BasketBuilderProvider } from "../../providers/BasketBuilderProvider";
import { useBasketBuilderContext } from "../../hooks/useBasketBuilderContext";
import { CustomBasketForm } from "./CustomBasketForm";
import { CustomBasketResults } from "./CustomBasketResults";

/**
 * Main orchestrator for custom basket builder
 * Conditionally renders form or results based on state
 */
function BasketBuilderContent() {
  const { showResults } = useBasketBuilderContext();

  return showResults ? <CustomBasketResults /> : <CustomBasketForm />;
}

/**
 * Custom basket builder page with provider wrapper
 */
export function CustomBasketBuilderPage() {
  return (
    <BasketBuilderProvider>
      <BasketBuilderContent />
    </BasketBuilderProvider>
  );
}
