import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CollapsibleInstructionsProps } from "../../../import-data/types/import-data.types";

export function CollapsibleInstructions({
  title,
  description,
  icon: Icon,
  bgColor,
  iconBgColor,
  textColor,
  iconColor,
  defaultExpanded = false,
}: CollapsibleInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card
      className={`${bgColor} border-opacity-60 transition-all duration-200 ${isExpanded ? "h-full" : "h-fit"}`}
    >
      <div
        className="flex cursor-pointer items-start gap-3 p-4 transition-opacity hover:opacity-90"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`${iconBgColor} flex-shrink-0 rounded-lg p-2`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-medium ${textColor} ${isExpanded ? "mb-2" : ""}`}
            >
              {title}
            </h3>
            <div className="ml-2 flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className={`h-4 w-4 ${iconColor}`} />
              ) : (
                <ChevronDown className={`h-4 w-4 ${iconColor}`} />
              )}
            </div>
          </div>
          {isExpanded && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <p
                className={`text-sm ${textColor.replace("text-", "text-").replace("-900", "-800")} leading-relaxed break-words`}
              >
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
