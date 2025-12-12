import { MarkdownText } from "@/components/thread/markdown-text";
import ClientComponentsRegistry from "@/components/thread/messages/client-components/registry";
import { SectionFormatter } from "@/lib/section-formatter";
import { Section, StockAnalysis } from "@/types/stock-analysis";
import Welcome from "../Welcome";

export default function StockAnalysisReportMessageComponent({
  analysis,
}: {
  analysis: StockAnalysis;
}) {
  const { data } = analysis;
  return (
    <div className="w-[864px] mx-auto">
      {/* Welcome Page - Full width/height, self-contained layout */}
      <div
        className="min-h-[1120px] w-full"
      >
        <Welcome analysis={analysis} />
      </div>

      {/* Content Pages - Apply padding to match header/footer */}
      <div className="px-14 py-8">
        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.business_overview} />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection
            section={data.management_strategy}
            displaySources
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.sector_outlook} />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatTechnicalSection
            section={data.technical_analysis}
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.fundamental_analysis} />
        </div>

        {/* <FormatSection section={data.stats_analysis} /> */}

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.peer_comparison} />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection
            section={data.conference_call_analysis}
            displaySources
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection
            section={data.shareholding_pattern}
            displaySources
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection
            section={data.corporate_actions}
            displaySources
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection
            section={data.news_sentiment}
            displaySources
          />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.red_flags} />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <FormatSection section={data.summary} />
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <ClientComponentsRegistry.simulation_chart {...data.simulation_chart} />
        </div>

        <div className="mt-8" />
        <hr className="border-t-2 border-gray-800" />
        <div className="mt-8" />
        <h3 className="text-3xl font-semibold tracking-tight">Data Sources and In-depth Analysis</h3>
        {[
          data.technical_analysis,
          data.fundamental_analysis,
          // data.stats_analysis,
          data.peer_comparison,
        ].map((section, idx, arr) => (
          <div key={section.title}>
            <FormatSectionSourcesAndInDepthAnalysis section={section} />
            {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormatSectionSourcesAndInDepthAnalysis({
  section,
}: {
  section: Section;
}) {
  const formatter = new SectionFormatter(section);
  const source = formatter.getSource();
  const title = section.title;
  const in_depth_analysis = section.in_depth_analysis;
  const anchorId = formatter.getAnchorId();

  if (!in_depth_analysis && !source) {
    return null;
  }

  return (
    <div
      id={`refs-${anchorId}`}
      className="space-y-2 text-sm"
    >
      <h6>
        <a
          className="text-primary font-medium underline underline-offset-4"
          href={`#${anchorId}`}
        >
          {title}
        </a>
      </h6>
      {in_depth_analysis && (
        <MarkdownText>{`<details open><summary>In-depth Analysis</summary>\n\n${in_depth_analysis}\n</details>\n`}</MarkdownText>
      )}
      {source && (
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${source}\n</details>\n`}</MarkdownText>
      )}
    </div>
  );
}

function FormatTechnicalSection({
  section,
  returns_line_chart,
}: {
  section: Section;
  returns_line_chart?: Record<string, any>;
}) {
  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
  const anchorId = formatter.getAnchorId();
  const hasRefs = Boolean(section.in_depth_analysis || formatter.getSource());

  return (
    <div className="space-y-4">
      <div id={anchorId} />
      <MarkdownText>{title}</MarkdownText>
      {hasRefs && (
        <div className="text-xs">
          <a
            className="text-primary font-medium underline underline-offset-4"
            href={`#refs-${anchorId}`}
          >
            Sources & In-depth Analysis
          </a>
        </div>
      )}
      {returns_line_chart &&

        <ClientComponentsRegistry.line_chart {...returns_line_chart} />
      }
      <MarkdownText>{content}</MarkdownText>
    </div>
  );
}

function FormatSection({
  section,
  displaySources = false,
}: {
  section: Section;
  displaySources?: boolean;
}) {
  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
  const sources = formatter.getSourcesMarkdown();
  const anchorId = formatter.getAnchorId();
  const hasRefs = Boolean(section.in_depth_analysis || formatter.getSource());

  return (
    <div className="space-y-4">
      <div id={anchorId} />
      <MarkdownText>{title}</MarkdownText>
      {hasRefs && (
        <div className="text-xs">
          <a
            className="text-primary font-medium underline underline-offset-4"
            href={`#refs-${anchorId}`}
          >
            Sources & In-depth Analysis
          </a>
        </div>
      )}
      <MarkdownText>{content}</MarkdownText>
      {displaySources && <MarkdownText>{sources}</MarkdownText>}
    </div>
  );
}
