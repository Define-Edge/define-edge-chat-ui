type Props = React.SVGProps<SVGSVGElement>;

export default function TopRightArrowIcon({ ...props }: Props) {
  return (
    <svg
      width={86}
      height={86}
      viewBox="0 0 86 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_33_343"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={86}
        height={86}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62.589 13.9015H0.0716553V0.388199H72.1443H85.6576V13.9015V85.9741H72.1443V23.4568L16.4032 79.1976L6.84824 69.6426L62.589 13.9015Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_33_343)">
        <path
          d="M124.9 339.075H-470.375V-502.815H124.9V339.075Z"
          fill="url(#paint0_linear_33_343)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_33_343"
          x1="7.45447"
          y1="19.1547"
          x2="78.2745"
          y2="67.2047"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#68F2C4" />
          <stop offset={1} stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}
