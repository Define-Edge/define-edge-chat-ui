/**
 * Bank Accounts Table Component
 * Custom table for bank accounts with expandable analytics rows
 */

"use client";
import { FieldArrayWithId } from "react-hook-form";
import { HoldingFormData } from "../../HoldingsPreviewModal/hooks/useHoldingsForm";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import { BankAccountTableRow } from "./BankAccountTableRow";

interface BankAccountsTableProps {
  /** Field array items from react-hook-form */
  fields: FieldArrayWithId<HoldingFormData, "holdings", "id">[];
  /** Callback to remove a bank account by index */
  onRemove: (index: number) => void;
}

/**
 * Bank Accounts Table with Analytics
 */
export function BankAccountsTable({
  fields,
  onRemove,
}: BankAccountsTableProps) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No bank accounts found
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 w-12"></th> {/* Expand/Collapse column */}
              <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                Bank Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                Account Type
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                Account Number
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                Balance (INR)
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100 w-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {fields.map((field, index) => (
              <BankAccountTableRow
                key={field.id}
                account={field as unknown as BankAccountWithFormData}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
