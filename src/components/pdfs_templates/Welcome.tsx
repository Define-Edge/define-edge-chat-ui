"use client";
import { StockAnalysis } from "@/types/stock-analysis";

function Welcome({ analysis }: { analysis: StockAnalysis }) {
  const { ticker, company_name, date } = analysis;

  // Extract quote data

  // Check if we have valid quote data

  return (
    <div
      className={`relative flex h-[1115px] w-[864px] flex-col bg-[url('https://res.cloudinary.com/shoeb/image/upload/v1721190151/FinSharpe/pdf/bg-img_scemyt.png')] bg-cover bg-no-repeat text-white`}
    >
      <header />
      <main className="flex flex-1 flex-col p-14">
        <div className="text-4xl">FinSharpe</div>
        <div className="text-xl">Investment Advisors</div>

        <div className="mt-16 text-2xl">STOCK ANALYSIS REPORT</div>
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
            {/* Company Logo */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10">
              <img
                src={getCompanyLogoUrl(ticker)}
                alt={`${ticker} logo`}
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden text-2xl font-bold text-white">
                {getTickerInitials(ticker)}
              </div>
            </div>

            <div>
              <div className="text-4xl font-bold">{ticker.toUpperCase()}</div>
              <div className="text-2xl font-normal text-gray-300">
                {company_name}
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
      {/* <footer className="h-[4.5rem]" /> */}
    </div>
  );
}

// Helper functions from StockLivePrice component
function getTickerInitials(symbol: string): string {
  return (symbol || "").trim().slice(0, 3).toUpperCase();
}

// Use Clearbit company logo as a convenient free logo CDN. If the ticker looks like
// a domain (contains a dot and no spaces), we use it directly; otherwise, attempt
// common mappings for major exchanges. Fallback will show initials.
function getCompanyLogoUrl(symbol: string): string {
  const s = (symbol || "").trim().toUpperCase();
  // Very light-weight heuristic mapping for well-known tickers
  const map: Record<string, string> = {
    AAPL: "apple.com",
    MSFT: "microsoft.com",
    GOOGL: "abc.xyz",
    GOOG: "abc.xyz",
    AMZN: "amazon.com",
    META: "meta.com",
    TSLA: "tesla.com",
    NVDA: "nvidia.com",
    NFLX: "netflix.com",
    AMD: "amd.com",
    INTC: "intel.com",
    ORCL: "oracle.com",
    CRM: "salesforce.com",
    SHOP: "shopify.com",
    PYPL: "paypal.com",
    SQ: "block.xyz",
    IBM: "ibm.com",
    UBS: "ubs.com",
  };
  const domain = map[s];
  return domain
    ? `https://logo.clearbit.com/${domain}`
    : `https://logo.clearbit.com/${s.toLowerCase()}.com`;
}

export default Welcome;
