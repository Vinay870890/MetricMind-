"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000";

type RecordData = {
  [key: string]: string | number;
};

type ChartConfig = {
  chart_type?: string;
  title?: string;
  x_axis?: string;
  y_axis?: string;
  labels?: string[];
  values?: number[];
  insight?: string;
};

type DashboardWidget = {
  id: string;
  type: string;
  title?: string;
  value?: number;
  config?: ChartConfig;
};

type DashboardAnalysis = {
  dataset?: string;
  metric?: string;
  group_by?: string;
  records?: RecordData[];
};

type DashboardData = {
  dashboard_id?: string;
  title?: string;
  description?: string;
  widgets?: DashboardWidget[];
  analysis?: DashboardAnalysis;
};

type DashboardResponse = {
  status?: string;
  question?: string;
  route?: string;
  executive_summary?: string;
  trace?: string[];
  dashboard?: DashboardData;
  saved_dashboard?: {
    id?: string;
    name?: string;
  };
};

const EXAMPLE_QUESTIONS = [
  "Sales by Region",
  "Sales by Category",
  "Top 10 customers by sales",
  "Quantity by Category",
  "Profit by Region",
];

export default function Home() {
  const router = useRouter();

  const [question, setQuestion] =
    useState("Sales by Region");

  const [result, setResult] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [activePage, setActivePage] =
    useState("Ask MetricMind");

  async function analyzeQuestion() {
    if (!question.trim()) {
      setError("Please enter a business question.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setActivePage("Ask MetricMind");

    try {
      const response = await fetch(
        `${API_URL}/api/langgraph`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data: DashboardResponse =
        await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to MetricMind backend. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function openDashboard() {
    const dashboardId =
      result?.saved_dashboard?.id;

    if (!dashboardId) {
      setError(
        "Dashboard ID was not returned by the backend."
      );
      return;
    }

    router.push(`/dashboard?id=${dashboardId}`);
  }

  function handleNavigation(page: string) {
    setActivePage(page);
    setError("");

    if (page === "Overview") {
      if (result) {
        return;
      }

      setQuestion("Sales by Region");
      return;
    }

    if (page === "Ask MetricMind") {
      return;
    }

    if (page === "Dashboards") {
      if (result?.saved_dashboard?.id) {
        openDashboard();
      } else {
        router.push("/dashboard");
      }

      return;
    }

    if (page === "Analytics") {
      return;
    }

    if (page === "Saved") {
      return;
    }

    if (page === "Settings") {
      return;
    }
  }

  const widgets =
    result?.dashboard?.widgets || [];

  const kpis = widgets.filter(
    (widget) => widget.type === "kpi"
  );

  const chart = widgets.find(
    (widget) => widget.type === "chart"
  );

  const chartConfig =
    chart?.config;

  const labels =
    chartConfig?.labels || [];

  const values =
    chartConfig?.values || [];

  const records =
    result?.dashboard?.analysis?.records || [];

  const maxValue =
    values.length > 0
      ? Math.max(...values, 1)
      : 1;

  const totalValue = useMemo(() => {
    return values.reduce(
      (sum, value) => sum + value,
      0
    );
  }, [values]);

  function renderHorizontalBar() {
    if (labels.length === 0) {
      return <EmptyChartState />;
    }

    return (
      <div className="space-y-5">
        {labels.map((label, index) => {
          const value =
            values[index] || 0;

          const percentage =
            (value / maxValue) * 100;

          return (
            <div key={`${label}-${index}`}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-slate-300">
                  {label}
                </span>

                <span className="whitespace-nowrap text-sm text-slate-400">
                  {value.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderVerticalBar() {
    if (labels.length === 0) {
      return <EmptyChartState />;
    }

    return (
      <div className="flex h-80 items-end gap-4 overflow-x-auto rounded-xl bg-slate-950 p-6">
        {labels.map((label, index) => {
          const value =
            values[index] || 0;

          const percentage =
            (value / maxValue) * 100;

          return (
            <div
              key={`${label}-${index}`}
              className="flex min-w-20 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-xs text-slate-400">
                {value.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </span>

              <div className="flex h-56 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-blue-500 transition-all duration-700"
                  style={{
                    height: `${percentage}%`,
                    minHeight:
                      value > 0
                        ? "8px"
                        : "0px",
                  }}
                />
              </div>

              <span className="mt-3 max-w-24 truncate text-center text-xs text-slate-400">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function renderPieChart() {
    if (labels.length === 0) {
      return <EmptyChartState />;
    }

    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#ec4899",
      "#84cc16",
    ];

    const total =
      values.reduce(
        (sum, value) => sum + value,
        0
      ) || 1;

    let currentAngle = 0;

    const gradientParts =
      labels.map((_, index) => {
        const value =
          values[index] || 0;

        const percentage =
          (value / total) * 360;

        const start =
          currentAngle;

        const end =
          currentAngle + percentage;

        currentAngle = end;

        return `${colors[index % colors.length]} ${start}deg ${end}deg`;
      });

    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <div
            className="relative h-72 w-72 rounded-full"
            style={{
              background:
                `conic-gradient(${gradientParts.join(", ")})`,
            }}
          >
            <div className="absolute inset-20 flex items-center justify-center rounded-full bg-slate-900">
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold">
                  {totalValue.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {labels.map((label, index) => {
            const value =
              values[index] || 0;

            const percentage =
              (value / total) * 100;

            return (
              <div
                key={`${label}-legend`}
                className="flex items-center justify-between rounded-xl bg-slate-950 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        colors[
                          index %
                            colors.length
                        ],
                    }}
                  />

                  <span className="truncate text-sm text-slate-300">
                    {label}
                  </span>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-sm font-medium">
                    {value.toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-500">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderChart() {
    const chartType =
      chartConfig?.chart_type?.toLowerCase();

    if (
      chartType === "horizontal_bar" ||
      chartType === "bar"
    ) {
      return renderHorizontalBar();
    }

    if (chartType === "vertical_bar") {
      return renderVerticalBar();
    }

    if (
      chartType === "pie" ||
      chartType === "donut"
    ) {
      return renderPieChart();
    }

    return renderHorizontalBar();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="lg:pl-64">

        {/* HEADER */}

        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

          <div className="flex items-center justify-between px-6 py-4">

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                MetricMind X
              </p>

              <h2 className="text-lg font-semibold">
                {activePage}
              </h2>

            </div>

            <div className="flex items-center gap-3">

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                ● Live
              </span>

              <span className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 sm:block">
                v1.0.0
              </span>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="mx-auto max-w-7xl px-6 py-8">

          {/* OVERVIEW */}

          {activePage === "Overview" && (

            <div className="space-y-6">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  MetricMind X Overview
                </div>

                <h1 className="text-4xl font-bold">

                  Business Intelligence

                  <span className="text-blue-400">
                    {" "}powered by AI
                  </span>

                </h1>

                <p className="mt-4 max-w-3xl text-slate-400">
                  MetricMind X converts natural-language
                  business questions into governed analytics,
                  insights and visual dashboards.
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <FeatureCard
                  icon="✦"
                  title="Natural Language"
                  description="Ask business questions without writing SQL."
                />

                <FeatureCard
                  icon="◫"
                  title="AI Visualizations"
                  description="Automatically generates useful visualizations."
                />

                <FeatureCard
                  icon="◈"
                  title="Semantic Intelligence"
                  description="Governed metrics prevent inconsistent business definitions."
                />

              </div>

              {result && (

                <button
                  onClick={() =>
                    setActivePage("Ask MetricMind")
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                >
                  View Latest Analysis →
                </button>

              )}

            </div>

          )}

          {/* ASK METRICMIND */}

          {activePage === "Ask MetricMind" && (

            <>

              {!result && (

                <div className="mb-8">

                  <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                    AI-Powered Semantic Analytics
                  </div>

                  <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">

                    Ask your data.

                    <span className="text-blue-400">
                      {" "}Get intelligent answers.
                    </span>

                  </h1>

                  <p className="mt-4 max-w-3xl text-slate-400">
                    Ask natural-language business questions
                    and MetricMind X generates governed
                    analytics, insights and dashboards.
                  </p>

                </div>

              )}

              {/* ASK CARD */}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold">
                      Ask MetricMind
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Ask questions about your business data
                    </p>

                  </div>

                  <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-blue-400">
                    Natural Language
                  </span>

                </div>

                <div className="flex flex-col gap-3 md:flex-row">

                  <input
                    type="text"
                    value={question}
                    onChange={(event) =>
                      setQuestion(event.target.value)
                    }
                    onKeyDown={(event) => {

                      if (event.key === "Enter") {
                        analyzeQuestion();
                      }

                    }}
                    placeholder="e.g. Sales by Region"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={analyzeQuestion}
                    disabled={loading}
                    className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Analyzing..."
                      : "Analyze →"}
                  </button>

                </div>

                {error && (

                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                  </div>

                )}

                <div className="mt-4 flex flex-wrap gap-2">

                  {EXAMPLE_QUESTIONS.map(
                    (example) => (

                      <button
                        key={example}
                        onClick={() =>
                          setQuestion(example)
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 hover:border-blue-500/50 hover:text-blue-400"
                      >
                        {example}
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* LOADING */}

              {loading && (

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

                  <h3 className="mt-5 font-semibold">
                    MetricMind is analyzing...
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Planner → Semantic Validation
                    → Analytics → Insight
                    → Visualization
                  </p>

                </div>

              )}

              {/* RESULT */}

              {result && !loading && (

                <div className="mt-8 space-y-6">

                  {/* RESULT HEADER */}

                  <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-blue-400">
                        AI Analysis Complete
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        {result.dashboard?.title ||
                          "MetricMind Dashboard"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {result.dashboard?.description ||
                          "AI-generated business analysis"}
                      </p>

                      {result.route && (

                        <span className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1 text-xs text-blue-400">
                          Route: {result.route}
                        </span>

                      )}

                    </div>

                    {result.saved_dashboard?.id && (

                      <button
                        onClick={openDashboard}
                        className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500"
                      >
                        Open Full Dashboard →
                      </button>

                    )}

                  </div>

                  {/* KPI */}

                  {kpis.length > 0 && (

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                      {kpis.map((kpi) => (

                        <div
                          key={kpi.id}
                          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                        >

                          <p className="text-sm text-slate-400">
                            {kpi.title}
                          </p>

                          <p className="mt-3 text-3xl font-bold">

                            {typeof kpi.value === "number"

                              ? kpi.value.toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )

                              : "-"}

                          </p>

                          <p className="mt-2 text-xs text-blue-400">
                            AI Generated KPI
                          </p>

                        </div>

                      ))}

                    </div>

                  )}

                  {/* CHART */}

                  {chart?.config && (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                      <div className="mb-7">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-semibold">
                            {chart.title ||
                              chart.config.title ||
                              "Business Analysis"}
                          </h3>

                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs capitalize text-blue-400">

                            Recommended:{" "}

                            {chart.config.chart_type ||
                              "chart"}

                          </span>

                        </div>

                        <p className="mt-2 text-sm text-slate-500">

                          {chart.config.y_axis ||
                            "Category"}{" "}

                          vs{" "}

                          {chart.config.x_axis ||
                            "Value"}

                        </p>

                      </div>

                      {renderChart()}

                    </div>

                  )}

                  {/* INSIGHT */}

                  {result.executive_summary && (

                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                          ✦
                        </div>

                        <div>

                          <h3 className="font-semibold">
                            Executive Insight
                          </h3>

                          <p className="text-xs text-slate-500">
                            Generated by MetricMind AI
                          </p>

                        </div>

                      </div>

                      <p className="mt-5 whitespace-pre-line leading-7 text-slate-300">
                        {result.executive_summary}
                      </p>

                    </div>

                  )}

                  {/* METADATA */}

                  {result.dashboard?.analysis && (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                      <h3 className="text-lg font-semibold">
                        Analysis Metadata
                      </h3>

                      <div className="mt-5 grid gap-4 md:grid-cols-3">

                        <MetadataCard
                          title="Dataset"
                          value={
                            result.dashboard.analysis.dataset
                          }
                        />

                        <MetadataCard
                          title="Metric"
                          value={
                            result.dashboard.analysis.metric
                          }
                        />

                        <MetadataCard
                          title="Group By"
                          value={
                            result.dashboard.analysis.group_by
                          }
                        />

                      </div>

                      <p className="mt-5 text-xs text-slate-600">
                        Records analyzed: {records.length}
                      </p>

                    </div>

                  )}

                  {/* TRACE */}

                  {result.trace &&
                    result.trace.length > 0 && (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                      <h3 className="text-lg font-semibold">
                        AI Workflow
                      </h3>

                      <div className="mt-5 flex flex-wrap gap-3">

                        {result.trace.map(
                          (node, index) => (

                            <div
                              key={`${node}-${index}`}
                              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                            >

                              <span className="text-xs text-blue-400">
                                Step {index + 1}
                              </span>

                              <p className="mt-1 text-sm text-slate-300">
                                {node}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>

              )}

            </>

          )}

          {/* DASHBOARDS */}

          {activePage === "Dashboards" && (

            <div className="space-y-6">

              <PageHeader
                title="Dashboards"
                description="Open and manage your generated business dashboards."
              />

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                {result?.saved_dashboard?.id ? (

                  <>

                    <p className="text-sm text-slate-400">
                      Latest generated dashboard
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {result.dashboard?.title ||
                        result.saved_dashboard.name ||
                        "MetricMind Dashboard"}
                    </h3>

                    <button
                      onClick={openDashboard}
                      className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                    >
                      Open Dashboard →
                    </button>

                  </>

                ) : (

                  <>

                    <p className="text-slate-400">
                      No dashboard has been generated yet.
                    </p>

                    <button
                      onClick={() =>
                        setActivePage("Ask MetricMind")
                      }
                      className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                    >
                      Create Dashboard →
                    </button>

                  </>

                )}

              </div>

            </div>

          )}

          {/* ANALYTICS */}

          {activePage === "Analytics" && (

            <div className="space-y-6">

              <PageHeader
                title="Analytics"
                description="Review analytical metrics generated by MetricMind."
              />

              {result ? (

                <div className="grid gap-4 md:grid-cols-3">

                  <MetadataCard
                    title="Metric"
                    value={
                      result.dashboard?.analysis?.metric
                    }
                  />

                  <MetadataCard
                    title="Group By"
                    value={
                      result.dashboard?.analysis?.group_by
                    }
                  />

                  <MetadataCard
                    title="Records"
                    value={String(records.length)}
                  />

                </div>

              ) : (

                <EmptyPage
                  message="Run an analysis first to see analytics here."
                />

              )}

            </div>

          )}

          {/* SAVED */}

          {activePage === "Saved" && (

            <div className="space-y-6">

              <PageHeader
                title="Saved"
                description="Your saved MetricMind analyses and dashboards."
              />

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                {result?.saved_dashboard?.id ? (

                  <>

                    <p className="text-xs uppercase tracking-wider text-emerald-400">
                      Saved Dashboard
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {result.saved_dashboard.name ||
                        result.dashboard?.title ||
                        "Saved Dashboard"}
                    </h3>

                    <button
                      onClick={openDashboard}
                      className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500"
                    >
                      Open Saved Dashboard →
                    </button>

                  </>

                ) : (

                  <EmptyPage
                    message="No saved dashboard available yet."
                  />

                )}

              </div>

            </div>

          )}

          {/* SETTINGS */}

          {activePage === "Settings" && (

            <div className="space-y-6">

              <PageHeader
                title="Settings"
                description="MetricMind X system configuration."
              />

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                  <p className="text-sm text-slate-500">
                    Backend
                  </p>

                  <p className="mt-2 font-semibold text-emerald-400">
                    Connected
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    FastAPI · Port 8000
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                  <p className="text-sm text-slate-500">
                    AI Workflow
                  </p>

                  <p className="mt-2 font-semibold text-blue-400">
                    LangGraph
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    Planner → Validation → Analytics → Insight
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>

        <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
          MetricMind X · AI-Powered Semantic Business Intelligence
        </footer>

      </div>

    </main>
  );
}

/* -------------------------------- */
/* COMPONENTS                       */
/* -------------------------------- */

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>

      <p className="text-xs uppercase tracking-wider text-blue-400">
        MetricMind X
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-slate-400">
        {description}
      </p>

    </div>
  );
}

function MetadataCard({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-5">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-white">
        {value || "-"}
      </p>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-4 text-2xl">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function EmptyPage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 p-12 text-center">

      <div className="text-3xl">
        ◫
      </div>

      <p className="mt-4 text-slate-500">
        {message}
      </p>

    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">

      <p className="text-slate-500">
        No visualization data available.
      </p>

    </div>
  );
}