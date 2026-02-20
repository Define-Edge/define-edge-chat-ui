import React, { ComponentType, Fragment, ReactNode } from "react";

type Props = {
  header: ReactNode;
  subHeader: string;
  children: ReactNode;
  Icon: ComponentType<{ width?: number; height?: number }>;
  gradientDirection?: "summary" | "recommendation";
};

export default function InsightContainer({
  header,
  subHeader,
  children,
  Icon,
  gradientDirection = "summary",
}: Props) {
  const headerGradient =
    gradientDirection === "summary"
      ? "from-primary-main-light to-brand-teal"
      : "from-brand-teal to-primary-main-light";
  const dividerGradient =
    gradientDirection === "summary"
      ? "from-brand-teal to-primary-main-light"
      : "from-primary-main-light to-brand-teal";

  return (
    <div className="flex-1">
      <div
        className={`${headerGradient} rounded-md bg-gradient-to-r p-4 text-center text-white`}
      >
        <h2 className="text-2xl">{header}</h2>
      </div>
      <section className="border-primary-paper mt-[-2px] flex gap-6 rounded-md rounded-t-none border-2 border-t-0 px-6 pt-6 pb-10">
        <div className="flex">
          <div className="px-6">
            <Icon width={110} height={112} />
            <p className="text-primary-main-light mt-6 text-center text-lg">
              {subHeader.split(" ").map((str) => (
                <Fragment key={str}>
                  {str}
                  <br />
                </Fragment>
              ))}
            </p>
          </div>
          <div
            className={`${dividerGradient} w-[3px] bg-gradient-to-b`}
          />
        </div>
        {children}
      </section>
    </div>
  );
}
