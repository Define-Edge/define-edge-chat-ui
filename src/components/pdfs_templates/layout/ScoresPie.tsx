import { Cell, Pie, PieChart, Sector } from "recharts";

type Props = {
  data: any[];
  width?: number;
  label: string;
};

const COLORS = ["rgba(66,212,163,1)", "rgba(6,59,170,1)"];

const renderActiveShape = (props: any) => {
  // const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    fill,
    value,
    // label,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {value} %
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
    </g>
  );
};

export default function ScoresPie({ data, width = 325, label }: Props) {
  return (
    <div className={`w-[${width}px]`}>
      <p className="text-center font-semibold">{label}</p>
      <PieChart
        width={width}
        height={250}
      >
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          activeIndex={0}
          activeShape={renderActiveShape}
          outerRadius={80}
          innerRadius={55}
          dataKey="value"
          isAnimationActive={false}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index]}
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
