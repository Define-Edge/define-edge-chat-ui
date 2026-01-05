import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownSectionProps } from "../../types/discover.types";

/**
 * Dropdown section component
 * Reusable collapsible section wrapper for grouping basket cards
 * Features header with icon, title, count badge, and expand/collapse chevron
 */
export function DropdownSection({
  title,
  icon: Icon,
  iconColor,
  count,
  isExpanded,
  onToggle,
  children,
}: DropdownSectionProps) {
  return (
    <div className="border border-border-default rounded-xl overflow-hidden bg-bg-card">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <div className="text-left">
            <h3 className="font-medium text-text-primary">{title}</h3>
            <p className="text-sm text-text-tertiary">
              {count} {count === 1 ? "strategy" : "strategies"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border-subtle bg-bg-subtle/50">
          {children}
        </div>
      )}
    </div>
  );
}
