import React from "react";

type Props = {
  colors: {
    value: string;
    label: string;
  }[];
};

export default function ScoresLegend({ colors }: Props) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-1">
      {colors.map((c) => (
        <div
          key={c.value}
          className="flex justify-center items-center text-background max-w-[50px] text-sm px-10 rounded py-0"
          style={{ backgroundColor: c.value }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}
