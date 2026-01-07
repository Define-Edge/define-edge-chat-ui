import ScoresLegend from "@/components/charts/ScoresLegend";
import { ChartInfoCtxProvider } from "../context/ChartInfo.context";
import useScoreColor from "../hooks/useScoreColor";
import { ChartsInfo } from "./ChartInfo";
import ScoresPie from "@/components/charts/ScoresPie";
import { scoreColorsMap } from "../config";

type ScoreChartData = { value: number; label: string }[];

type Props = {
  data?: ScoreChartData;
  shouldRenderActiveShapeLabel?: boolean;
  infoIconProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export const graphsHeight = "50vh" as const;
export const graphsHeightMobile = "28vh" as const;

export default function OverallScorePie({
  data,
  shouldRenderActiveShapeLabel,
  infoIconProps,
}: Props) {
  const color = useScoreColor(data);

  return (
    <div className="relative h-[28vh] w-full sm:h-[50vh]">
      <ChartInfoCtxProvider
        Info={<ChartsInfo.OverallScore />}
        heading="How to interpret the Overall Score"
        infoIconProps={infoIconProps}
      >
        <ScoresLegend colors={scoreColorsMap} />
        <ScoresPie
          data={data || []}
          colors={[color, "#d1d5db"]}
          shouldRenderActiveShapeLabel={shouldRenderActiveShapeLabel}
        />
      </ChartInfoCtxProvider>
    </div>
  );
}
