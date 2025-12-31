import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { ConsentType } from "@/lib/moneyone/moneyone.enums";
import { HoldingFormData } from "../hooks/useHoldingsForm";
import { HoldingWithQuantity } from "../utils/holdings-transformer";
import { getHoldingName } from "../utils/holdings-constants";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";

type HoldingTableRowProps = {
  /** Field data for this row */
  field: HoldingWithQuantity & { id: string };
  /** Index of this row in the field array */
  index: number;
  /** Form control from react-hook-form */
  control: Control<HoldingFormData>;
  /** Consent type to determine which fields to display */
  consentType: ConsentType;
  /** Callback to remove this holding */
  onRemove: (index: number) => void;
};

/**
 * Single row in the holdings table
 * Memoized to prevent unnecessary re-renders
 */
export const HoldingTableRow = memo(function HoldingTableRow({
  field,
  index,
  control,
  consentType,
  onRemove,
}: HoldingTableRowProps) {
  // Bank accounts have different columns structure
  if (consentType === ConsentType.BANK_ACCOUNTS) {
    const bankAccount = field as unknown as BankAccountWithFormData;
    return (
      <tr className="hover:bg-gray-50">
        {/* Bank Name Column */}
        <td className="px-4 py-3 text-gray-900">
          {bankAccount.displayBank || "-"}
        </td>

        {/* Account Type Column */}
        <td className="px-4 py-3 text-gray-600">
          {bankAccount.displayAccountType || "-"}
        </td>

        {/* Account Number Column */}
        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
          {bankAccount.displayAccountNumber || "-"}
        </td>

        {/* Balance Column */}
        <td className="px-4 py-3 text-right text-gray-900 font-medium">
          {bankAccount.displayBalance || "-"}
        </td>

        {/* Remove Button */}
        <td className="px-4 py-3 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </td>
      </tr>
    );
  }

  // Default rendering for equity, mutual funds, ETF
  return (
    <tr className="hover:bg-gray-50">
      {/* Name/Description Column */}
      <td className="px-4 py-3 text-gray-900">
        {getHoldingName(field, consentType)}
      </td>

      {/* ISIN Column */}
      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
        {field.isin || "-"}
      </td>

      {/* Quantity Input */}
      <td className="px-4 py-3">
        <Controller
          control={control}
          name={`holdings.${index}.quantity`}
          rules={{ required: true, min: 0 }}
          render={({ field: inputField }) => (
            <Input
              {...inputField}
              type="number"
              min="0"
              step="any"
              className="w-28 text-right ml-auto"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                inputField.onChange(isNaN(value) ? 0 : value);
              }}
            />
          )}
        />
      </td>

      {/* Remove Button */}
      <td className="px-4 py-3 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
});
