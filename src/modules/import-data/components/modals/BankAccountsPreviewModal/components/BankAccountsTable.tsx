/**
 * Bank Accounts Grid Component
 * Card-based layout for bank accounts with expandable analytics
 * Responsive design optimized for mobile and desktop
 */

"use client";
import { BankAccountWithFormData } from "@/modules/import-data/types/bank-accounts";
import { useState } from "react";
import { FieldArrayWithId } from "react-hook-form";
import { HoldingFormData } from "../../HoldingsPreviewModal/hooks/useHoldingsForm";
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (fields.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        No bank accounts found
      </div>
    );
  }

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={expandedIndex === index ? "lg:col-span-2" : ""}
        >
          <BankAccountCard
            account={field as unknown as BankAccountWithFormData}
            index={index}
            onRemove={onRemove}
            isExpanded={expandedIndex === index}
            onToggleExpand={() => handleToggleExpand(index)}
          />
        </div>
      ))}
    </div>
  );
}
