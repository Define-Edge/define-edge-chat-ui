import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type KeyAccessor<T> = {
  [K in keyof T]: T[K] extends ReactNode ? K : never;
}[keyof T];
type FunctionAccessor<T> = (row: T) => React.ReactNode;

interface Column<T> {
  Header: string;
  accessor: KeyAccessor<T> | FunctionAccessor<T>;
  meta?: {
    column?: {
      className?: string;
      align?: React.TdHTMLAttributes<HTMLTableColElement>["align"];
    };
  };
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

const DataTable = <T extends object>({
  columns,
  data,
  className,
}: TableProps<T>) => {
  return (
    <table className={cn("rounded-corner-table mt-4 text-xs", className)}>
      <thead className="text-white">
        <tr className="from-primary-main-light to-brand-teal bg-gradient-to-r">
          {columns.map((column, index) => (
            <th
              className="px-2 py-3 font-normal"
              key={index}
            >
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-primary-paper border-2"
          >
            {columns.map((column, colIndex) => (
              <td
                align={column.meta?.column?.align}
                className={cn("px-2 py-3", column.meta?.column?.className)}
                key={colIndex}
              >
                {typeof column.accessor === "function"
                  ? column.accessor(row)
                  : (row[column.accessor] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
