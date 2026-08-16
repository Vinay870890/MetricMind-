"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: "⌂",
  },
  {
    name: "Ask MetricMind",
    href: "/?view=ask",
    icon: "✦",
  },
  {
    name: "Dashboards",
    href: "/dashboard",
    icon: "▣",
  },
];

const secondaryNavigation = [
  {
    name: "Analytics",
    href: "/?view=analytics",
    icon: "▤",
  },
  {
    name: "Data Explorer",
    href: "/?view=explorer",
    icon: "◫",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* BRAND */}
      <div className="border-b border-slate-800 px-6 py-6">
        <Link href="/" className="block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              M
            </div>

            <div>
              <h1 className="font-bold text-white">
                MetricMind X
              </h1>

              <p className="text-xs text-slate-500">
                Semantic BI Platform
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const active =
              item.name === "Dashboards"
                ? pathname.startsWith("/dashboard")
                : pathname === "/" &&
                  (item.name === "Overview");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Explore
        </p>

        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              <span className="w-5 text-center text-lg">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          ))}
        </div>

      </nav>

      {/* SYSTEM */}
      <div className="border-t border-slate-800 p-4">

        <Link
          href="/?view=settings"
          className="mb-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <span className="text-lg">⚙</span>
          <span>Settings</span>
        </Link>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-medium text-emerald-400">
              Backend Connected
            </span>
          </div>

          <p className="mt-1 text-[11px] text-slate-600">
            FastAPI · LangGraph
          </p>

        </div>

      </div>

    </aside>
  );
}