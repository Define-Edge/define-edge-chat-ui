/**
 * Bank Accounts Grid Component
 * Card-based layout for bank accounts with expandable analytics
 * Responsive design optimized for mobile and desktop
 */

"use client";
import { FieldArrayWithId } from "react-hook-form";
import { HoldingFormData } from "../../HoldingsPreviewModal/hooks/useHoldingsForm";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import { BankAccountCard } from "./BankAccountCard";

interface BankAccountsTableProps {
  /** Field array items from react-hook-form */
  fields: FieldArrayWithId<HoldingFormData, "holdings", "id">[];
  /** Callback to remove a bank account by index */
  onRemove: (index: number) => void;
}

/**
 * Bank Accounts Grid with Card Layout
 * Displays bank accounts in a responsive grid of cards
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {fields.map((field, index) => (
        <BankAccountCard
          key={field.id}
          account={field as unknown as BankAccountWithFormData}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
