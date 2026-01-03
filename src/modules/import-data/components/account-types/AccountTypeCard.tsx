"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormModal } from "../shared/FormModal";

type AccountTypeCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  formDescription: string;
  formIcon: string;
  formComponent?: React.ReactNode;
  status?: "not-connected" | "connected" | "coming-soon" | "connecting";
  statusIcon?: React.ElementType;
};

/**
 * Generic account type card component for UI-only forms
 * Displays basic info and connect button that opens a form modal
 */
export function AccountTypeCard({
  icon: Icon,
  title,
  description,
  formDescription,
  formIcon,
  formComponent,
  status = "not-connected",
  statusIcon: StatusIcon,
}: AccountTypeCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow border border-gray-200 h-full gap-0">
      <div className="flex items-start gap-3 h-full">
        <div className="p-2 rounded-lg flex-shrink-0 bg-gray-50">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            {StatusIcon && <StatusIcon className="w-4 h-4 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-600 break-words">{description}</p>

          {/* Action Button */}
          <div className="flex items-center gap-2 mt-auto pt-3">
            {status === "not-connected" && formComponent ? (
              <FormModal
                title={`Add ${title}`}
                description={formDescription}
                icon={formIcon}
              >
                {formComponent}
              </FormModal>
            ) : status === "connected" ? (
              <Button size="sm" variant="outline" className="text-xs" disabled>
                Connected
              </Button>
            ) : status === "connecting" ? (
              <Button size="sm" variant="outline" className="text-xs" disabled>
                Connecting...
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="text-xs" disabled>
                Coming Soon
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
