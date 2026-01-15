"use client";
import { Button } from "@/components/ui/button";
import { SectionFormatter } from "@/lib/section-formatter";
import { Section, StockAnalysis } from "@/types/stock-analysis";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { MarkdownText } from "../../markdown-text";
import { FormatNewsSentiment } from "./format-news-sentiment";
import { StockAnalysisDownloadDialog } from "./stock-analysis-download-dialog";
import ClientComponentsRegistry from "./registry";

export default function StockAnalysisComponent(analysis: StockAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef}>
      <FormatTechnicalAnalysis section={data.technical_analysis} seqNumber={1} />
      <FormatSection section={data.fundamental_analysis} seqNumber={2} />
      <FormatSection section={data.peer_comparison} seqNumber={3} />
      <FormatSection section={data.corporate_actions} seqNumber={4} />
      <FormatNewsSentiment section={data.news_sentiment} seqNumber={5} />
      <FormatSection section={data.red_flags} seqNumber={6} />
      <FormatSection section={data.summary} seqNumber={7} />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() =>
            topRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Back to Top
        </Button>
        <StockAnalysisDownloadDialog
          threadId={threadId}
          analysisId={analysis.id}
          companyName={analysis.company_name}
        />
      </div>
    </div>
  );
}

export function FormatSection({ section, seqNumber }: { section: Section; seqNumber?: number }) {
  const formatter = new SectionFormatter(section, seqNumber);
  return <MarkdownText>{formatter.getMarkdown()}</MarkdownText>;
}

export function FormatTechnicalAnalysis({
  section,
  returns_line_chart,
  seqNumber,
}: {
  section: Section;
  returns_line_chart?: Record<string, any>;
  seqNumber?: number;
}) {
  const formatter = new SectionFormatter(section, seqNumber);
  const title = formatter.getTitleMarkdown();
  const content = formatter.getContentMarkdown();
  const in_depth_analysis = formatter.getInDepthAnalysisMarkdown();
  const sources = formatter.getSourcesMarkdown();

  return (
    <div>
      <MarkdownText>{title}</MarkdownText>
      {returns_line_chart && (
        <div className="space-y-4 pt-4">
          <ClientComponentsRegistry.line_chart {...returns_line_chart} />
        </div>
      )}
      <MarkdownText>{content}</MarkdownText>
      <MarkdownText>{in_depth_analysis}</MarkdownText>
      <MarkdownText>{sources}</MarkdownText>
    </div>
  );
}
