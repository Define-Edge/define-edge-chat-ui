import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MFPortfolioItem } from "@/types/mf-portfolio";

interface MFHoldingsTabProps {
  holdings: MFPortfolioItem[];
}

/**
 * MF Portfolio Holdings Tab Component
 * Displays mutual fund holdings in a table with scheme names, categories, weights, and scores
 */
export function MFHoldingsTab({ holdings }: MFHoldingsTabProps) {
  return (
    <div className="space-y-6 pb-28">
      <Card className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Portfolio Holdings
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Scheme Name</TableHead>
                <TableHead className="hidden md:table-cell text-left">
                  SEBI Category
                </TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Performance
                </TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Risk
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding, index) => (
                <TableRow key={holding.ISIN || index}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-text-primary line-clamp-2">
                        {holding.Scheme_Name}
                      </div>
                      <div className="text-xs text-text-tertiary md:hidden">
                        {holding.Sebi_Category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-text-secondary">
                    {holding.Sebi_Category}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {holding.weight.toFixed(2)}%
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    <ScoreBadge
                      score={holding.PerformanceScore}
                      type="performance"
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    <ScoreBadge score={holding.RiskScore} type="risk" />
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

interface ScoreBadgeProps {
  score: number;
  type: "performance" | "risk";
}

function ScoreBadge({ score, type }: ScoreBadgeProps) {
  const getColor = () => {
    if (type === "performance") {
      // Higher is better for performance
      if (score >= 60) return "bg-green-100 text-green-700";
      if (score >= 30) return "bg-amber-100 text-amber-700";
      return "bg-red-100 text-red-700";
    } else {
      // Lower is better for risk
      if (score <= 30) return "bg-green-100 text-green-700";
      if (score <= 60) return "bg-amber-100 text-amber-700";
      return "bg-red-100 text-red-700";
    }
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getColor()}`}
    >
      {score.toFixed(0)}
    </span>
  );
}
