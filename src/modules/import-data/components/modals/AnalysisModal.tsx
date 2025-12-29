import { TrendingUp, CreditCard, PieChart, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisModalProps } from "../../types/import-data.types";

export function AnalysisModal({ isOpen, onClose, analysisType, analysisData }: AnalysisModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {analysisType} Analysis
          </DialogTitle>
          <DialogDescription>
            View detailed analysis and insights for your {analysisType.toLowerCase()} with personalized recommendations and key metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {analysisType === "Comprehensive Analysis" ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">Overall Financial Health Score</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">78/100</span>
                </div>
                <p className="text-sm text-gray-700">Your financial health is good with room for improvement in diversification.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-900">Cash Flow</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">+₹45,230</div>
                  <div className="text-xs text-gray-500">Monthly avg</div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-gray-900">Portfolio</span>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">₹12.4L</div>
                  <div className="text-xs text-gray-500">Total value</div>
                </Card>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge className="text-xs bg-green-50 text-green-700 border-green-200">Strength</Badge>
                    <p className="text-sm text-gray-700">Consistent SIP investments showing discipline</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Opportunity</Badge>
                    <p className="text-sm text-gray-700">Consider increasing equity allocation by 10%</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">Action</Badge>
                    <p className="text-sm text-gray-700">Create emergency fund worth 6 months expenses</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Increase equity exposure to 70%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Set up automated tax-saving investments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Review and consolidate mutual funds</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">Analysis Summary</h3>
                <p className="text-sm text-gray-700">
                  {analysisType === "Equity Holdings" && "Your equity portfolio shows good diversification across sectors with 65% large-cap and 35% mid-cap allocation. Average holding period is 18 months."}
                  {analysisType === "Mutual Fund Holdings" && "Your mutual fund portfolio has an average expense ratio of 1.2% with consistent performance over 3 years. SIP discipline is excellent."}
                  {analysisType === "Fixed Deposits" && "Your fixed deposits are well-laddered with an average rate of 6.8%. Consider optimizing maturity dates for better liquidity management."}
                  {analysisType === "NPS" && "Your NPS contributions are on track with 70% equity allocation. Projected retirement corpus shows healthy growth trajectory."}
                  {analysisType === "Insurance" && "Insurance coverage analysis shows adequate life cover of 10x annual income. Health insurance has sufficient sum assured with good claim history."}
                  {analysisType === "Bank Accounts" && "Your spending patterns show healthy financial habits with consistent savings. Average monthly savings rate is 32%."}
                  {analysisType === "Real Estate" && "Property portfolio valued at ₹85L with rental yield of 3.2%. Market appreciation has been steady at 8% CAGR over 5 years."}
                  {analysisType === "Commodities" && "Gold allocation represents 8% of total portfolio, providing good hedge against inflation. Average purchase price is optimal."}
                  {analysisType === "Other Investments" && "Alternative investments show good diversification with 12% allocation across global stocks, crypto, and unlisted securities. Risk-return profile is balanced."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {analysisType === "Equity Holdings" && "₹12.4L"}
                    {analysisType === "Mutual Fund Holdings" && "12.8%"}
                    {analysisType === "Fixed Deposits" && "₹8.5L"}
                    {analysisType === "NPS" && "₹3.2L"}
                    {analysisType === "Insurance" && "₹25L"}
                    {analysisType === "Bank Accounts" && "₹52,340"}
                    {analysisType === "Real Estate" && "₹85L"}
                    {analysisType === "Commodities" && "₹2.1L"}
                    {analysisType === "Other Investments" && "₹3.8L"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {analysisType === "Equity Holdings" && "Portfolio value"}
                    {analysisType === "Mutual Fund Holdings" && "CAGR"}
                    {analysisType === "Fixed Deposits" && "Total deposits"}
                    {analysisType === "NPS" && "Current corpus"}
                    {analysisType === "Insurance" && "Total coverage"}
                    {analysisType === "Bank Accounts" && "Monthly savings"}
                    {analysisType === "Real Estate" && "Property value"}
                    {analysisType === "Commodities" && "Gold & others"}
                    {analysisType === "Other Investments" && "Alternative assets"}
                  </div>
                </Card>

                <Card className="p-3 text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {analysisType === "Equity Holdings" && "16.8%"}
                    {analysisType === "Mutual Fund Holdings" && "1.2%"}
                    {analysisType === "Fixed Deposits" && "6.8%"}
                    {analysisType === "NPS" && "11.2%"}
                    {analysisType === "Insurance" && "10x"}
                    {analysisType === "Bank Accounts" && "32%"}
                    {analysisType === "Real Estate" && "8.0%"}
                    {analysisType === "Commodities" && "8%"}
                    {analysisType === "Other Investments" && "15.2%"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {analysisType === "Equity Holdings" && "Avg returns"}
                    {analysisType === "Mutual Fund Holdings" && "Expense ratio"}
                    {analysisType === "Fixed Deposits" && "Avg interest"}
                    {analysisType === "NPS" && "Projected CAGR"}
                    {analysisType === "Insurance" && "Income multiple"}
                    {analysisType === "Bank Accounts" && "Savings rate"}
                    {analysisType === "Real Estate" && "Appreciation CAGR"}
                    {analysisType === "Commodities" && "Portfolio allocation"}
                    {analysisType === "Other Investments" && "Overall allocation"}
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Recommendations</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      {analysisType === "Equity Holdings" && "Consider rebalancing towards small-cap funds"}
                      {analysisType === "Mutual Fund Holdings" && "Consolidate similar category funds"}
                      {analysisType === "Fixed Deposits" && "Ladder maturity dates for better liquidity"}
                      {analysisType === "NPS" && "Increase equity allocation to 75% for better returns"}
                      {analysisType === "Insurance" && "Review and update nominees for all policies"}
                      {analysisType === "Bank Accounts" && "Set up automated recurring deposits"}
                      {analysisType === "Real Estate" && "Consider REITs for diversified exposure"}
                      {analysisType === "Commodities" && "Maintain 5-10% allocation for portfolio balance"}
                      {analysisType === "Other Investments" && "Diversify further with international exposure"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      {analysisType === "Equity Holdings" && "Add international equity exposure"}
                      {analysisType === "Mutual Fund Holdings" && "Switch to direct plans to reduce costs"}
                      {analysisType === "Fixed Deposits" && "Explore higher-yield corporate bonds"}
                      {analysisType === "NPS" && "Maximize annual contribution limit of ₹2L"}
                      {analysisType === "Insurance" && "Consider topping up health insurance coverage"}
                      {analysisType === "Bank Accounts" && "Review and reduce subscription expenses"}
                      {analysisType === "Real Estate" && "Consider refinancing existing home loans"}
                      {analysisType === "Commodities" && "Use gold ETFs for better liquidity"}
                      {analysisType === "Other Investments" && "Review crypto allocation and risk management"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1">
            Export Report
          </Button>
          <Button size="sm" className="flex-1" onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
