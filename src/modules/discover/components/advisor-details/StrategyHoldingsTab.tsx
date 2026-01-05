import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockHoldings } from "../../constants/advisor-strategy-mock-data";

/**
 * Strategy Holdings Tab Component
 * Displays portfolio holdings in a table with weights, prices, and changes
 * Component size: ~120 lines
 */
export function StrategyHoldingsTab() {
  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">Portfolio Holdings</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Stock</TableHead>
                <TableHead className="text-right">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHoldings.map((holding, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-text-primary">
                        {holding.symbol}
                      </div>
                      <div className="text-xs text-text-tertiary truncate">
                        {holding.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {holding.weight}%
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
