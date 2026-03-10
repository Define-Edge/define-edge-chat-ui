import { MarkdownText } from "@/components/thread/markdown-text";
import { JsonDataDisplay } from "@/components/pdfs_templates/shared/JsonDataDisplay";
import type {
  MFAnalysis,
  PeerChartData,
  ScoreSection,
} from "@/api/generated/report-apis/models";
import type { Section } from "@/types/mf-analysis";
import MfWelcome from "./MfWelcome";
import { SectionFormatter } from "@/lib/section-formatter";
import { formatKey } from "@/lib/format-utils";
import { splitMarkdownTables } from "@/lib/markdown-table-splitter";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import FinSharpeScoresRadarChart from "@/components/pdfs_templates/pf-report/FinSharpeScoresRadarChart";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import DrawdownChart from "@/components/thread/messages/client-components/DrawdownChart";
import LineChart from "@/components/thread/messages/client-components/LineChart";
import PeerComparisonChart from "@/components/thread/messages/client-components/PeerComparisonChart";
import type { MonthlyReturnsHeatmapData } from "@/types/pf-analysis";
import DistributionPieChart from "@/components/thread/messages/client-components/DistributionPieChart";

export default function MfAnalysisReportMessageComponent({
  analysis,
  selectedSections,
  personalComment,
}: {
  analysis: MFAnalysis;
  selectedSections?: string[];
  personalComment?: string;
}) {
  const { data } = analysis;

  const shouldRenderSection = (sectionKey: string) => {
    if (!selectedSections || selectedSections.length === 0) return true;
    return selectedSections.includes(sectionKey);
  };

  return (
    <>
      <MfWelcome analysis={analysis as any} />
      <div
        className="report-compact-table mx-12 max-w-3xl space-y-8 pt-12"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {/* 1. Fund Overview */}
        {shouldRenderSection("fund_overview") && (
          <>
            <FormatSection section={data.fund_overview.scheme_overview} />
            {data.fund_overview.fund_manager && (
              <FormatSection
                section={data.fund_overview.fund_manager as Section}
              />
            )}
          </>
        )}

        {/* 2. Performance */}
        {shouldRenderSection("performance") && (
          <>
            <FormatSection section={data.performance.analysis} />
            {data.performance.returns_chart && (
              <LineChart
                {...(data.performance.returns_chart as Record<string, any>)}
                className="!min-w-0"
                disableAnimation
              />
            )}
            {data.performance.trailing_returns_chart && (
              <PeerComparisonChart
                data={data.performance.trailing_returns_chart as PeerChartData}
                labelKey="period"
              />
            )}
            {data.performance.drawdown_chart && (
              <DrawdownChart
                data={data.performance.drawdown_chart as any}
                returnsData={(data.performance.returns_chart as any)?.data}
                disableAnimation
              />
            )}
            {data.performance.monthly_returns && (
              <div className="space-y-2">
                {(data.performance.monthly_returns as any)?.heatmap && (
                  <div className="overflow-x-auto">
                    <MonthlyReturnsHeatmapTables
                      heatmap={
                        (data.performance.monthly_returns as any)
                          .heatmap as MonthlyReturnsHeatmapData
                      }
                    />
                  </div>
                )}
                {(data.performance.monthly_returns as any)?.summary && (
                  <MarkdownText>
                    {(data.performance.monthly_returns as any).summary}
                  </MarkdownText>
                )}
              </div>
            )}
            {/* {data.performance.rolling_sortino_chart && (
              <LineChart
                {...(data.performance.rolling_sortino_chart as Record<
                  string,
                  any
                >)}
                className="!min-w-0"
                disableAnimation
              />
            )} */}
          </>
        )}

        {/* 3. Ratios */}
        {shouldRenderSection("ratios") && (
          <>
            <FormatSection section={data.ratios.risk_metrics} />
            <FormatSection section={data.ratios.cost_analysis} />
            {data.ratios.valuation_metrics && (
              <FormatSection
                section={data.ratios.valuation_metrics as Section}
              />
            )}
          </>
        )}

        {/* 4. Portfolio */}
        {shouldRenderSection("portfolio") && (
          <>
            <FormatSection section={data.portfolio.asset_allocation} />
            <FormatSection section={data.portfolio.top_holdings} />
            {data.portfolio.top_holdings_chart && (
              <PeerComparisonChart
                data={data.portfolio.top_holdings_chart as PeerChartData}
                hideLegend
              />
            )}
            {/* <FormatSection section={data.portfolio.sector_distribution} /> */}
            {data.portfolio.sector_chart && (
              <DistributionPieChart
                title="Sector Distribution"
                data={
                  data.portfolio.sector_chart as {
                    name: string;
                    value: number;
                  }[]
                }
                useGrouping
                disableAnimation
                className="flex flex-row items-center gap-4"
              />
            )}
            {data.portfolio.mcap_chart && (
              <DistributionPieChart
                title="Market Cap Distribution"
                data={
                  data.portfolio.mcap_chart as { name: string; value: number }[]
                }
                useSizeColors
                disableAnimation
                className="flex flex-row items-center gap-4"
              />
            )}
          </>
        )}

        {/* 5. Peer Comparison */}
        {shouldRenderSection("peer_comparison") && (
          <>
            <FormatSection section={data.peer_comparison.analysis} />
            {data.peer_comparison.returns_chart && (
              <PeerComparisonChart
                data={data.peer_comparison.returns_chart as PeerChartData}
                labelKey="fund"
              />
            )}
            {data.peer_comparison.risk_adjusted_chart && (
              <PeerComparisonChart
                data={data.peer_comparison.risk_adjusted_chart as PeerChartData}
                labelKey="fund"
              />
            )}
          </>
        )}

        {/* 6. FinSharpe Analysis */}
        {shouldRenderSection("finsharpe_analysis") &&
          data.finsharpe_analysis && (
            <>
              <FormatSection
                section={(data.finsharpe_analysis as any).analysis}
              />
              {(() => {
                const sections =
                  (data.finsharpe_analysis as any).sections || [];
                const radarSections = sections.filter(
                  (s: ScoreSection) => s.chart_type === "radar",
                );
                const gaugeSections = sections.filter(
                  (s: ScoreSection) =>
                    s.chart_type === "gauge" && s.chart_data?.length,
                );
                return (
                  <>
                    {radarSections.map((s: ScoreSection, idx: number) => (
                      <FinSharpeScoresRadarChart
                        key={`radar-${idx}`}
                        data={s.scores_comparison}
                        className="mx-auto h-80 max-w-lg"
                      />
                    ))}
                    {gaugeSections.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {gaugeSections.map((s: ScoreSection, idx: number) => {
                          const isRisk = s.title
                            ?.toLowerCase()
                            .includes("risk");
                          const PieComponent = isRisk
                            ? RiskScorePie
                            : OverallScorePie;
                          return (
                            <div
                              key={`gauge-${idx}`}
                              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                            >
                              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                                <h4 className="text-sm font-semibold text-slate-800">
                                  {s.title}
                                </h4>
                              </div>
                              <div className="p-4">
                                <div className="relative h-[28vh] w-full sm:h-[50vh] sm:max-h-[350px]">
                                  <PieComponent
                                    data={s.chart_data}
                                    shouldRenderActiveShapeLabel={true}
                                  />
                                </div>
                                {s.summary && (
                                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                                    {s.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}

        {/* 7. Outlook */}
        {shouldRenderSection("outlook") && (
          <>
            <FormatSection section={data.outlook.summary} />
            <FormatSection section={data.outlook.conclusion} />
          </>
        )}

        {/* Personal Comment Section */}
        {personalComment && (
          <>
            <div className="mt-8" />
            <hr className="border-t-2 border-gray-800" />
            <div className="mt-8" />
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold tracking-tight">
                Personal Comment
              </h3>
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {personalComment}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="mt-8" />
        <hr className="border-t-2 border-gray-800" />
        <div className="mt-8" />
        <h3 className="text-3xl font-semibold tracking-tight">
          Data Sources and In-depth Analysis
        </h3>
        <span className="report-compact-table">
          {getAllSections(data)
            .filter(({ key, section }) => section && shouldRenderSection(key))
            .map(({ section, key }, idx, arr) => (
              <div key={`${key}-${idx}`}>
                <FormatSectionSourcesAndInDepthAnalysis section={section} />
                {idx < arr.length - 1 && <hr className="my-4 border-t-2" />}
              </div>
            ))}
        </span>
      </div>
    </>
  );
}

/** Extract all Section objects from the grouped data, with their parent group key for filtering. */
function getAllSections(
  data: MFAnalysis["data"],
): { section: Section; key: string }[] {
  return [
    { section: data.fund_overview.scheme_overview, key: "fund_overview" },
    {
      section: data.fund_overview.fund_manager as Section,
      key: "fund_overview",
    },
    { section: data.performance.analysis, key: "performance" },
    { section: data.ratios.risk_metrics, key: "ratios" },
    { section: data.ratios.cost_analysis, key: "ratios" },
    { section: data.ratios.valuation_metrics as Section, key: "ratios" },
    { section: data.portfolio.asset_allocation, key: "portfolio" },
    { section: data.portfolio.top_holdings, key: "portfolio" },
    { section: data.portfolio.sector_distribution, key: "portfolio" },
    { section: data.peer_comparison.analysis, key: "peer_comparison" },
    {
      section: (data.finsharpe_analysis as any)?.analysis,
      key: "finsharpe_analysis",
    },
  ];
}

function FormatSectionSourcesAndInDepthAnalysis({
  section,
}: {
  section: Section;
}) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const anchorId = formatter.getAnchorId();
  const in_depth_analysis = section.in_depth_analysis;
  const sources = section.sources;
  const sourcesMarkdown = formatter.getSource();

  if (!in_depth_analysis && !sources) {
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
          {section.title}
        </a>
      </h6>
      {in_depth_analysis && (
        <MarkdownText>{`<details open><summary>In-depth Analysis</summary>\n\n${in_depth_analysis}\n</details>\n`}</MarkdownText>
      )}
      {sourcesMarkdown && (
        <MarkdownText>{`<details open><summary>Sources</summary>\n\n${splitMarkdownTables(sourcesMarkdown)}\n</details>\n`}</MarkdownText>
      )}
      {sources && typeof sources === "object" && !Array.isArray(sources) && (
        <SourcesDisplay sources={sources as Record<string, any>} />
      )}
    </div>
  );
}

function FormatSection({ section }: { section: Section }) {
  if (!section) {
    return null;
  }

  const formatter = new SectionFormatter(section);
  const title = formatter.getTitleMarkdown();
  const content = `${formatter.getContentMarkdown()}\n---\n`;
  const anchorId = formatter.getAnchorId();
  const hasRefs = Boolean(section.in_depth_analysis || section.sources);

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
    </div>
  );
}

function SourcesDisplay({ sources }: { sources: Record<string, any> }) {
  return (
    <details
      open
      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100">
        Sources (Data)
      </summary>
      <div className="mt-4 space-y-4">
        {Object.entries(sources).map(([key, value]) => (
          <div
            key={key}
            className="space-y-2"
          >
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
              {formatKey(key)}
            </h4>
            <JsonDataDisplay data={value} />
          </div>
        ))}
      </div>
    </details>
  );
}
