import ScoresLegend from "@/components/charts/ScoresLegend";
import { ChartInfoCtxProvider } from "../../context/ChartInfo.context";
import useScoreColor from "../../hooks/useScoreColor";
import { MFChartsInfo } from "./MFChartInfo";
import ScoresPie from "@/components/charts/ScoresPie";
import { scoreColorsMap } from "../../config";

type ScoreChartData = { value: number; label: string }[];

type Props = {
  data?: ScoreChartData;
  shouldRenderActiveShapeLabel?: boolean;
  infoIconProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

/**
 * Performance Score Pie Chart for MF portfolios
 * Wrapper around ScoresPie with MF-specific info content
 */
export default function PerformanceScorePie({
  data,
  shouldRenderActiveShapeLabel,
  infoIconProps,
}: Props) {
  const color = useScoreColor(data);

  return (
    <div className="relative h-[28vh] w-full sm:h-[50vh]">
      <ChartInfoCtxProvider
        Info={<MFChartsInfo.PerformanceScore />}
        heading="How to interpret the Performance Score"
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
