import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComprehensiveAnalysisCard() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 p-1">
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Comprehensive Portfolio Analysis
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Get a complete overview of your financial health across all
            connected accounts with AI-powered insights and personalized
            recommendations.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full border-0 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white hover:from-slate-950 hover:via-blue-950 hover:to-blue-800"
          type="button"
        >
          <Activity className="mr-2 h-5 w-5" />
          Run Comprehensive Analysis
        </Button>
      </div>
    </div>
  );
}
