import { Card } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";

/**
 * Information card explaining how user data is used and protected
 * Displays security guarantees and data handling policies
 */
export function DataSecurityInfo() {
  return (
    <Card className="border-green-200 bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-lg bg-green-100 p-2">
          <Shield className="h-5 w-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 font-medium text-green-900">
            How We Use Your Data
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <p className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>
                Your data is processed locally and encrypted with bank-level
                security
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>
                We analyze patterns to provide personalized investment
                recommendations
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>
                No data is shared with third parties without your explicit
                consent
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>
                You maintain full control and can disconnect accounts anytime
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
