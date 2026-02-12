import { cn } from "@/lib/utils";
import React, { ElementType, Fragment, ReactNode } from "react";

type Props = {
  children: React.ReactNode;
  desc?: ReactNode;
  context?: string;
  containerClasses?: string;
  Icon?: ElementType;
  DescComp?: ElementType;
};

export default function ChartContainer({
  children,
  desc = "",
  Icon,
  context = "",
  containerClasses = "",
  DescComp = "p",
}: Props) {
  const IconElement = Icon || Fragment;

  return (
    <div className={cn("border-info rounded-md border-2", containerClasses)}>
      <div>{children}</div>
      <div className="bg-info flex gap-3 p-4">
        {Icon && (
          <div className="min-w-8">
            <IconElement
              width={38}
              height={36}
            />
          </div>
        )}
        <DescComp className="h-auto">
          {desc}
          {context && (
            <>
              <br />
              <span className="text-[10px] leading-none italic">{context}</span>
            </>
          )}
        </DescComp>
      </div>
    </div>
  );
}
