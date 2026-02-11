import { cn } from "@/lib/utils";
import React, { ElementType, Fragment, ReactNode } from "react";

type Props = {
  children: React.ReactNode;
  desc?: ReactNode;
  context?: string;
  containerClasses?: string;
  Icon?: ElementType;
};

export default function ChartContainer({
  children,
  desc = "",
  Icon,
  context = "",
  containerClasses = "",
}: Props) {
  const IconElement = Icon || Fragment;

  return (
    <div
      className={cn(
        "border-info rounded-md border-2",
        containerClasses,
      )}
    >
      <div className="pt-4">{children}</div>
      <div className="flex gap-3 p-4 bg-info">
        {Icon && (
          <div className="min-w-8">
            <IconElement
              width={38}
              height={36}
            />
          </div>
        )}
        <p className="h-auto text-xs">
          {desc}
          {context && (
            <>
              <br />
              <span className="text-[10px] leading-none italic">{context}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
