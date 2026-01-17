import { useMutualFundBasketBuilderContext } from "../../../hooks/useMutualFundBasketBuilderContext";
import { MutualFundBasketForm } from "./MutualFundBasketForm";
import { MutualFundBasketResults } from "./MutualFundBasketResults";

/**
 * Mutual fund basket flow orchestrator
 * Conditionally renders form or results based on state
 */
export function MutualFundBasketFlow() {
  const { showResults } = useMutualFundBasketBuilderContext();

  return showResults ? <MutualFundBasketResults /> : <MutualFundBasketForm />;
}
