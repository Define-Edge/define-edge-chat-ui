import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

type Props = {
  data: any[];
  width?: number;
  colors?: string[];
  shouldRenderActiveShapeLabel?: boolean;
};

const COLORS = ["rgba(66,212,163,1)", "#d1d5db"]; // Tailwind gray-300

const ActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    fill,
    value,
    label,
    shouldRenderActiveShapeLabel,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} fontSize={18} dy={8} textAnchor="middle" fill={fill}>
        {value.toFixed(2)} %
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {shouldRenderActiveShapeLabel && (
        <>
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
          />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 8}
            y={ey}
            dy={4}
            textAnchor={textAnchor}
            fill="#333"
          >
            {label.split(" ")?.[0] || label}
          </text>
        </>
      )}
    </g>
  );
};

export default function ScoresPie({
  data,
  colors = COLORS,
  shouldRenderActiveShapeLabel = true,
}: Props) {
  // const [activeIndex, setActiveIndex] = useState(0)
  // const onPieEnter = (_, index) => {
  //   setActiveIndex(index)
  // }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ bottom: 15, top: 15 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          activeIndex={0}
          // activeIndex={activeIndex}
          // onMouseEnter={onPieEnter}
          activeShape={(props: any) => (
            <ActiveShape
              {...props}
              shouldRenderActiveShapeLabel={shouldRenderActiveShapeLabel}
            />
          )}
          outerRadius={"90%"}
          innerRadius={"65%"}
          dataKey="value"
          startAngle={450}
          endAngle={0}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
