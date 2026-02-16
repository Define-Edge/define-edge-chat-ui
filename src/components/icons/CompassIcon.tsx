type Props = React.SVGProps<SVGSVGElement>;

export default function CompassIcon({ ...props }: Props) {
  return (
    <svg
      width={64}
      height={66}
      viewBox="0 0 64 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer compass ring */}
      <circle
        cx="32"
        cy="33"
        r="28"
        stroke="#00004F"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner compass ring */}
      <circle
        cx="32"
        cy="33"
        r="22"
        stroke="#00004F"
        strokeWidth="1.5"
        fill="#FFE7C9"
        fillOpacity="0.3"
      />
      {/* Cardinal direction ticks - N */}
      <line
        x1="32"
        y1="5"
        x2="32"
        y2="11"
        stroke="#00004F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cardinal direction ticks - S */}
      <line
        x1="32"
        y1="55"
        x2="32"
        y2="61"
        stroke="#00004F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cardinal direction ticks - E */}
      <line
        x1="55"
        y1="33"
        x2="61"
        y2="33"
        stroke="#00004F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cardinal direction ticks - W */}
      <line
        x1="3"
        y1="33"
        x2="9"
        y2="33"
        stroke="#00004F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Compass needle - North (red/warm) */}
      <polygon
        points="32,13 27,33 32,30 37,33"
        fill="#FAA515"
      />
      {/* Compass needle - South (blue/cool) */}
      <polygon
        points="32,53 27,33 32,36 37,33"
        fill="#00004F"
      />
      {/* Center dot */}
      <circle
        cx="32"
        cy="33"
        r="3.5"
        fill="#FAD207"
        stroke="#00004F"
        strokeWidth="1.5"
      />
      {/* "N" letter */}
      <text
        x="32"
        y="4"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#00004F"
      >
        N
      </text>
    </svg>
  );
}
