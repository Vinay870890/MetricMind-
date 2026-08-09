interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function KPICard({
  title,
  value,
  description,
}: KPICardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-emerald-400">
          {description}
        </p>
      )}
    </div>
  );
}