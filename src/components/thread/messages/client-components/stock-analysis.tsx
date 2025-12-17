"use client";
import { Section, StockAnalysis } from "@/types/stock-analysis";
import { useQueryState } from "nuqs";
import { MarkdownText } from "../../markdown-text";
import SimulationChart from "./SimulationChart";
import { SectionFormatter } from "@/lib/section-formatter";
import ClientComponentsRegistry from "./registry";
import { FormatNewsSentiment } from "./format-news-sentiment";
import { StockAnalysisDownloadDialog } from "./stock-analysis-download-dialog";

export default function StockAnalysisComponent(analysis: StockAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;

  return (
    <div>
      <FormatSection section={data.business_overview} />
      <FormatSection section={data.management_strategy} />
      <FormatSection section={data.sector_outlook} />
      <FormatTechnicalAnalysis section={data.technical_analysis} />
      <FormatSection section={data.fundamental_analysis} />
      {/* <FormatSection section={data.stats_analysis} /> */}
      <FormatSection section={data.peer_comparison} />
      <FormatSection section={data.conference_call_analysis} />
      <FormatSection section={data.shareholding_pattern} />
      <FormatSection section={data.corporate_actions} />
      <FormatNewsSentiment section={data.news_sentiment} />
      <FormatSection section={data.red_flags} />
      <FormatSection section={data.summary} />
      <SimulationChart {...data.simulation_chart} />
      <div className="flex justify-end">
        <StockAnalysisDownloadDialog
          threadId={threadId}
          analysisId={analysis.id}
          companyName={analysis.company_name}
        />
      </div>
    </div>
  );
}

export function FormatSection({ section }: { section: Section }) {
  const formatter = new SectionFormatter(section);
  return <MarkdownText>{formatter.getMarkdown()}</MarkdownText>;
}

export function FormatTechnicalAnalysis({
  section,
  returns_line_chart,
}: {
  section: Section;
  returns_line_chart?: Record<string, any>;
}) {
  const formatter = new SectionFormatter(section);
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
