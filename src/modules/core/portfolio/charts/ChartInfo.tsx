import { PropsWithChildren } from "react";
import { useChartInfoCtx } from "../context/ChartInfo.context";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InfoIcon from "@/components/icons/InfoIcon";

type ChartInfoPopoverProps = PropsWithChildren & {
  infoIconProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export function ChartInfoPopover({
  children,
  infoIconProps,
}: ChartInfoPopoverProps) {
  const { setShowInfo } = useChartInfoCtx();
  const isMobile = useIsMobile();

  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      e.preventDefault();
      setShowInfo(true);
    }
    // On desktop, let the Popover handle it
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={handleIconClick}
          className="absolute top-0 right-0 z-10 rounded-full p-1 hover:bg-bg-hover transition-colors"
          aria-label="Show chart information"
          {...infoIconProps}
        >
          <InfoIcon className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-sm md:max-w-md"
        align="start"
        side="bottom"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export const ChartsInfo = {
  Returns: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        This back tested data assumes that the stocks in the portfolio were
        bought in the given proportion either - 1, 2 or 3 years ago
        respectively. For an accurate back test trade file history is required.
      </p>
      <p>
        This simulation only gives a rough idea about past returns if this
        portfolio was held in the past.
      </p>
      <p>
        If data for even 1 stock in the portfolio is missing for a particular
        period, the back test horizon will not be available for the portfolio.
      </p>
      <p className="pb-4">
        To understand more about our event based back testing methodology{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/posts/sabirjana_investing-quantitativefinance-equityresearch-activity-7090555212809068544-QBPf?utm_source=share&utm_medium=member_desktop"
          className="text-blue-600 hover:underline"
        >
          click here
        </a>
      </p>
    </div>
  ),
  OverallScore: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        The Overall Score is a combination of Fundamental & Technical data
        regarding the portfolio It is calculated based on the weighted average
        of 4 factors - Momentum, Risk, Value & Quality
      </p>
      <p>
        A higher score indicates a better result. On average a portfolio overall
        score should be Medium or High. A low score indicates further room for
        improvement.
      </p>
    </div>
  ),
  RiskScore: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <p>
        The risk score is combination of various parameters like - Volatility,
        Maximum Drawdown, Volumes & Consistency in Performance
      </p>
      <p>
        A higher score indicates higher risk Ideally the portfolio risk score
        should be low or medium
      </p>
    </div>
  ),
  Factors: () => (
    <div className="flex flex-col gap-2 overflow-auto max-h-[calc(28vh-24px-9px)] text-xs md:text-sm md:max-h-none">
      <FactorInfo
        label="Growth"
        text="Fundamental growth of a company is analyzed"
      />
      <FactorInfo
        label="Value"
        text="Company valuations compared to peers and other valuations ratios are examined"
      />
      <FactorInfo label="Risk" text="Price risk and volatility is calculated" />
      <FactorInfo
        label="Performance"
        text="Consistency in performance is measured"
      />
    </div>
  ),
};

function FactorInfo({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="font-bold">
        {label} -&nbsp;
      </span>
      <span>
        {text}
      </span>
    </div>
  );
}
