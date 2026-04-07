"use client";

import { useEffect, useRef, useState } from "react";
import {
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import clsx from "clsx";
import { clearHistory, getHistory, type HistoryEntry } from "../../lib/history";

const SEVERITY_META: Record<number, { text: string; bg: string; border: string }> = {
  0: { text: "text-slate-500",  bg: "bg-slate-800",      border: "border-slate-700"      },
  1: { text: "text-green-400",  bg: "bg-green-900/40",   border: "border-green-700/40"   },
  2: { text: "text-lime-400",   bg: "bg-lime-900/40",    border: "border-lime-700/40"    },
  3: { text: "text-yellow-400", bg: "bg-yellow-900/40",  border: "border-yellow-700/40"  },
  4: { text: "text-orange-400", bg: "bg-orange-900/40",  border: "border-orange-700/40"  },
  5: { text: "text-red-400",    bg: "bg-red-900/40",     border: "border-red-700/40"     },
};

export default function HistoryPage() {
  const [entries,  setEntries]  = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query,    setQuery]    = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntries([...getHistory()].reverse());
  }, []);

  const handleClear = () => {
    if (!confirm("Delete all analysis history? This cannot be undone.")) return;
    clearHistory();
    setEntries([]);
  };

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  // Filter
  const filtered = entries.filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return e.results.some(
      (r) =>
        r.drift_detected.toLowerCase().includes(q) ||
        r.nist_controls_at_risk.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center justify-center">
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
            <p className="text-slate-600 text-sm">
              {entries.length} analyses · stored in your browser
            </p>
          </div>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 border border-red-500/30 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* ── Search bar ── */}
      {entries.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by drift type or NIST control…"
            className="w-full bg-[#070e1d] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-700">
          <History className="w-12 h-12 mb-3 opacity-25" />
          <p className="text-lg font-medium text-slate-600">No history yet</p>
          <p className="text-sm mt-1">Run an analysis to see results here.</p>
        </div>
      )}

      {/* ── No results after filter ── */}
      {entries.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-slate-700">
          <Search className="w-8 h-8 mb-2 opacity-25" />
          <p className="text-sm">No matches for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {/* ── Entry list ── */}
      <div className="space-y-3 pb-8">
        {filtered.map((entry, entryIdx) => {
          const drifts = entry.results.filter(
            (r) => r.drift_detected !== "Insufficient signal"
          );
          const maxSev  = drifts.length
            ? Math.max(...drifts.map((r) => r.severity))
            : 0;
          const sevMeta = SEVERITY_META[maxSev] ?? SEVERITY_META[0];
          const isOpen  = expanded.has(entry.id);

          return (
            <div
              key={entry.id}
              className="bg-[#070e1d] border border-slate-800/60 rounded-2xl overflow-hidden animate-fade-in anim-delay"
              style={{ "--anim-delay": `${entryIdx * 30}ms` } as React.CSSProperties}
            >
              {/* Row (toggle) */}
              <button
                onClick={() => toggle(entry.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                {/* Severity badge */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold flex-shrink-0",
                    sevMeta.text,
                    sevMeta.bg,
                    sevMeta.border
                  )}
                >
                  {maxSev || "—"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {drifts.length > 0
                      ? drifts.map((r) => r.drift_detected).join(" · ")
                      : "No drift detected"}
                  </p>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString()} ·{" "}
                    {entry.logCount} log{entry.logCount !== 1 ? "s" : ""} ·{" "}
                    {entry.processingMs.toFixed(1)} ms
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {drifts.length > 0 && (
                    <AlertTriangle className="w-4 h-4 text-orange-500/60" />
                  )}
                  <span className="text-xs text-slate-700">
                    {drifts.length} drift{drifts.length !== 1 ? "s" : ""}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-700" />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-slate-800/60 p-5 space-y-3">
                  {entry.results.map((r, i) => {
                    const isInsuff = r.drift_detected === "Insufficient signal";
                    const rm       = SEVERITY_META[r.severity] ?? SEVERITY_META[0];
                    return (
                      <div
                        key={i}
                        className={clsx(
                          "rounded-xl p-4 border",
                          isInsuff
                            ? "bg-slate-900/30 border-slate-800"
                            : clsx(rm.bg, rm.border)
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold text-sm">
                            {r.drift_detected}
                          </span>
                          {!isInsuff && (
                            <span className={clsx("text-xs font-bold", rm.text)}>
                              {r.severity} / 5
                            </span>
                          )}
                        </div>

                        {!isInsuff && (
                          <>
                            {/* NIST controls */}
                            {r.nist_controls_at_risk.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {r.nist_controls_at_risk.map((c) => (
                                  <span
                                    key={c}
                                    className="px-2 py-0.5 bg-red-950/40 border border-red-800/40 text-red-300 rounded-lg text-xs font-mono"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Confidence bar */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex-1 bg-slate-800 rounded-full h-1">
                                <div
                                  className="h-1 rounded-full bg-cyan-500 transition-all duration-500 bar-progress"
                                  style={{ "--bar-width": `${r.confidence * 100}%` } as React.CSSProperties}
                                />
                              </div>
                              <span className="text-xs text-slate-600">
                                {(r.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                              {r.explanation}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
