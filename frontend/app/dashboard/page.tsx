"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

type RecordItem = Record<string, unknown>;

type DashboardData = {
  dashboard_id?: string;
  title?: string;
  description?: string;
  theme?: string;

  analysis?: {
    dataset?: string;
    metric?: string;
    group_by?: string;
    records?: RecordItem[];
  };

  metadata?: {
    generated_by?: string;
    version?: string;
    generated_at?: string;
    dashboard_type?: string;
  };
};

type DashboardResponse = {
  status?: string;
  message?: string;
  dashboard?: DashboardData;
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id");

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    if (!dashboardId) {
      setError("Dashboard ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/dashboard/${encodeURIComponent(
          dashboardId
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data: DashboardResponse =
        await response.json();

      if (
        data.status === "error" ||
        !data.dashboard
      ) {
        throw new Error(
          data.message || "Dashboard not found."
        );
      }

      setDashboard(data.dashboard);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [dashboardId]);

  function goBack() {
    window.location.href = "/dashboards";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-slate-300">
              Loading dashboard...
            </p>

          </div>
        </div>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">

        <header className="border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-5">

            <h1 className="text-2xl font-bold">
              MetricMind X
            </h1>

            <p className="text-sm text-slate-400">
              AI-Powered Semantic Business Intelligence
            </p>

          </div>
        </header>

        <section className="mx-auto max-w-4xl px-6 py-20">

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">

            <div className="text-4xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Dashboard Loading Failed
            </h2>

            <p className="mt-3 text-red-300">
              {error || "Dashboard not found."}
            </p>

            <button
              onClick={goBack}
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
            >
              ← Back to Dashboards
            </button>

          </div>

        </section>

      </main>
    );
  }

  const analysis = dashboard.analysis;
  const metadata = dashboard.metadata;
  const records = analysis?.records || [];

  const metric = analysis?.metric || "Metric";
  const groupBy = analysis?.group_by || "Category";

  /*
   * Convert record values into numbers where possible.
   */
  function getNumericValue(
    record: RecordItem
  ): number {
    const possibleKeys = [
      metric,
      metric.toLowerCase(),
      "value",
      "total",
      "sales",
      "profit",
      "quantity",
      "discount",
    ];

    for (const key of possibleKeys) {
      const value = record[key];

      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return value;
      }

      if (typeof value === "string") {
        const numeric = Number(
          value.replace(/,/g, "")
        );

        if (Number.isFinite(numeric)) {
          return numeric;
        }
      }
    }

    return 0;
  }

  function getGroupValue(
    record: RecordItem
  ): string {
    const possibleKeys = [
      groupBy,
      groupBy.toLowerCase(),
      "group",
      "name",
      "category",
      "Customer Name",
      "Product Name",
      "Region",
      "Country",
    ];

    for (const key of possibleKeys) {
      const value = record[key];

      if (
        typeof value === "string" ||
        typeof value === "number"
      ) {
        return String(value);
      }
    }

    return "Unknown";
  }

  const chartData = records.map(
    (record) => ({
      label: getGroupValue(record),
      value: getNumericValue(record),
    })
  );

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const average =
    chartData.length > 0
      ? total / chartData.length
      : 0;

  const highest =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) => item.value
          )
        )
      : 0;

  const lowest =
    chartData.length > 0
      ? Math.min(
          ...chartData.map(
            (item) => item.value
          )
        )
      : 0;

  const highestItem =
    chartData.find(
      (item) => item.value === highest
    );

  const lowestItem =
    chartData.find(
      (item) => item.value === lowest
    );

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    ).format(value);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold">
              MetricMind X
            </h1>

            <p className="text-sm text-slate-400">
              AI-Powered Semantic Business Intelligence
            </p>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              Saved Dashboard
            </span>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              v{metadata?.version || "1.0"}
            </span>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* TOP BAR */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

          <div>

            <button
              onClick={goBack}
              className="mb-5 text-sm text-blue-400 transition hover:text-blue-300"
            >
              ← Back to Dashboard Library
            </button>

            <p className="text-sm text-blue-400">
              Business Intelligence Dashboard
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {dashboard.title ||
                "MetricMind Dashboard"}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-400">
              {dashboard.description ||
                "AI-generated business intelligence dashboard."}
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">

            <p className="text-xs text-slate-500">
              Dashboard ID
            </p>

            <p className="mt-1 max-w-xs break-all font-mono text-xs text-blue-400">
              {dashboardId}
            </p>

          </div>

        </div>

        {/* KPI CARDS */}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Total {metric}
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {formatNumber(total)}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Average
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {formatNumber(average)}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Highest
            </p>

            <p className="mt-3 text-3xl font-bold text-purple-400">
              {formatNumber(highest)}
            </p>

            {highestItem && (
              <p className="mt-2 truncate text-xs text-slate-400">
                {highestItem.label}
              </p>
            )}

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Lowest
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-400">
              {formatNumber(lowest)}
            </p>

            {lowestItem && (
              <p className="mt-2 truncate text-xs text-slate-400">
                {lowestItem.label}
              </p>
            )}

          </div>

        </div>

        {/* ANALYSIS SUMMARY */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                  Analysis
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {metric} by {groupBy}
                </h3>

              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                {records.length} Records
              </span>

            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">

              <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs font-medium text-slate-500">

                <span>
                  {groupBy}
                </span>

                <span className="text-right">
                  {metric}
                </span>

                <span className="text-right">
                  Share
                </span>

              </div>

              <div className="max-h-[500px] overflow-y-auto">

                {chartData.length === 0 ? (

                  <div className="p-10 text-center text-sm text-slate-500">
                    No analysis records available.
                  </div>

                ) : (

                  chartData.map(
                    (item, index) => {

                      const share =
                        total !== 0
                          ? (
                              (item.value /
                                total) *
                              100
                            )
                          : 0;

                      return (
                        <div
                          key={`${item.label}-${index}`}
                          className="grid grid-cols-3 border-b border-slate-800 px-4 py-4 text-sm last:border-0 hover:bg-slate-800/40"
                        >

                          <span className="truncate pr-4 text-slate-300">
                            {item.label}
                          </span>

                          <span className="text-right font-medium text-white">
                            {formatNumber(
                              item.value
                            )}
                          </span>

                          <span className="text-right text-slate-400">
                            {share.toFixed(1)}%
                          </span>

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </div>

          </div>

          {/* INSIGHTS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              AI Insight
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              Business Summary
            </h3>

            <div className="mt-6 space-y-5">

              <div className="rounded-xl bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Top Performer
                </p>

                <p className="mt-2 font-semibold text-white">
                  {highestItem?.label ||
                    "-"}
                </p>

                <p className="mt-1 text-sm text-emerald-400">
                  {formatNumber(highest)}
                </p>

              </div>

              <div className="rounded-xl bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Lowest Performer
                </p>

                <p className="mt-2 font-semibold text-white">
                  {lowestItem?.label ||
                    "-"}
                </p>

                <p className="mt-1 text-sm text-orange-400">
                  {formatNumber(lowest)}
                </p>

              </div>

              <div className="rounded-xl bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Dataset
                </p>

                <p className="mt-2 break-words font-medium text-white">
                  {analysis?.dataset ||
                    "-"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Generated By
                </p>

                <p className="mt-2 font-medium text-blue-400">
                  {metadata?.generated_by ||
                    "MetricMind X"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* VISUAL BAR CHART */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                Visualization
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                {metric} Distribution
              </h3>

            </div>

            <span className="text-xs text-slate-500">
              {groupBy}
            </span>

          </div>

          <div className="mt-8 space-y-5">

            {chartData.length === 0 ? (

              <div className="py-10 text-center text-slate-500">
                No visualization data available.
              </div>

            ) : (

              chartData.map(
                (item, index) => {

                  const percentage =
                    highest > 0
                      ? (item.value /
                          highest) *
                        100
                      : 0;

                  return (
                    <div
                      key={`bar-${item.label}-${index}`}
                    >

                      <div className="mb-2 flex items-center justify-between gap-4 text-sm">

                        <span className="max-w-[60%] truncate text-slate-300">
                          {item.label}
                        </span>

                        <span className="font-medium text-white">
                          {formatNumber(
                            item.value
                          )}
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{
                            width: `${Math.max(
                              percentage,
                              item.value > 0
                                ? 1
                                : 0
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )

            )}

          </div>

        </div>

        {/* METADATA */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Dashboard Metadata
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs text-slate-500">
                Dashboard Type
              </p>

              <p className="mt-2 text-sm font-medium">
                {metadata?.dashboard_type ||
                  "Business Intelligence"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs text-slate-500">
                Version
              </p>

              <p className="mt-2 text-sm font-medium">
                {metadata?.version ||
                  "1.0"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs text-slate-500">
                Generated By
              </p>

              <p className="mt-2 text-sm font-medium">
                {metadata?.generated_by ||
                  "MetricMind X"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs text-slate-500">
                Created
              </p>

              <p className="mt-2 text-sm font-medium">

                {metadata?.generated_at
                  ? new Date(
                      metadata.generated_at
                    ).toLocaleString()
                  : "-"}

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">

        MetricMind X · AI-Powered Semantic Business Intelligence Platform

      </footer>

    </main>
  );
}