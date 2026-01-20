"use client";
import { Button } from "@/components/ui/button";
import { SectionFormatter } from "@/lib/section-formatter";
import { Section, StockAnalysis } from "@/types/stock-analysis";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { MarkdownText } from "../../markdown-text";
import { FormatNewsSentiment } from "./format-news-sentiment";
import ClientComponentsRegistry from "./registry";
import SimulationChart from "./SimulationChart";
import { StockAnalysisDownloadDialog } from "./stock-analysis-download-dialog";

export default function StockAnalysisComponent(analysis: StockAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef}>
      <FormatSection section={data.business_overview} seqNumber={1} />
      <FormatSection section={data.management_strategy} seqNumber={2} />
      <FormatSection section={data.sector_outlook} seqNumber={3} />
      <FormatTechnicalAnalysis section={data.technical_analysis} seqNumber={4} />
      <FormatSection section={data.fundamental_analysis} seqNumber={5} />
      {/* <FormatSection section={data.stats_analysis} /> */}
      <FormatSection section={data.peer_comparison} seqNumber={6} />
      <FormatSection section={data.conference_call_analysis} seqNumber={7} />
      <FormatSection section={data.shareholding_pattern} seqNumber={8} />
      <FormatSection section={data.corporate_actions} seqNumber={9} />
      <FormatNewsSentiment section={data.news_sentiment} seqNumber={10} />
      <FormatSection section={data.red_flags} seqNumber={11} />
      <FormatSection section={data.summary} seqNumber={12} />
      <FormatSection section={data.finsharpe_scores} seqNumber={13} />
      {data.simulation_chart && <SimulationChart {...data.simulation_chart} />}
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
  if (!section) {
    return null;
  }

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
  if (!section) {
    return null;
  }

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
