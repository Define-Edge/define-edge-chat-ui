"use client";

import type {
  MFAnalysis,
  PeerChartData,
  ScoreSection,
} from "@/api/generated/report-apis/models";
import FinSharpeScoresRadarChart from "@/components/pdfs_templates/pf-report/FinSharpeScoresRadarChart";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import { Button } from "@/components/ui/button";
import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";
import groupSmallFragments from "@/lib/groupSmallFragments";
import { SectionFormatter } from "@/lib/section-formatter";
import type { MonthlyReturnsHeatmapData } from "@/types/pf-analysis";
import type { Section } from "@/types/mf-analysis";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MarkdownText } from "../../markdown-text";
import DrawdownChart from "./DrawdownChart";
import LineChart from "./LineChart";
import { MfAnalysisDownloadDialog } from "./mf-analysis-download-dialog";
import PeerComparisonChart from "./PeerComparisonChart";

// Full class names so Tailwind JIT can detect them
const ACCENT_BORDER: Record<string, string> = {
  indigo: "border-l-indigo-500",
  rose: "border-l-rose-500",
  amber: "border-l-amber-500",
  cyan: "border-l-cyan-500",
  emerald: "border-l-emerald-500",
  violet: "border-l-violet-500",
  slate: "border-l-slate-400",
};

export default function MfAnalysisComponent(analysis: MFAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={topRef}
      className="space-y-6"
    >
      {/* 1. Fund Overview */}
      <SectionCard accent="indigo">
        <FormatSection
          section={data.fund_overview.scheme_overview}
          seqNumber={1}
        />
        {data.fund_overview.fund_manager && (
          <FormatSection section={data.fund_overview.fund_manager as Section} />
        )}
      </SectionCard>

      {/* 2. Performance */}
      <SectionCard accent="rose">
        <FormatSection
          section={data.performance.analysis}
          seqNumber={2}
        />
        {data.performance.returns_chart && (
          <LineChart
            {...(data.performance.returns_chart as Record<string, any>)}
            className="!min-w-0"
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
        {data.performance.rolling_sortino_chart && (
          <LineChart
            {...(data.performance.rolling_sortino_chart as Record<string, any>)}
            className="!min-w-0"
          />
        )}
      </SectionCard>

      {/* 3. Ratios */}
      <SectionCard accent="amber">
        <FormatSection
          section={data.ratios.risk_metrics}
          seqNumber={3}
        />
        <FormatSection section={data.ratios.cost_analysis} />
        {data.ratios.valuation_metrics && (
          <FormatSection section={data.ratios.valuation_metrics as Section} />
        )}
      </SectionCard>

      {/* 4. Portfolio */}
      <SectionCard accent="cyan">
        <FormatSection
          section={data.portfolio.asset_allocation}
          seqNumber={4}
        />
        <FormatSection section={data.portfolio.top_holdings} />
        {data.portfolio.top_holdings_chart && (
          <PeerComparisonChart
            data={data.portfolio.top_holdings_chart as PeerChartData}
          />
        )}
        {/* <FormatSection section={data.portfolio.sector_distribution} /> */}
        {data.portfolio.sector_chart && (
          <DistributionPieChart
            title="Sector Distribution"
            data={
              data.portfolio.sector_chart as { name: string; value: number }[]
            }
            useGrouping
          />
        )}
        {data.portfolio.mcap_chart && (
          <DistributionPieChart
            title="Market Cap Distribution"
            data={
              data.portfolio.mcap_chart as { name: string; value: number }[]
            }
            useSizeColors
          />
        )}
      </SectionCard>

      {/* 5. Peer Comparison */}
      <SectionCard accent="emerald">
        <FormatSection
          section={data.peer_comparison.analysis}
          seqNumber={5}
        />
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
      </SectionCard>

      {/* 6. FinSharpe Analysis */}
      {data.finsharpe_analysis && (
        <SectionCard accent="violet">
          <FormatSection
            section={(data.finsharpe_analysis as any).analysis}
            seqNumber={6}
          />
          {(() => {
            const sections = (data.finsharpe_analysis as any).sections || [];
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
                      const isRisk = s.title?.toLowerCase().includes("risk");
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
        </SectionCard>
      )}

      {/* 7. Outlook */}
      <SectionCard accent="slate">
        <FormatSection
          section={data.outlook.summary}
          seqNumber={7}
        />
        <FormatSection section={data.outlook.conclusion} />
      </SectionCard>

      {/* Footer actions */}
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
        <MfAnalysisDownloadDialog
          threadId={threadId}
          analysisId={analysis.id}
          schemeName={analysis.scheme_name}
        />
      </div>
    </div>
  );
}

/* ─── Helper components ──────────────────────────────────────────── */

function SectionCard({
  accent = "indigo",
  children,
  className = "",
}: {
  accent?: keyof typeof ACCENT_BORDER;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`space-y-4 rounded-xl border border-l-4 border-slate-200 ${ACCENT_BORDER[accent]} bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function FormatSection({
  section,
  seqNumber,
}: {
  section: Section;
  seqNumber?: number;
}) {
  if (!section) return null;

  const formatter = new SectionFormatter(section, seqNumber);
  return <MarkdownText>{formatter.getMarkdown()}</MarkdownText>;
}

function DistributionPieChart({
  title,
  data,
  useGrouping = false,
  useSizeColors = false,
}: {
  title: string;
  data: { name: string; value: number }[];
  useGrouping?: boolean;
  useSizeColors?: boolean;
}) {
  const processed = useGrouping
    ? groupSmallFragments(data, {
        id: "name",
        value: "value",
        maxFragments: 15,
      }).map((item, index) => ({
        name: item.name,
        value: item.value,
        color: PIE_COLORS[index % PIE_COLORS.length],
      }))
    : data.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: useSizeColors
          ? SIZE_COLORS[item.name] || PIE_COLORS[index % PIE_COLORS.length]
          : PIE_COLORS[index % PIE_COLORS.length],
      }));

  if (processed.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-48 shrink-0 md:w-48">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={processed}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {processed.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {processed.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 py-0.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-800 tabular-nums">
                  {Number(item.value).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
