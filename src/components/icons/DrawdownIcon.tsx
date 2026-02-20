import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function DrawdownIcon(props: Props) {
  return (
    <svg
      width="38"
      height="36"
      viewBox="0 0 38 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Downward trending line */}
      <path
        d="M4 8L14 16L22 12L34 28"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <path
        d="M28 26L34 28L32 22"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Baseline */}
      <line
        x1="4"
        y1="32"
        x2="34"
        y2="32"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
