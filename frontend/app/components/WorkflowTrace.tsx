interface WorkflowTraceProps {
  trace: string[];
}

export default function WorkflowTrace({
  trace,
}: WorkflowTraceProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">
        LangGraph Workflow
      </h3>

      <div className="mt-5 flex flex-wrap gap-3">
        {trace.map((step, index) => (
          <div
            key={`${step}-${index}`}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}