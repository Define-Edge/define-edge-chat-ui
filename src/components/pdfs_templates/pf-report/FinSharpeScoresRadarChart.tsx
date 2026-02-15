import type { FinSharpeScoreItem } from "@/api/generated/report-apis/models";
import { a4PageSizes } from "@/configs/pdf-constants";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data?: FinSharpeScoreItem[];
};

function getScoreColor(value: number, isRisk: boolean): string {
  const v = isRisk ? 100 - value : value;
  if (v >= 69.5) return "#16a34a"; // green — strong
  if (v > 50.5) return "#d97706"; // amber — neutral
  return "#dc2626"; // red — weak
}

export default function FinSharpeScoresRadarChart({ data }: Props) {
  return (
    <div className={`w-[${a4PageSizes.innerWidth}] h-96`}>
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <RadarChart
          data={data}
          cx="50%"
          cy="50%"
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tickLine={false}
            tick={(props) => {
              const { x, y, payload, index, cx, cy } = props;
              const value = data?.[index]?.portfolio ?? 0;
              const metric: string = payload.value;
              const isRisk = metric.toLowerCase().includes("risk");
              const color = getScoreColor(value, isRisk);
              const dx = x - cx;
              const dy = y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              // Push labels outward
              const offset = 12;
              const lx = x + (dx / dist) * offset;
              const ly = y + (dy / dist) * offset;
              // Determine text anchor based on horizontal position
              const anchor =
                Math.abs(dx) < 5
                  ? "middle"
                  : dx > 0
                    ? "start"
                    : "end";

              return (
                <g>
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    className="fill-gray-800 text-xs font-medium"
                  >
                    {payload.value}
                  </text>
                  <text
                    x={lx}
                    y={ly + 14}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fill={color}
                    className="text-xs font-semibold"
                  >
                    {value}%
                  </text>
                </g>
              );
            }}
          />
          <Radar
            dataKey="portfolio"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip formatter={(value) => [`${value}%`]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
