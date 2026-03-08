# MF Report Schema Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the MF analysis UI from a flat 13-section schema to a grouped 7-section schema with chart support, following the stock analysis component pattern.

**Architecture:** Replace hardcoded types with generated API types. Redesign `mf-analysis.tsx` client component using the `SectionCard` + `FormatSection` pattern from `stock-analysis.tsx`. Add inline chart rendering (LineChart, DrawdownChart, PeerComparisonChart, MonthlyReturnsHeatmap, pie charts, gauge charts). Update download dialog section keys. Update PDF template to navigate grouped paths.

**Tech Stack:** React 19, Next.js 15, TypeScript, Recharts, Tailwind CSS, orval-generated API types

---

### Task 1: Update TypeScript Types

**Files:**

- Modify: `src/types/mf-analysis.ts`

**Step 1: Replace hardcoded types with re-exports**

Replace the entire contents of `src/types/mf-analysis.ts` with:

```typescript
// Re-export generated types as the source of truth
export type {
  MFAnalysis as MfAnalysis,
  MFAnalysisReportData as MfAnalysisReportData,
  MFFinSharpeAnalysisData,
  Section,
} from "@/api/generated/report-apis/models";
```

This follows the same pattern as `src/types/stock-analysis.ts` and `src/types/pf-analysis.ts`.

**Step 2: Verify build**

Run: `pnpm build 2>&1 | head -50`

Expected: Type errors in `mf-analysis.tsx`, `mf-report.tsx`, `mf-analysis-download-dialog.tsx` because they still reference old flat fields. This is expected — we fix them in subsequent tasks.

**Step 3: Commit**

```bash
git add src/types/mf-analysis.ts
git commit -m "refactor: replace hardcoded MF types with generated API types"
```

---

### Task 2: Redesign MF Analysis Client Component

**Files:**

- Modify: `src/components/thread/messages/client-components/mf-analysis.tsx`

**Reference:** `src/components/thread/messages/client-components/stock-analysis.tsx` — follow this exact pattern.

**Step 1: Rewrite the component**

Replace the entire contents of `src/components/thread/messages/client-components/mf-analysis.tsx` with:

```tsx
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
        <FormatSection section={data.portfolio.sector_distribution} />
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
          />
        )}
        {data.peer_comparison.risk_adjusted_chart && (
          <PeerComparisonChart
            data={data.peer_comparison.risk_adjusted_chart as PeerChartData}
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
```

**Key decisions:**

- `SectionCard` and `FormatSection` are local helpers (same as stock-analysis.tsx)
- `DistributionPieChart` handles both sector and mcap pie charts with the `useGrouping` / `useSizeColors` props, following the `DistributionChartsSection` pattern from pf-analysis.tsx
- FinSharpe section is identical to stock-analysis.tsx (radar + gauge pattern)
- All chart fields use conditional rendering for nullable handling

**Step 2: Verify build**

Run: `pnpm build 2>&1 | head -50`

Expected: Errors may remain in `mf-report.tsx` (PDF template) — that's fixed in Task 4. The client component itself should compile.

**Step 3: Commit**

```bash
git add src/components/thread/messages/client-components/mf-analysis.tsx
git commit -m "feat: redesign MF analysis component with grouped schema and charts"
```

---

### Task 3: Update Download Dialog Section Keys

**Files:**

- Modify: `src/components/thread/messages/client-components/mf-analysis-download-dialog.tsx`

**Step 1: Update the MF_SECTIONS array and analysisType**

Replace the `MF_SECTIONS` constant (lines 26-40) with:

```typescript
const MF_SECTIONS: MfAnalysisSection[] = [
  { key: "fund_overview", label: "Fund Overview" },
  { key: "performance", label: "Performance" },
  { key: "ratios", label: "Ratios" },
  { key: "portfolio", label: "Portfolio" },
  { key: "peer_comparison", label: "Peer Comparison" },
  { key: "finsharpe_analysis", label: "FinSharpe Analysis" },
  { key: "outlook", label: "Outlook" },
];
```

