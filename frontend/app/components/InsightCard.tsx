interface InsightCardProps {
  summary: string;
}

export default function InsightCard({
  summary,
}: InsightCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">
        Executive Summary
      </h3>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">
        {summary}
      </p>
    </div>
  );
}