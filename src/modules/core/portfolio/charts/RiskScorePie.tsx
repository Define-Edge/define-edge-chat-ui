"use client";

import ScoresLegend from "@/components/charts/ScoresLegend";
import { ChartInfoCtxProvider } from "../context/ChartInfo.context";
import useRiskColor from "../hooks/useRiskColor";
import { ChartsInfo } from "./ChartInfo";
import ScoresPie from "@/components/charts/ScoresPie";
import { riskColorsMap } from "../config";

type ScoreChartData = { value: number; label: string }[];

type Props = {
  data?: ScoreChartData;
  shouldRenderActiveShapeLabel?: boolean;
  infoIconProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export const graphsHeight = "50vh" as const; // capped at 350px via max-h
export const graphsHeightMobile = "28vh" as const;

export default function RiskScorePie({
  data,
  shouldRenderActiveShapeLabel,
  infoIconProps,
}: Props) {
  const riskColor = useRiskColor(data);

  return (
    <div className="relative h-[28vh] w-full sm:h-[50vh] sm:max-h-[350px]">
      <ChartInfoCtxProvider
        Info={<ChartsInfo.RiskScore />}
        heading="How to interpret the Risk Score"
        infoIconProps={infoIconProps}
      >
        <ScoresLegend colors={riskColorsMap} />
        <ScoresPie
          data={data || []}
          colors={[riskColor, "#d1d5db"]}
          shouldRenderActiveShapeLabel={shouldRenderActiveShapeLabel}
        />
      </ChartInfoCtxProvider>
    </div>
  );
}
