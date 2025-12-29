import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CollapsibleInstructionsProps } from "../../types/import-data.types";

export function CollapsibleInstructions({
  title,
  description,
  icon: Icon,
  bgColor,
  iconBgColor,
  textColor,
  iconColor,
  defaultExpanded = false
}: CollapsibleInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`${bgColor} border-opacity-60 transition-all duration-200 max-w-md`}>
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`${iconBgColor} p-2 rounded-lg flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${textColor} ${isExpanded ? 'mb-2' : ''}`}>{title}</h3>
            <div className="flex-shrink-0 ml-2">
              {isExpanded ? (
                <ChevronUp className={`w-4 h-4 ${iconColor}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${iconColor}`} />
              )}
            </div>
          </div>
          {isExpanded && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <p className={`text-sm ${textColor.replace('text-', 'text-').replace('-900', '-800')} leading-relaxed break-words`}>
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
