import { a4PageSizes } from "@/configs/pdf-constants";
import Footer from "./Footer";
import TopRightArrowIcon from "@/components/icons/TopRightArrowIcon";

type Props = {
  pgNo: number;
};

export default function AdvancedAnalysis({ pgNo }: Props) {
  return (
    <div
      className="flex w-[794px] flex-col relative bg-[url('https://res.cloudinary.com/shoeb/image/upload/v1721190151/FinSharpe/pdf/bg-img_scemyt.png')] bg-cover bg-no-repeat text-white"
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
          <h1 className="text-[5rem] leading-tight">
            ADVANCED ANALYSIS
          </h1>
        </section>
      </main>
      <Footer
        pgNo={pgNo}
        className=""
      />
    </div>
  );
}
