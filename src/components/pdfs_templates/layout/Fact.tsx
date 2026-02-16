import DoubleQuotesIcon from "@/components/icons/DoubleQuotesIcon";
import { ReactNode } from "react";

type Props = {
  header: ReactNode;
  context: ReactNode;
};

export default function Fact({ header, context }: Props) {
  return (
    <div className="max-w-96">
      <div className="flex gap-2">
        <DoubleQuotesIcon />
        <h5 className="text-primary-main-light text-xl">Did You Know?</h5>
      </div>
      <p className="text-2xl">{header}</p>
      <p className="mt-1 text-xs">{context}</p>
    </div>
  );
}
