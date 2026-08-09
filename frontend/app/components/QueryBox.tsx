"use client";

import { useState } from "react";

interface QueryBoxProps {
  onAnalyze: (question: string) => void;
  loading?: boolean;
}

export default function QueryBox({
  onAnalyze,
  loading = false,
}: QueryBoxProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    onAnalyze(trimmedQuestion);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <label className="mb-3 block text-sm font-medium text-slate-300">
        Ask MetricMind
      </label>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="e.g. Sales by Region"
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setQuestion("Sales by Region");
          }}
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          Try: Sales by Region
        </button>
      </div>
    </div>
  );
}