/**
 * Generate basket name based on investment style
 */
export function generateBasketName(investmentStyle: string): string {
  const styleNames: Record<string, string> = {
    growth: "Growth-Focused Investment Basket",
    value: "Value Investment Basket",
    momentum: "Momentum Investment Basket",
    quality: "Quality-Focused Investment Basket",
  };

  return styleNames[investmentStyle] || "Custom Stock Basket";
}
