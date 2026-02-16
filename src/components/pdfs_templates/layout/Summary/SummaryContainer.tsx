import BulbIcon from "@/components/icons/BulbIcon";
import React, { Fragment, ReactNode } from "react";

type Props = {
  header: ReactNode;
  subHeader: string;
  summary: ReactNode;
};

export default function SummaryContainer({
  header,
  subHeader,
  summary,
}: Props) {
  return (
    <div className="flex-1">
      <div className="from-primary-main-light to-brand-teal rounded-md bg-gradient-to-r p-4 text-center text-white">
        <h2 className="text-2xl">{header}</h2>
      </div>
      <section className="border-primary-paper mt-[-2px] flex gap-6 rounded-md rounded-t-none border-2 border-t-0 px-6 pt-6 pb-10">
        <div className="flex">
          <div className="px-6">
            <BulbIcon
              width={110}
              height={112}
            />
            <p className="text-primary-main-light mt-6 text-center text-lg">
              {subHeader.split(" ").map((str) => (
                <Fragment key={str}>
                  {str}
                  <br />
                </Fragment>
              ))}
            </p>
          </div>
          <div className="from-brand-teal to-primary-main-light w-[3px] bg-gradient-to-b" />
        </div>
        {summary}
      </section>
    </div>
  );
}
