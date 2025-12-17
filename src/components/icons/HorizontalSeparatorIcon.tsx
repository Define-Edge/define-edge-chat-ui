import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

function HorizontalSeparatorIcon({ ...props }: Props) {
  return (
    <svg
      width="2"
      height="10"
      viewBox="0 0 2 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M58.2756 30.8898H-537V-811H58.2756V30.8898Z"
        fill="url(#paint0_linear_1_475)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_475"
          x1="0.950067"
          y1="9.01977"
          x2="0.950067"
          y2="0.85977"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0040FF" />
          <stop offset="1" stopColor="#33CC99" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default HorizontalSeparatorIcon;
