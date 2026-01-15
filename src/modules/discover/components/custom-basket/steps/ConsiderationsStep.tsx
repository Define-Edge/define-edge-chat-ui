import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, MessageCircle } from "lucide-react";
import { useBasketBuilderContext } from "../../../hooks/useBasketBuilderContext";

/**
 * Step 6: Specific considerations
 * Allows user to add custom requirements and exclusions
 */
export function ConsiderationsStep() {
  const { basketConfig, updateConfig, handleComplete } =
    useBasketBuilderContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Specific Considerations
        </h3>
        <p className="text-sm text-text-secondary">
          Tell us any specific requirements or exclusions for your basket
        </p>
      </div>

      <Card className="p-4 bg-info-bg border-info-border">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-info-icon mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-info-foreground mb-2">
              Examples of what you can specify:
            </h4>
            <ul className="text-sm text-info-foreground space-y-1">
              <li>• Exclude companies involved in alcohol or tobacco business</li>
              <li>• Focus on companies with strong dividend history</li>
              <li>• Include only companies with women leadership</li>
              <li>• Prefer companies with low debt-to-equity ratio</li>
              <li>• Exclude companies with recent controversies</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Share any specific requirements, exclusions, or preferences for your investment basket..."
            value={basketConfig.specificConsiderations}
            onChange={(e) =>
              updateConfig("specificConsiderations", e.target.value)
            }
              className="min-h-32 bg-gray-100 text-base resize-none pr-12 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
          />
          <div className="absolute bottom-3 right-3">
            <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="text-xs text-text-muted text-center bg-bg-subtle p-3 rounded-lg">
          💡 This step is optional. You can skip if you don't have specific
          requirements, or add details to get a more personalized basket.
        </div>

        {basketConfig.specificConsiderations && (
          <div className="p-3 bg-success-bg border border-success-border rounded-lg">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success-fg mt-0.5" />
              <div>
                <p className="text-sm text-success-fg font-medium">
                  Requirements noted!
                </p>
                <p className="text-xs text-success-fg">
                  We'll apply these considerations when generating your basket.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button
          onClick={handleComplete}
          className="w-full h-14 bg-success-fg hover:bg-green-700 text-white text-base shadow-lg"
        >
          Create My Custom Basket
          <Check className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
