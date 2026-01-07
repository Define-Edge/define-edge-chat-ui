import { X } from "lucide-react";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { ChartInfoPopover } from "../charts/ChartInfo";

export const ChartInfoContext = createContext<{
  showInfo: boolean;
  setShowInfo: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function useChartInfoCtx() {
  const ctx = useContext(ChartInfoContext);

  if (!ctx) {
    throw new Error(
      "useChartInfoCtx must be used within a ChartInfoContext.Provider"
    );
  }

  return ctx;
}

type ChartInfoCtxProviderProps = {
  Info: React.JSX.Element;
  heading: ReactNode;
  infoIconProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
} & PropsWithChildren;

export function ChartInfoCtxProvider({
  children,
  Info,
  heading,
  infoIconProps,
}: ChartInfoCtxProviderProps) {
  const [showInfo, setShowInfo] = useState(false);

  if (showInfo)
    return (
      <div>
        <div className="flex">
          <div className="text-base font-medium">{heading}</div>
          <button
            onClick={() => setShowInfo(false)}
            className="ml-auto px-1 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-secondary via-primary to-transparent my-2" />
        {Info}
      </div>
    );

  return (
    <ChartInfoContext.Provider value={{ showInfo, setShowInfo }}>
      <ChartInfoPopover infoIconProps={infoIconProps}>
        <div className="p-2">{Info}</div>
      </ChartInfoPopover>
      {children}
    </ChartInfoContext.Provider>
  );
}
