import { a4PageSizes } from "@/configs/pdf-constants";
import { Cell, Pie, PieChart } from "recharts";

type Props = {
  data: any[];
  labelKey: string;
  label: string;
};

/* CSS HSL */
const COLORS = ["#d1dbe4", "#a3b7ca", "#7593af", "#476f95", "#194a7a"];

const CustomizedLabel = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    // innerRadius,
    fill,
    value,
    [props.labelKey]: label,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  // const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  // const x = cx + radius * Math.cos(-midAngle * RADIAN);
  // const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      {/* <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="middle"
        fontSize="10px"
      >
        {value.toFixed(0)}%
      </text> */}
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
        fontSize="10px"
      >
        {label} - <tspan fontStyle="italic">{value.toFixed(0)}%</tspan>
      </text>
    </g>
  );
};

export default function StockWiseAllocationPie({ data,labelKey, label }: Props) {
  return (
    <div className={`w-[${a4PageSizes.innerWidth}]`}>
      <h4 className="flex justify-center text-lg font-semibold text-primary-main-dark">
        {label}
      </h4>
      <PieChart width={678} height={260}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={(props) => <CustomizedLabel {...props} labelKey={labelKey} />}
          outerRadius={90}
          // innerRadius={50}
          dataKey="weight"
          isAnimationActive={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
