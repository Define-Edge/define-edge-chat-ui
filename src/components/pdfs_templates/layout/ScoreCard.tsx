import React from "react";
import ScoresPie from "./ScoresPie";

type Props = {
  data: any[];
  label: string;
  desc: string;
};

export default function ScoreCard({ label, data, desc }: Props) {
  return (
    <div className="border-info rounded-md border-2">
      <div className="pt-4">
        <ScoresPie
          label={label}
          data={data}
        />
      </div>
      <p className="bg-info h-auto p-4">{desc}</p>
    </div>
  );
}