No other changes needed — the component structure, API call, and UI are correct as-is.

**Step 2: Commit**

```bash
git add src/components/thread/messages/client-components/mf-analysis-download-dialog.tsx
git commit -m "refactor: update MF download dialog sections to match grouped schema"
```

---

### Task 4: Update PDF Report Template

**Files:**

- Modify: `src/components/pdfs_templates/mf-report/mf-report.tsx`

**Reference:** `src/components/pdfs_templates/stock-report/stock-report.tsx` for PDF chart rendering pattern (uses `disableAnimation={true}`).

**Step 1: Rewrite the PDF template**

Replace the entire contents of `src/components/pdfs_templates/mf-report/mf-report.tsx` with:

```tsx
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
import { PIE_COLORS, SIZE_COLORS } from "@/configs/chart-colors";
import groupSmallFragments from "@/lib/groupSmallFragments";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
        className="mx-12 max-w-3xl space-y-8 pt-12"
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
            {data.performance.rolling_sortino_chart && (
              <LineChart
                {...(data.performance.rolling_sortino_chart as Record<
                  string,
                  any
                >)}
                className="!min-w-0"
                disableAnimation
              />
            )}
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
              />
            )}
            <FormatSection section={data.portfolio.sector_distribution} />
            {data.portfolio.sector_chart && (
              <PdfPieChart
                title="Sector Distribution"
                data={
                  data.portfolio.sector_chart as {
                    name: string;
                    value: number;
                  }[]
                }
                useGrouping
              />
            )}
            {data.portfolio.mcap_chart && (
              <PdfPieChart
                title="Market Cap Distribution"
                data={
                  data.portfolio.mcap_chart as { name: string; value: number }[]
                }
                useSizeColors
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
              />
            )}
            {data.peer_comparison.risk_adjusted_chart && (
              <PeerComparisonChart
                data={data.peer_comparison.risk_adjusted_chart as PeerChartData}
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
              <div key={key}>
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

function PdfPieChart({
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
                  isAnimationActive={false}
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
```

**Key differences from client component:**

- Uses `disableAnimation` / `isAnimationActive={false}` on charts for PDF rendering
- Uses `FormatSection` with `SectionFormatter` anchors and "Sources & In-depth Analysis" links (same as old PDF template)
- `getAllSections` extracts all Section objects for the appendix
- `MfWelcome` passed `analysis as any` since MfWelcome still uses the local `MfAnalysis` type alias

**Step 2: Verify build**

Run: `pnpm build 2>&1 | head -50`

Expected: Build should pass with no errors. All files now use the new grouped schema.

**Step 3: Commit**

```bash
git add src/components/pdfs_templates/mf-report/mf-report.tsx
git commit -m "feat: update MF PDF template for grouped schema with chart support"
```

---

### Task 5: Update MfWelcome Type Import

**Files:**

- Modify: `src/components/pdfs_templates/mf-report/MfWelcome.tsx`

**Step 1: Update the import**

The `MfWelcome` component imports `MfAnalysis` from `@/types/mf-analysis`. Since we changed that type to re-export `MFAnalysis` (with capital F), verify the re-exported alias still matches: `MFAnalysis as MfAnalysis`. It should — the alias preserves the old name. No code change needed unless the build fails.

**Step 2: Verify full build**

Run: `pnpm build`

Expected: Clean build, no errors.

**Step 3: Commit (only if changes were needed)**

```bash
git add src/components/pdfs_templates/mf-report/MfWelcome.tsx
git commit -m "fix: update MfWelcome type import for new schema"
```

---

### Task 6: Final Build Verification and Lint

**Step 1: Run full build**

Run: `pnpm build`

Expected: Clean build, no errors.

**Step 2: Run lint**

Run: `pnpm lint`

Expected: No new lint errors.

**Step 3: Run format**

Run: `pnpm format`

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: format code after MF schema migration"
```
