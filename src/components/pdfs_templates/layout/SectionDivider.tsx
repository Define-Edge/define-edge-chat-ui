import { a4PageSizes } from "@/configs/pdf-constants";
import Footer from "./Footer";
import TopRightArrowIcon from "@/components/icons/TopRightArrowIcon";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  pgNo: number;
  headerClassName?: string;
};

export default function SectionDivider({ title, pgNo, headerClassName }: Props) {
  return (
    <div
      className="relative flex w-[794px] flex-col bg-[url('https://res.cloudinary.com/shoeb/image/upload/v1721190151/FinSharpe/pdf/bg-img_scemyt.png')] bg-cover bg-no-repeat text-white"
      style={{ height: a4PageSizes.height }}
    >
      <header className="px-14 pt-14">
        <h3 className="text-4xl">FinSharpe</h3>
        <p className="text-xl">Investment Advisors</p>
      </header>

      <main className="mt-[15%] flex-1 px-14">
        <section>
          <div className="text-5xl">FinSharpe&apos;s</div>
          <p className="mt-2 text-7xl font-semibold">Insight360</p>
        </section>
        <section className="mt-[45%]">
          <div className="flex justify-end">
            <TopRightArrowIcon />
          </div>
          <h1 className={cn("text-[6rem] leading-tight", headerClassName)}>{title}</h1>
        </section>
      </main>
      <Footer
        pgNo={pgNo}
        className=""
      />
    </div>
  );
}
