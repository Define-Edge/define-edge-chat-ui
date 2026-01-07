import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PortfolioHolding } from "@/api/generated/strategy-apis/models";

interface StrategyHoldingsTabProps {
  holdings: PortfolioHolding[];
}

/**
 * Strategy Holdings Tab Component
 * Displays portfolio holdings in a table with weights, prices, and changes
 * Component size: ~120 lines
 */
export function StrategyHoldingsTab({ holdings }: StrategyHoldingsTabProps) {
  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">Portfolio Holdings</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Stock</TableHead>
                <TableHead className="hidden md:table-cell text-left">Industry</TableHead>
                <TableHead className="hidden md:table-cell text-left">Size</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Market Cap</TableHead>
                <TableHead className="text-right">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-text-primary">
                        {holding.Ticker}
                      </div>
                      <div className="text-xs text-text-tertiary truncate">
                        {holding.Company_Name || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-text-secondary">
                    {holding.Industry || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-text-secondary">
                    {holding.Size || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-right text-text-secondary">
                    {holding.T3M_Avg_Mcap ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            ₹{(holding.T3M_Avg_Mcap / 1000).toFixed(2)}K Cr
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>3-Month Average Market Capitalization</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {holding.weight.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
