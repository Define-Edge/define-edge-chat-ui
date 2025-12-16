"use client";
import { MfAnalysis } from "@/types/mf-analysis";

function MfWelcome({ analysis }: { analysis: MfAnalysis }) {
  const { scheme_code, scheme_name, date } = analysis;

  return (
    <div
      className={`relative flex h-[1115px] w-[864px] flex-col bg-[url('https://res.cloudinary.com/shoeb/image/upload/v1721190151/FinSharpe/pdf/bg-img_scemyt.png')] bg-cover bg-no-repeat text-white`}
    >
      <header />
      <main className="flex flex-1 flex-col p-14">
        <div className="text-4xl">FinSharpe</div>
        <div className="text-xl">Investment Advisors</div>

        <div className="mt-16 text-2xl">MUTUAL FUND ANALYSIS REPORT</div>
        <div className="mt-2 text-lg text-gray-300">
          Powered by FinSharpeGPT
        </div>
        {date && (
          <div className="mt-1 text-sm text-gray-400">
            Analysis Date: {date}
          </div>
        )}

        <section className="mt-12">
          <div className="flex items-center gap-4">
            {/* Scheme Icon */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10">
              <div className="text-2xl font-bold text-white">
                {getSchemeInitials(scheme_name)}
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold">{scheme_name}</div>
              <div className="mt-1 text-xl font-normal text-gray-300">
                Scheme Code: {scheme_code}
              </div>
            </div>
          </div>
        </section>

        <div className="flex-1" />

        <div className="text-2xl">CONTACT US:</div>

        <section className="mt-4">
          <div className="text-xl font-bold">FinSharpe Investment Advisors</div>
          <div className="text-lg font-normal">info@finsharpe.com</div>
          <div className="text-lg font-normal">+91 99234 11966</div>
        </section>
      </main>
    </div>
  );
}

// Helper function to get initials from scheme name
function getSchemeInitials(schemeName: string): string {
  const words = schemeName.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return schemeName.slice(0, 2).toUpperCase();
}

export default MfWelcome;
