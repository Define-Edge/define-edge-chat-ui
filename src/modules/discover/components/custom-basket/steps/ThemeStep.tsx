import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";
import { themes } from "../../../constants/basket-builder-data";

/**
 * Step 1: Choose investment theme
 * Displays theme cards for user selection
 */
export function ThemeStep() {
  const { basketConfig, updateConfig, nextStep } = useBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Choose Your Investment Theme
        </h3>
        <p className="text-sm text-text-secondary">
          What type of companies interest you most?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = basketConfig.theme === theme.id;

          return (
            <Card
              key={theme.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-accent-blue bg-blue-50"
                  : "hover:border-border-default"
              }`}
              onClick={() => updateConfig("theme", theme.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{theme.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {theme.description}
                  </p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-accent-blue" />}
              </div>
            </Card>
          );
        })}
      </div>

      {basketConfig.theme && (
        <div className="pt-4">
          <Button
            onClick={nextStep}
            className="w-full h-14 bg-accent-blue hover:bg-blue-600 text-white text-base shadow-lg"
          >
            Proceed to Investment Style
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
