"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type DashboardItem = {
  id: string;
  name: string;
  dashboard?: {
    dashboard_id?: string;
    title?: string;
    description?: string;
    theme?: string;
    analysis?: {
      dataset?: string;
      metric?: string;
      group_by?: string;
      records?: unknown[];
    };
    metadata?: {
      generated_by?: string;
      version?: string;
      generated_at?: string;
      dashboard_type?: string;
    };
  };
};

type DashboardListResponse = {
  status?: string;
  count?: number;
  dashboards?: DashboardItem[];
};

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadDashboards() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/dashboard/list`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data: DashboardListResponse =
        await response.json();

      setDashboards(data.dashboards || []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load saved dashboards. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboards();
  }, []);

  function openDashboard(id: string) {
    window.location.href = `/dashboard?id=${id}`;
  }

  const filteredDashboards = dashboards.filter((item) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    const name =
      item.name?.toLowerCase() || "";

    const title =
      item.dashboard?.title?.toLowerCase() || "";

    const metric =
      item.dashboard?.analysis?.metric?.toLowerCase() || "";

    const groupBy =
      item.dashboard?.analysis?.group_by?.toLowerCase() || "";

    const dataset =
      item.dashboard?.analysis?.dataset?.toLowerCase() || "";

    return (
      name.includes(searchText) ||
      title.includes(searchText) ||
      metric.includes(searchText) ||
      groupBy.includes(searchText) ||
      dataset.includes(searchText)
    );
  });

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
              Dashboard Storage
            </span>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              v1.0.0
            </span>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE HEADER */}
        <div className="mb-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-sm text-blue-400">
                Dashboard Library
              </p>

              <h2 className="mt-1 text-4xl font-bold">
                Saved Dashboards
              </h2>

              <p className="mt-3 max-w-2xl text-slate-400">
                Access dashboards generated and stored by
                MetricMind X.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3">

                <p className="text-xs text-slate-500">
                  Showing Dashboards
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-400">
                  {filteredDashboards.length}
                </p>

              </div>

              <button
                onClick={loadDashboards}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </div>

          {/* SEARCH */}
          <div className="mt-6 max-w-2xl">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Search Dashboards
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, metric, group by, or dataset..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />

            {search && (
              <p className="mt-2 text-xs text-slate-500">
                Searching for:{" "}
                <span className="text-blue-400">
                  {search}
                </span>
              </p>
            )}

          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">

            <p className="font-medium text-red-400">
              Dashboard Loading Failed
            </p>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-slate-300">
              Loading saved dashboards...
            </p>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          dashboards.length === 0 && (

            <div className="rounded-2xl border border-dashed border-slate-800 p-14 text-center">

              <h3 className="text-xl font-semibold">
                No saved dashboards
              </h3>

              <p className="mt-2 text-slate-400">
                Analyze a business question to create
                your first dashboard.
              </p>

              <a
                href="/"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500"
              >
                Create Dashboard
              </a>

            </div>
          )}

        {/* NO SEARCH RESULTS */}
        {!loading &&
          !error &&
          dashboards.length > 0 &&
          filteredDashboards.length === 0 && (

            <div className="rounded-2xl border border-dashed border-slate-800 p-14 text-center">

              <h3 className="text-xl font-semibold">
                No dashboards found
              </h3>

              <p className="mt-2 text-slate-400">
                Try searching by dashboard name,
                metric, group by, or dataset.
              </p>

              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
              >
                Clear Search
              </button>

            </div>
          )}

        {/* DASHBOARD GRID */}
        {!loading &&
          !error &&
          filteredDashboards.length > 0 && (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredDashboards.map(
                (item, index) => {

                  const dashboard =
                    item.dashboard;

                  const analysis =
                    dashboard?.analysis;

                  const metadata =
                    dashboard?.metadata;

                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-blue-500/40"
                    >

                      {/* CARD HEADER */}
                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-xs font-medium text-blue-400">
                            Dashboard {index + 1}
                          </p>

                          <h3 className="mt-2 text-xl font-semibold">
                            {item.name ||
                              dashboard?.title ||
                              "MetricMind Dashboard"}
                          </h3>

                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
                          Saved
                        </span>

                      </div>

                      {/* DESCRIPTION */}
                      <p className="mt-3 min-h-[40px] text-sm text-slate-400">
                        {dashboard?.description ||
                          "AI-generated business dashboard"}
                      </p>

                      {/* ANALYSIS INFO */}
                      {analysis && (
                        <div className="mt-5 space-y-3">

                          <div className="rounded-xl bg-slate-950 p-4">

                            <p className="text-xs text-slate-500">
                              Dataset
                            </p>

                            <p className="mt-1 truncate text-sm font-medium">
                              {analysis.dataset || "-"}
                            </p>

                          </div>

                          <div className="grid grid-cols-2 gap-3">

                            <div className="rounded-xl bg-slate-950 p-4">

                              <p className="text-xs text-slate-500">
                                Metric
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                {analysis.metric || "-"}
                              </p>

                            </div>

                            <div className="rounded-xl bg-slate-950 p-4">

                              <p className="text-xs text-slate-500">
                                Group By
                              </p>

                              <p className="mt-1 truncate text-sm font-medium">
                                {analysis.group_by || "-"}
                              </p>

                            </div>

                          </div>

                        </div>
                      )}

                      {/* METADATA */}
                      <div className="mt-5 border-t border-slate-800 pt-4">

                        <div className="flex justify-between text-xs">

                          <span className="text-slate-500">
                            Version
                          </span>

                          <span className="text-slate-300">
                            {metadata?.version || "1.0"}
                          </span>

                        </div>

                        {metadata?.generated_at && (
                          <div className="mt-2 flex justify-between text-xs">

                            <span className="text-slate-500">
                              Created
                            </span>

                            <span className="text-slate-400">
                              {new Date(
                                metadata.generated_at
                              ).toLocaleDateString()}
                            </span>

                          </div>
                        )}

                      </div>

                      {/* ID */}
                      <div className="mt-4 rounded-lg bg-slate-950 p-3">

                        <p className="text-xs text-slate-500">
                          Dashboard ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-blue-400">
                          {item.id}
                        </p>

                      </div>

                      {/* OPEN BUTTON */}
                      <button
                        onClick={() =>
                          openDashboard(item.id)
                        }
                        className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500"
                      >
                        Open Dashboard →
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        MetricMind X · AI-Powered Semantic Business Intelligence Platform
      </footer>

    </main>
  );
}