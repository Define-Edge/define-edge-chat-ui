import { Control, FieldArrayWithId } from "react-hook-form";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { HoldingTableRow } from "./HoldingTableRow";
import { HoldingFormData } from "../hooks/useHoldingsForm";
import {
  EQUITY_COLUMNS,
  MUTUAL_FUND_COLUMNS,
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
  const isEquity = consentType === ConsentType.EQUITIES;
  const columns = isEquity ? EQUITY_COLUMNS : MUTUAL_FUND_COLUMNS;

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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 font-medium text-gray-900 ${
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
