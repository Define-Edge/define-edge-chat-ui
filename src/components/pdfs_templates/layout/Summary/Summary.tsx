import { MarkdownText } from "@/components/thread/markdown-text";
import PageLayout from "../../layout/PageLayout";
import Fact from "../Fact";
import SummaryContainer from "./SummaryContainer";

type Props = {
  summary: string;
  pgNo: number;
};

export default function Summary({ summary, pgNo }: Props) {
  return (
    <PageLayout pgNo={pgNo}>
      <div className="flex h-full flex-col">
        <SummaryContainer
          header="AI-Powered Insights"
          subHeader="Concise Clear Impactful"
          summary={
            <MarkdownText>
              {summary}
            </MarkdownText>
          }
        />
        <div className="mt-auto flex items-end justify-end">
          <Fact
            header="The Stock Market is more than 400 years old"
            context="The idea of the stock market was started in the Netherlands in 1602. The
        Dutch East India Co. company started issuing paper shares. Shareholders
        could sell and buy these paper shares."
          />
        </div>
      </div>
    </PageLayout>
  );
}
