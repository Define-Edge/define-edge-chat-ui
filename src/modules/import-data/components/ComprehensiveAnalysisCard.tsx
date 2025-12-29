import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComprehensiveAnalysisCardProps {
  onAnalyse: () => void;
}

export function ComprehensiveAnalysisCard({ onAnalyse }: ComprehensiveAnalysisCardProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 p-1 rounded-xl">
      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 rounded-full mb-3">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Portfolio Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get a complete overview of your financial health across all connected accounts with AI-powered insights and personalized recommendations.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 hover:from-slate-950 hover:via-blue-950 hover:to-blue-800 text-white border-0"
          onClick={onAnalyse}
        >
          <Activity className="w-5 h-5 mr-2" />
          Run Comprehensive Analysis
        </Button>
      </div>
    </div>
  );
}
