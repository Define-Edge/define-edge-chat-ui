import { useStockBasketBuilderContext } from "../../../hooks/useStockBasketBuilderContext";
import { StockBasketForm } from "./StockBasketForm";
import { StockBasketResults } from "./StockBasketResults";

/**
 * Stock basket flow orchestrator
 * Conditionally renders form or results based on state
 */
export function StockBasketFlow() {
  const { showResults } = useStockBasketBuilderContext();

  return showResults ? <StockBasketResults /> : <StockBasketForm />;
}
