"use client";

import { useEffect } from "react";
import {
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/store";

const RISK_COLORS: Record<number, { text: string; bg: string; border: string; bar: string }> = {
  1: { text: "text-green-400",  bg: "bg-green-950/30",  border: "border-green-800/40",  bar: "bg-green-500" },
  2: { text: "text-lime-400",   bg: "bg-lime-950/30",   border: "border-lime-800/40",   bar: "bg-lime-500" },
  3: { text: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/40", bar: "bg-yellow-500" },
  4: { text: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-700/40", bar: "bg-orange-500" },
  5: { text: "text-red-400",    bg: "bg-red-950/30",    border: "border-red-700/40",    bar: "bg-red-500" },
};

export default function NISTRiskPage() {
  const { nistRisks, loading, error, fetchNISTRisks } = useStore();

  useEffect(() => {
    fetchNISTRisks();
  }, [fetchNISTRisks]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">NIST Risk</h1>
            <p className="text-slate-600 text-sm">SP 800-53 control risk assessment</p>
          </div>
        </div>
        <button
          onClick={() => fetchNISTRisks()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-sm font-medium rounded-xl transition-all disabled:opacity-40"
        >
          <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-800/40 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && nistRisks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-700">
          <ShieldCheck className="w-12 h-12 mb-3 opacity-25" />
          <p className="text-lg font-medium text-slate-600">No NIST risk data</p>
          <p className="text-sm mt-1">Run an analysis or simulation first.</p>
        </div>
      )}

      {/* Risk cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
        {nistRisks.map((risk, idx) => {
          const rc = RISK_COLORS[risk.risk_level] ?? RISK_COLORS[3];
          return (
            <div
              key={risk.control_id}
              className={clsx(
                "border rounded-2xl overflow-hidden animate-fade-in anim-delay",
                rc.bg,
                rc.border
              )}
              style={{ "--anim-delay": `${idx * 40}ms` } as React.CSSProperties}
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={clsx("w-4 h-4", rc.text)} />
                    <span className={clsx("text-lg font-bold font-mono", rc.text)}>
                      {risk.control_id}
                    </span>
                  </div>
                  <div className={clsx(
                    "px-2 py-0.5 rounded-md text-xs font-bold border",
                    rc.text, rc.border, rc.bg
                  )}>
                    Risk {risk.risk_level}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-200 mb-1">{risk.control_name}</h3>
                <p className="text-xs text-slate-600 mb-3">{risk.family}</p>

                {/* Risk bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Risk Level</span>
                    <span className={rc.text}>{risk.risk_level} / 5</span>
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                    <div
                      className={clsx("h-1.5 rounded-full transition-all duration-700", rc.bar)}
                      style={{ width: `${(risk.risk_level / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                  <AlertTriangle className="w-3 h-3" />
                  {risk.detection_count} detection{risk.detection_count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Rationale */}
              <div className="px-5 pb-4 border-t border-slate-800/40 pt-3">
                <div className="flex items-start gap-2 mb-3">
                  <BookOpen className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed">{risk.rationale}</p>
                </div>

                {/* Associated drifts */}
                {risk.associated_drifts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {risk.associated_drifts.map((drift) => (
                      <span
                        key={drift}
                        className="px-2 py-0.5 bg-slate-800/60 border border-slate-700/40 rounded text-[10px] text-slate-400"
                      >
                        {drift}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
