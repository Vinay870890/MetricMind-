"use client";

import { useEffect, useMemo, useState } from "react";

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

type DashboardData = {
  dashboard_id?: string;
  title?: string;
  description?: string;
  theme?: string;

  layout?: {
    type?: string;
    columns?: number;
    responsive?: boolean;
    gap?: number;
  };

  filters?: {
    name?: string;
    type?: string;
  }[];

  widgets?: DashboardWidget[];

  interactions?: {
    cross_filter?: boolean;
    drill_down?: boolean;
    sorting?: boolean;
    pagination?: boolean;
    search?: boolean;
    refresh?: boolean;
  };

  export?: {
    csv?: boolean;
    excel?: boolean;
    pdf?: boolean;
    json?: boolean;
  };

  analysis?: {
    dataset?: string;
    metric?: string;
    group_by?: string;
    records?: RecordData[];
  };

  metadata?: {
    generated_by?: string;
    version?: string;
    generated_at?: string;
    dashboard_type?: string;
  };
};

type ApiResponse = {
  status?: string;

  dashboard?: {
    id?: string;
    name?: string;
    dashboard?: DashboardData;
  };
};

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [dashboardId, setDashboardId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [regionFilter, setRegionFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState<"desc" | "asc">("desc");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const id = params.get("id");

        if (!id) {
          throw new Error(
            "Dashboard ID is missing from the URL."
          );
        }

        setDashboardId(id);

        const response = await fetch(
          `${API_URL}/api/dashboard/${id}`
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data: ApiResponse =
          await response.json();

        const actualDashboard =
          data.dashboard?.dashboard;

        if (!actualDashboard) {
          throw new Error(
            "Dashboard data was not found."
          );
        }

        setDashboard(actualDashboard);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load dashboard."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const records =
    dashboard?.analysis?.records || [];

  const groupBy =
    dashboard?.analysis?.group_by || "";

  const metric =
    dashboard?.analysis?.metric || "";

  const regionValues = useMemo(() => {
    const values = records
      .map((record) =>
        String(record["Region"] || "")
      )
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [records]);

  const categoryValues = useMemo(() => {
    const values = records
      .map((record) =>
        String(record["Category"] || "")
      )
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    if (regionFilter !== "all") {
      filtered = filtered.filter(
        (record) =>
          String(record["Region"] || "") ===
          regionFilter
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (record) =>
          String(record["Category"] || "") ===
          categoryFilter
      );
    }

    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      filtered = filtered.filter((record) =>
        Object.values(record).some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        )
      );
    }

    return filtered;
  }, [
    records,
    regionFilter,
    categoryFilter,
    search,
  ]);

  const chartData = useMemo(() => {
    if (!groupBy || !metric) {
      return [];
    }

    const grouped: Record<
      string,
      number
    > = {};

    filteredRecords.forEach((record) => {
      const group =
        String(record[groupBy] || "");

      const value =
        Number(record[metric]) || 0;

      if (!group) {
        return;
      }

      grouped[group] =
        (grouped[group] || 0) + value;
    });

    return Object.entries(grouped)
      .map(([label, value]) => ({
        label,
        value,
      }))
      .sort((a, b) =>
        sortOrder === "desc"
          ? b.value - a.value
          : a.value - b.value
      );
  }, [
    filteredRecords,
    groupBy,
    metric,
    sortOrder,
  ]);

  const totalValue = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );
  }, [chartData]);

  const averageValue =
    chartData.length > 0
      ? totalValue / chartData.length
      : 0;

  const highestValue =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) => item.value
          )
        )
      : 0;

  const lowestValue =
    chartData.length > 0
      ? Math.min(
          ...chartData.map(
            (item) => item.value
          )
        )
      : 0;

  function resetFilters() {
    setRegionFilter("all");
    setCategoryFilter("all");
    setSearch("");
    setSortOrder("desc");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

          <p className="text-slate-300">
            Loading MetricMind Dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="w-full max-w-xl rounded-2xl border border-red-500/30 bg-slate-900 p-8 text-center">

          <h1 className="text-2xl font-bold text-red-400">
            Dashboard Loading Failed
          </h1>

          <p className="mt-4 text-slate-300">
            {error}
          </p>

          <div className="mt-6 rounded-xl bg-slate-950 p-4 text-left">

            <p className="text-xs text-slate-500">
              Dashboard ID
            </p>

            <p className="mt-1 break-all font-mono text-sm text-blue-400">
              {dashboardId ||
                "Not provided"}
            </p>

          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
          >
            Retry
          </button>

        </div>

      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        No dashboard data available.
      </main>
    );
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
              Dashboard Live
            </span>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              v1.0.0
            </span>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* DASHBOARD HEADER */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

          <div>

            <p className="text-sm text-blue-400">
              AI Generated Dashboard
            </p>

            <h2 className="mt-1 text-4xl font-bold">
              {dashboard.title ||
                "MetricMind Dashboard"}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-400">
              {dashboard.description ||
                "Business intelligence dashboard generated by MetricMind X."}
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

        {/* FILTER PANEL */}

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h3 className="text-xl font-semibold">
                Dashboard Filters
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Filter and explore the generated analysis.
              </p>

            </div>

            <button
              onClick={resetFilters}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
            >
              Reset Filters
            </button>

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* REGION */}

            {regionValues.length > 0 && (

              <div>

                <label className="mb-2 block text-xs text-slate-500">
                  Region
                </label>

                <select
                  value={regionFilter}
                  onChange={(event) =>
                    setRegionFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >

                  <option value="all">
                    All Regions
                  </option>

                  {regionValues.map(
                    (region) => (
                      <option
                        key={region}
                        value={region}
                      >
                        {region}
                      </option>
                    )
                  )}

                </select>

              </div>

            )}

            {/* CATEGORY */}

            {categoryValues.length > 0 && (

              <div>

                <label className="mb-2 block text-xs text-slate-500">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >

                  <option value="all">
                    All Categories
                  </option>

                  {categoryValues.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

              </div>

            )}

            {/* SEARCH */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search data..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* SORT */}

            <div>

              <label className="mb-2 block text-xs text-slate-500">
                Sort
              </label>

              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as
                      | "desc"
                      | "asc"
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >

                <option value="desc">
                  Highest → Lowest
                </option>

                <option value="asc">
                  Lowest → Highest
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* KPI CARDS */}

        <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Total {metric}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalValue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </p>

            <p className="mt-2 text-xs text-blue-400">
              Filtered result
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Average {metric}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {averageValue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </p>

            <p className="mt-2 text-xs text-blue-400">
              Calculated dynamically
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Highest {metric}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {highestValue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              Highest filtered value
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Lowest {metric}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {lowestValue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                }
              )}
            </p>

            <p className="mt-2 text-xs text-red-400">
              Lowest filtered value
            </p>

          </div>

        </div>

        {/* CHART */}

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h3 className="text-2xl font-semibold">
                {groupBy
                  ? `${metric} by ${groupBy}`
                  : "Business Analysis"}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {filteredRecords.length} filtered record groups
              </p>

            </div>

            <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
              Interactive Chart
            </span>

          </div>

          {chartData.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">

              <p className="text-slate-400">
                No data matches the selected filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
              >
                Reset Filters
              </button>

            </div>

          ) : (

            <div className="space-y-5">

              {chartData.map(
                (item) => {

                  const maxValue =
                    Math.max(
                      ...chartData.map(
                        (entry) =>
                          entry.value
                      ),
                      1
                    );

                  const percentage =
                    (item.value /
                      maxValue) *
                    100;

                  return (

                    <div
                      key={item.label}
                    >

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm font-medium text-slate-300">
                          {item.label}
                        </span>

                        <span className="text-sm text-slate-400">
                          {item.value.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>

                      </div>

                      <div className="h-4 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

        {/* ANALYSIS METADATA */}

        {dashboard.analysis && (

          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-xl font-semibold">
              Analysis Metadata
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-slate-950 p-5">

                <p className="text-xs text-slate-500">
                  Dataset
                </p>

                <p className="mt-2 font-medium">
                  {dashboard.analysis.dataset ||
                    "-"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-950 p-5">

                <p className="text-xs text-slate-500">
                  Metric
                </p>

                <p className="mt-2 font-medium">
                  {dashboard.analysis.metric ||
                    "-"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-950 p-5">

                <p className="text-xs text-slate-500">
                  Group By
                </p>

                <p className="mt-2 font-medium">
                  {dashboard.analysis.group_by ||
                    "-"}
                </p>

              </div>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Records available:{" "}
              {records.length}
              {" · "}
              Records after filters:{" "}
              {filteredRecords.length}
            </p>

          </div>

        )}

        {/* CAPABILITIES */}

        {dashboard.interactions && (

          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-xl font-semibold">
              Dashboard Capabilities
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {dashboard.interactions.cross_filter && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                  <p className="font-semibold text-blue-400">
                    Cross Filtering
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Interactive dashboard filtering support.
                  </p>

                </div>
              )}

              {dashboard.interactions.drill_down && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                  <p className="font-semibold text-blue-400">
                    Drill Down
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Explore business data at deeper levels.
                  </p>

                </div>
              )}

              {dashboard.interactions.sorting && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                  <p className="font-semibold text-blue-400">
                    Sorting
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Sort dashboard data dynamically.
                  </p>

                </div>
              )}

              {dashboard.interactions.search && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                  <p className="font-semibold text-blue-400">
                    Search
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Search through dashboard data.
                  </p>

                </div>
              )}

            </div>

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