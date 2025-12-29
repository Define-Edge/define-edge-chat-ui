import { CheckCircle, AlertCircle, Clock, RefreshCw, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportMethodProps } from "../../types/import-data.types";
import { ReactNode } from "react";

export function ImportMethod({
  icon: Icon,
  title,
  description,
  status,
  lastUpdated,
  onConnect,
  onAnalyse,
  onRefresh,
  customButton
}: ImportMethodProps & { customButton?: ReactNode }) {
  const getStatusColor = () => {
    switch (status) {
      case "connected": return "text-green-500";
      case "pending": return "text-yellow-500";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected": return CheckCircle;
      case "pending": return AlertCircle;
      default: return null;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border border-gray-200 h-full gap-0">
      <div className="flex items-start gap-3 h-full">
        <div className={`p-2 rounded-lg flex-shrink-0 ${status === "connected" ? "bg-green-50" : "bg-gray-50"}`}>
          <Icon className={`w-6 h-6 ${status === "connected" ? "text-green-500" : "text-gray-600"}`} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            {StatusIcon && <StatusIcon className={`w-4 h-4 ${getStatusColor()} flex-shrink-0`} />}
          </div>
          <p className="text-sm text-gray-600 break-words">{description}</p>

          {/* Last Updated Info */}
          {status === "connected" && lastUpdated && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Updated {lastUpdated}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-3">
            {/* Left side - Status and primary action */}
            <div className="flex items-center gap-2">
              {customButton ? (
                // Use custom button if provided (e.g., ImportHoldings)
                customButton
              ) : status === "available" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onConnect}
                  className="text-xs"
                >
                  Connect
                </Button>
              ) : status === "connected" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">Connected</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRefresh}
                    className="text-xs p-1.5"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              ) : status === "pending" ? (
                <span className="text-xs text-yellow-600 font-medium">Connecting...</span>
              ) : null}
            </div>

            {/* Right side - Always analyse button */}
            <Button
              size="sm"
              variant={status === "connected" ? "default" : "ghost"}
              onClick={onAnalyse}
              className="text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Analyse
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
