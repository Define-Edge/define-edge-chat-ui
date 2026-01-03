import { Control, FieldArrayWithId } from "react-hook-form";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { HoldingTableRow } from "./HoldingTableRow";
import { HoldingFormData } from "../hooks/useHoldingsForm";
import {
  EQUITY_COLUMNS,
  MUTUAL_FUND_COLUMNS,
  ETF_COLUMNS,
  BANK_ACCOUNT_COLUMNS,
} from "../utils/holdings-constants";

type HoldingsTableProps = {
  /** Field array items from react-hook-form */
  fields: FieldArrayWithId<HoldingFormData, "holdings", "id">[];
  /** Form control from react-hook-form */
  control: Control<HoldingFormData>;
  /** Consent type to determine column structure */
  consentType: ConsentType;
  /** Callback to remove a holding by index */
  onRemove: (index: number) => void;
};

/**
 * Table component for displaying and editing holdings
 * Renders appropriate columns based on consent type (Equity vs Mutual Fund)
 */
export function HoldingsTable({
  fields,
  control,
  consentType,
  onRemove,
}: HoldingsTableProps) {
  // Select appropriate columns based on consent type
  const getColumns = () => {
    switch (consentType) {
      case ConsentType.EQUITIES:
        return EQUITY_COLUMNS;
      case ConsentType.MUTUAL_FUNDS:
        return MUTUAL_FUND_COLUMNS;
      case ConsentType.ETF:
        return ETF_COLUMNS;
      case ConsentType.BANK_ACCOUNTS:
        return BANK_ACCOUNT_COLUMNS;
      default:
        return EQUITY_COLUMNS;
    }
  };

  const columns = getColumns();

  if (fields.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No holdings found. Use the search bar above to add holdings.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[350px]">
        <table className="w-full text-[10px] md:text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-1.5 py-1.5 md:px-4 md:py-3 font-medium text-gray-900 ${
                    column.align === "left"
                      ? "text-left"
                      : column.align === "right"
                        ? "text-right"
                        : "text-center"
                  } ${column.key === "action" ? "w-20" : ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field, index) => (
              <HoldingTableRow
                key={field.id}
                field={field}
                index={index}
                control={control}
                consentType={consentType}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
