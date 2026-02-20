import BulbIcon from "@/components/icons/BulbIcon";
import { MarkdownText } from "@/components/thread/markdown-text";
import InsightContainer from "../InsightContainer";
import PageLayout from "../PageLayout";

type Props = {
  summary: string;
  pgNo: number;
};

export default function Summary({ summary, pgNo }: Props) {
  return (
    <PageLayout pgNo={pgNo}>
      <div className="flex h-full flex-col">
        <InsightContainer
          header="AI-Powered Insights"
          subHeader="Concise Clear Impactful"
          Icon={BulbIcon}
          gradientDirection="summary"
        >
          <MarkdownText>{summary}</MarkdownText>
        </InsightContainer>
      </div>
    </PageLayout>
  );
}
