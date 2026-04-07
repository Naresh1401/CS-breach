"use client";

import { useEffect } from "react";
import {
  Radar,
  RefreshCw,
  Shield,
  Info,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/store";

const DRIFT_COLORS: Record<string, { ring: string; bg: string; text: string }> = {
  "Fatigue/Numbness":       { ring: "border-amber-500/50",  bg: "bg-amber-500/10",  text: "text-amber-400" },
  "Overconfidence":         { ring: "border-red-500/50",    bg: "bg-red-500/10",    text: "text-red-400" },
  "Hurry/Urgency Override": { ring: "border-orange-500/50", bg: "bg-orange-500/10", text: "text-orange-400" },
  "Quiet Fear/Avoidance":   { ring: "border-purple-500/50", bg: "bg-purple-500/10", text: "text-purple-400" },
  "Hoarding/Control Grip":  { ring: "border-blue-500/50",   bg: "bg-blue-500/10",   text: "text-blue-400" },
  "Compliance Theater":     { ring: "border-pink-500/50",   bg: "bg-pink-500/10",   text: "text-pink-400" },
};

const SEV_META: Record<number, { text: string; bg: string; border: string }> = {
  1: { text: "text-green-400",  bg: "bg-green-900/40",  border: "border-green-700/40" },
  2: { text: "text-lime-400",   bg: "bg-lime-900/40",   border: "border-lime-700/40" },
  3: { text: "text-yellow-400", bg: "bg-yellow-900/40", border: "border-yellow-700/40" },
  4: { text: "text-orange-400", bg: "bg-orange-900/40", border: "border-orange-700/40" },
  5: { text: "text-red-400",    bg: "bg-red-900/40",    border: "border-red-700/40" },
};

const DEFAULT_DC = { ring: "border-cyan-500/50", bg: "bg-cyan-500/10", text: "text-cyan-400" };

export default function DriftMapPage() {
  const { driftDetections, loading, error, fetchDrift } = useStore();

  useEffect(() => {
    fetchDrift();
  }, [fetchDrift]);

  // Group detections by pattern_type
  const grouped: Record<string, typeof driftDetections> = {};
  for (const d of driftDetections) {
    (grouped[d.pattern_type] ??= []).push(d);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/25 rounded-xl flex items-center justify-center">
            <Radar className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Drift Map</h1>
            <p className="text-slate-600 text-sm">Behavioral drift detections by pattern type</p>
          </div>
        </div>
        <button
          onClick={() => fetchDrift()}
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
      {!loading && driftDetections.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-700">
          <Radar className="w-12 h-12 mb-3 opacity-25" />
          <p className="text-lg font-medium text-slate-600">No detections</p>
          <p className="text-sm mt-1">Run a simulation or analysis to see drift data.</p>
        </div>
      )}

      {/* Drift groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {Object.entries(grouped).map(([driftType, detections]) => {
          const dc = DRIFT_COLORS[driftType] ?? DEFAULT_DC;
          return (
            <div
              key={driftType}
              className={clsx("bg-[#070e1d] border rounded-2xl overflow-hidden", dc.ring)}
            >
              {/* Group header */}
              <div className={clsx("px-6 py-4 border-b", dc.ring, dc.bg)}>
                <div className="flex items-center justify-between">
                  <h2 className={clsx("text-sm font-bold", dc.text)}>{driftType}</h2>
                  <span className="text-xs text-slate-600">{detections.length} detection{detections.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Detection cards */}
              <div className="p-4 space-y-3">
                {detections.map((d) => {
                  const sm = SEV_META[d.severity] ?? SEV_META[1];
                  return (
                    <div
                      key={d.id}
                      className="bg-slate-900/40 border border-slate-800 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {/* Severity badge */}
                        <div className={clsx("w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0", sm.text, sm.bg, sm.border)}>
                          {d.severity}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-slate-400">{d.team_id}</span>
                            {d.is_early_warning && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-md font-medium">
                                Early
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700">
                            {new Date(d.created_at).toLocaleString()} · Confidence: {(d.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="flex items-start gap-2 mb-2">
                        <Info className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-400 leading-relaxed">{d.explanation}</p>
                      </div>

                      {/* Action */}
                      <div className="flex items-start gap-2 mb-2">
                        <Shield className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-cyan-400/80 leading-relaxed">{d.recommended_action}</p>
                      </div>

                      {/* NIST controls */}
                      {d.nist_controls.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {d.nist_controls.map((ctrl) => (
                            <span key={ctrl} className="px-2 py-0.5 bg-red-950/30 border border-red-900/30 rounded text-[10px] font-mono text-red-400">
                              {ctrl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
