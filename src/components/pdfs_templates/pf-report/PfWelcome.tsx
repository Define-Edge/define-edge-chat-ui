"use client";
import { PfAnalysis } from "@/types/pf-analysis";

function PfWelcome({ analysis }: { analysis: PfAnalysis }) {
  const { date } = analysis;

  return (
    <div
      className={`relative flex h-[1123px] w-[794px] flex-col bg-[url('https://res.cloudinary.com/shoeb/image/upload/v1721190151/FinSharpe/pdf/bg-img_scemyt.png')] bg-cover bg-no-repeat text-white`}
    >
      <header />
      <main className="flex flex-1 flex-col p-14">
        <div className="text-4xl">FinSharpe</div>
        <div className="text-xl">Investment Advisors</div>

        <div className="mt-16 text-2xl">PORTFOLIO ANALYSIS REPORT</div>
        <div className="mt-2 text-lg text-gray-300">
          Powered by FinSharpeGPT
        </div>
        {date && (
          <div className="mt-1 text-sm text-gray-400">
            Analysis Date: {date}
          </div>
        )}

        <section className="mt-[7rem]">
          <div className="flex gap-10">
            <div className="text-[8rem]">Insight</div>
            <div className="text-[8rem]">360</div>
          </div>
        </section>

        <div className="flex-1" />

        <div className="text-2xl">CONTACT US:</div>

        <section className="mt-4">
          <div className="text-lg font-normal">info@finsharpe.com</div>
          <div className="text-lg font-normal">+91 99234 11966</div>
        </section>
      </main>
    </div>
  );
}

export default PfWelcome;
