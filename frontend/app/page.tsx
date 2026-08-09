"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type RecordData = {
  [key: string]: string | number;
};

type DashboardWidget = {
  id: string;
  type: string;
  width?: number;
  height?: number;
  title?: string;
  value?: number;
  description?: string;
  created_by?: string;
  config?: {
    chart_type?: string;
    title?: string;
    x_axis?: string;
    y_axis?: string;
    labels?: string[];
    values?: number[];
    color?: string;
    sort?: string;
    format?: string;
    insight?: string;
  };
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
  theme?: string;
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

export default function Home() {
  const [question, setQuestion] = useState("Sales by Region");
  const [result, setResult] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeQuestion() {
    if (!question.trim()) {
      setError("Please enter a business question.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/langgraph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: DashboardResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to MetricMind backend. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function openDashboard() {
    const dashboardId = result?.saved_dashboard?.id;

    if (!dashboardId) {
      setError("Dashboard ID was not returned by the backend.");
      return;
    }

    window.location.href = `/dashboard?id=${dashboardId}`;
  }

  const widgets = result?.dashboard?.widgets || [];
  const kpis = widgets.filter((widget) => widget.type === "kpi");
  const chart = widgets.find((widget) => widget.type === "chart");
  const records = result?.dashboard?.analysis?.records || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">MetricMind X</h1>
            <p className="text-sm text-slate-400">
              AI-Powered Semantic Business Intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              Backend Ready
            </span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              v1.0.0
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Business Intelligence,
            <span className="text-blue-400"> powered by AI.</span>
          </h2>
          <p className="mt-3 max-w-3xl text-slate-400">
            Ask business questions in natural language and let MetricMind X
            transform them into governed analytics, insights and dashboards.
          </p>
        </div>

        {/* Query Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Ask MetricMind
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  analyzeQuestion();
                }
              }}
              placeholder="e.g. Sales by Region"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <button
              onClick={analyzeQuestion}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-7 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-8">
            {/* Result Header */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-blue-400">Analysis Result</p>
                <h3 className="mt-1 text-2xl font-semibold">
                  {result.dashboard?.title || "MetricMind Dashboard"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {result.dashboard?.description ||
                    "AI-generated business dashboard"}
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
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500"
                >
                  Open Dashboard →
                </button>
              )}
            </div>

            {/* Saved Dashboard ID */}
            {result.saved_dashboard?.id && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs text-slate-500">Saved Dashboard ID</p>
                <p className="mt-1 break-all font-mono text-sm text-emerald-400">
                  {result.saved_dashboard.id}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Dashboard successfully stored by MetricMind X.
                </p>
              </div>
            )}

            {/* KPI Cards */}
            {kpis.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                  <div
                    key={kpi.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
                  >
                    <p className="text-sm text-slate-400">{kpi.title}</p>
                    <p className="mt-2 text-3xl font-bold">
                      {typeof kpi.value === "number"
                        ? kpi.value.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "-"}
                    </p>
                    <p className="mt-2 text-xs text-blue-400">
                      MetricMind X KPI
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Chart */}
            {chart?.config && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {chart.title || chart.config.title || "Business Chart"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {chart.config.y_axis || "Category"} vs{" "}
                      {chart.config.x_axis || "Value"}
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                    {chart.config.chart_type || "chart"}
                  </span>
                </div>

                <div className="space-y-4">
                  {records.map((record, index) => {
                    const labels = chart.config?.labels || [];
                    const values = chart.config?.values || [];

                    const label =
                      labels[index] ||
                      String(record[chart.config?.y_axis || ""] || "");

                    const value =
                      values[index] ??
                      Number(record[chart.config?.x_axis || ""] || 0);

                    const maxValue = Math.max(...values, 1);
                    const percentage = (value / maxValue) * 100;

                    return (
                      <div key={`${label}-${index}`}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-slate-300">{label}</span>
                          <span className="text-slate-400">
                            {value.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Executive Summary */}
            {result.executive_summary && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-xl font-semibold">Executive Summary</h3>
                <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                  {result.executive_summary}
                </p>
              </div>
            )}

            {/* Analysis Metadata */}
            {result.dashboard?.analysis && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-xl font-semibold">Analysis Metadata</h3>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Dataset</p>
                    <p className="mt-1 font-medium">
                      {result.dashboard.analysis.dataset || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Metric</p>
                    <p className="mt-1 font-medium">
                      {result.dashboard.analysis.metric || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Group By</p>
                    <p className="mt-1 font-medium">
                      {result.dashboard.analysis.group_by || "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* LangGraph Workflow */}
            {result.trace && result.trace.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-xl font-semibold">LangGraph Workflow</h3>

                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {result.trace.map((node, index) => (
                    <div
                      key={`${node}-${index}`}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <span className="text-xs text-blue-400">
                        Step {index + 1}
                      </span>
                      <p className="mt-2 text-sm font-medium">{node}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <h3 className="text-xl font-semibold">Ready for analysis</h3>
            <p className="mt-2 text-slate-400">Try asking:</p>
            <button
              onClick={() => setQuestion("Sales by Region")}
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-blue-400 hover:bg-slate-700"
            >
              Sales by Region
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        MetricMind X · AI-Powered Semantic Business Intelligence Platform
      </footer>
    </main>
  );
}