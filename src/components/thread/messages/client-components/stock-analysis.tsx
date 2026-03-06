"use client";

import type {
  FundamentalChartData,
  PeerChartData,
  ScoreSection,
  StockAnalysis,
} from "@/api/generated/report-apis/models";
import FinSharpeScoresRadarChart from "@/components/pdfs_templates/pf-report/FinSharpeScoresRadarChart";
import { MonthlyReturnsHeatmapTables } from "@/components/pdfs_templates/pf-report/MonthlyReturnsHeatmap";
import { Button } from "@/components/ui/button";
import { SectionFormatter } from "@/lib/section-formatter";
import type { MonthlyReturnsHeatmapData } from "@/types/pf-analysis";
import type { Section } from "@/types/stock-analysis";
import OverallScorePie from "@/modules/core/portfolio/charts/OverallScorePie";
import RiskScorePie from "@/modules/core/portfolio/charts/RiskScorePie";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { MarkdownText } from "../../markdown-text";
import DrawdownChart from "./DrawdownChart";
import FundamentalChart from "./FundamentalChart";
import { FormatNewsSentiment } from "./format-news-sentiment";
import LineChart from "./LineChart";
import PeerComparisonChart from "./PeerComparisonChart";
import RiskMetricsTable from "./RiskMetricsTable";
import SimulationChart from "./SimulationChart";
import { StockAnalysisDownloadDialog } from "./stock-analysis-download-dialog";

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

export default function StockAnalysisComponent(analysis: StockAnalysis) {
  const [threadId] = useQueryState("threadId");
  const { data } = analysis;
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef} className="space-y-6">
      {/* 1. Company Overview */}
      <SectionCard accent="indigo">
        <FormatSection
          section={data.company_overview.business_overview}
          seqNumber={1}
        />
        {data.company_overview.management_strategy && (
          <FormatSection
            section={data.company_overview.management_strategy as Section}
          />
        )}
        <FormatSection section={data.company_overview.sector_outlook} />
      </SectionCard>

      {/* 2. Technical Analysis */}
      <SectionCard accent="rose">
        <FormatSection
          section={data.technical_analysis.analysis}
          seqNumber={2}
        />
        {data.technical_analysis.returns_chart && (
          <LineChart
            {...(data.technical_analysis.returns_chart as Record<string, any>)}
          />
        )}
        {data.technical_analysis.drawdown_chart && (
          <DrawdownChart
            data={data.technical_analysis.drawdown_chart as any}
          />
        )}
        {data.technical_analysis.monthly_returns && (
          <div className="space-y-2">
            {(data.technical_analysis.monthly_returns as any)?.heatmap && (
              <div className="overflow-x-auto">
                <MonthlyReturnsHeatmapTables
                  heatmap={
                    (data.technical_analysis.monthly_returns as any)
                      .heatmap as MonthlyReturnsHeatmapData
                  }
                />
              </div>
            )}
            {(data.technical_analysis.monthly_returns as any)?.summary && (
              <MarkdownText>
                {(data.technical_analysis.monthly_returns as any).summary}
              </MarkdownText>
            )}
          </div>
        )}
        {data.technical_analysis.rolling_sortino_chart && (
          <LineChart
            {...(data.technical_analysis.rolling_sortino_chart as Record<string, any>)}
          />
        )}
        {data.technical_analysis.risk_metrics && (
          <RiskMetricsTable
            data={
              data.technical_analysis.risk_metrics as Record<string, unknown>[]
            }
          />
        )}
      </SectionCard>

      {/* 3. Fundamental Analysis */}
      <SectionCard accent="amber">
        <FormatSection
          section={data.fundamental_analysis.analysis}
          seqNumber={3}
        />
        {data.fundamental_analysis.revenue_profit_chart && (
          <FundamentalChart
            data={
              data.fundamental_analysis
                .revenue_profit_chart as FundamentalChartData
            }
          />
        )}
        {data.fundamental_analysis.margin_chart && (
          <FundamentalChart
            data={
              data.fundamental_analysis.margin_chart as FundamentalChartData
            }
          />
        )}
      </SectionCard>

      {/* 4. Peer Comparison */}
      <SectionCard accent="cyan">
        <FormatSection
          section={data.peer_comparison.analysis}
          seqNumber={4}
        />
        {data.peer_comparison.valuation_chart && (
          <PeerComparisonChart
            data={data.peer_comparison.valuation_chart as PeerChartData}
          />
        )}
        {data.peer_comparison.profitability_chart && (
          <PeerComparisonChart
            data={data.peer_comparison.profitability_chart as PeerChartData}
          />
        )}
      </SectionCard>

      {/* 5. Market Sentiment */}
      <SectionCard accent="emerald">
        <FormatNewsSentiment
          section={data.market_sentiment.news_sentiment}
          seqNumber={5}
        />
        {data.market_sentiment.conference_call && (
          <FormatSection
            section={data.market_sentiment.conference_call as Section}
          />
        )}
        {data.market_sentiment.corporate_actions && (
          <FormatSection
            section={data.market_sentiment.corporate_actions as Section}
          />
        )}
        <FormatSection section={data.market_sentiment.shareholding_pattern} />
      </SectionCard>

      {/* 6. FinSharpe Analysis */}
      {data.finsharpe_analysis && (
        <SectionCard accent="violet">
          <FormatSection
            section={(data.finsharpe_analysis as any).analysis}
            seqNumber={6}
          />
          {(data.finsharpe_analysis as any).sections?.map(
            (scoreSection: ScoreSection, idx: number) => {
              if (scoreSection.chart_type === "radar") {
                return (
                  <FinSharpeScoresRadarChart
                    key={idx}
                    data={scoreSection.scores_comparison}
                    className="mx-auto h-80 max-w-lg"
                  />
                );
              }
              if (scoreSection.chart_type === "gauge") {
                const isRisk = scoreSection.title
                  ?.toLowerCase()
                  .includes("risk");
                const PieComponent = isRisk ? RiskScorePie : OverallScorePie;
                return (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-sm font-semibold text-slate-700">
                      {scoreSection.title}
                    </h5>
                    {scoreSection.summary && (
                      <p className="text-xs text-slate-500">
                        {scoreSection.summary}
                      </p>
                    )}
                    <PieComponent data={scoreSection.chart_data} />
                  </div>
                );
              }
              return null;
            },
          )}
        </SectionCard>
      )}

      {/* 7. Outlook */}
      <SectionCard accent="slate">
        <FormatSection section={data.outlook.summary} seqNumber={7} />
        <FormatSection section={data.outlook.red_flags} />
        {data.outlook.simulation_chart && (
          <SimulationChart {...(data.outlook.simulation_chart as any)} />
        )}
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
        <StockAnalysisDownloadDialog
          threadId={threadId}
          analysisId={analysis.id}
          companyName={analysis.company_name}
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
