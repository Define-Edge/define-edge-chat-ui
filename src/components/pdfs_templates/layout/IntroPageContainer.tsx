import React, { ReactNode } from "react";
import PageLayout from "./PageLayout";
import ProcessDiagram from "@/components/icons/ProcessDiagram";

type Props = {
  children: ReactNode;
  pgNo?: number;
};

export default function IntroPageContainer({ children, pgNo = 1 }: Props) {
  return (
    <PageLayout pgNo={pgNo}>
      <div className="mt-3 mb-8 w-[682px]">
        <ProcessDiagram />
      </div>
      <div className="bg-info mb-8 space-y-4 rounded-md p-4">
        <p>
          Welcome to FinSharpe&apos;s Insight 360, a comprehensive summary of
          your investments to help you optimize your portfolio for maximum
          returns and minimum risks. We use state of the art advanced technology
          powered by Artificial Intelligence to generate this analysis.
        </p>
        <p>
          FinSharpe analyses more than 1 million raw data points by taking
          company fundamental and pricing data from the top data providers.
          Further we process this data into FinSharpe Analytics and apply a
          layer of Generative AI on top of this analysis. Finally, the true
          magic lies in human intelligence where advisors with domain expertise,
          intuition, and emotional quotient, interpret, contextualize and give
          you the right investment advice.
        </p>
      </div>
      {children}
    </PageLayout>
  );
}
