"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Shield,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { getHistory, type HistoryEntry } from "../lib/history";

const DRIFT_COLORS: Record<string, string> = {
  "Fatigue/Numbness":       "#f59e0b",
  "Overconfidence":         "#ef4444",
  "Hurry/Urgency Override": "#f97316",
  "Quiet Fear/Avoidance":   "#8b5cf6",
  "Hoarding/Control Grip":  "#3b82f6",
  "Compliance Theater":     "#ec4899",
};

const NIST_RISK_LEVEL: Record<string, string> = {
  "AU-6":  "Audit Review",
  "CA-7":  "Continuous Monitoring",
  "AC-2":  "Account Management",
  "AT-2":  "Literacy Training",
  "CM-3":  "Config Change Control",
  "IR-6":  "Incident Reporting",
};

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const allResults = history
    .flatMap((h) => h.results)
    .filter((r) => r.drift_detected !== "Insufficient signal");

  const totalRuns      = history.length;
  const driftsDetected = allResults.length;
  const maxSeverity    = allResults.length
    ? Math.max(...allResults.map((r) => r.severity))
    : 0;
  const avgConfidence  = allResults.length
    ? allResults.reduce((a, r) => a + r.confidence, 0) / allResults.length
    : 0;

  // Drift frequency
  const driftFreq: Record<string, number> = {};
  for (const r of allResults)
    driftFreq[r.drift_detected] = (driftFreq[r.drift_detected] ?? 0) + 1;
  const topDrifts = Object.entries(driftFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxFreq = topDrifts[0]?.[1] ?? 1;

  // NIST control frequency
  const nistFreq: Record<string, number> = {};
  for (const r of allResults)
    for (const c of r.nist_controls_at_risk)
      nistFreq[c] = (nistFreq[c] ?? 0) + 1;
  const topNist = Object.entries(nistFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const recent = [...history].reverse().slice(0, 5);

  const STATS = [
    {
      label: "Total Runs",
      value: totalRuns,
      icon: Activity,
      color: "text-cyan-400",
      bg:   "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Drifts Detected",
      value: driftsDetected,
      icon: AlertTriangle,
      color: "text-red-400",
      bg:   "bg-red-500/10 border-red-500/20",
    },
    {
      label: "Max Severity",
      value: maxSeverity ? `${maxSeverity} / 5` : "—",
      icon: TrendingUp,
      color: "text-orange-400",
      bg:   "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Avg Confidence",
      value: allResults.length ? `${(avgConfidence * 100).toFixed(0)}%` : "—",
      icon: Shield,
      color: "text-green-400",
      bg:   "bg-green-500/10 border-green-500/20",
    },
  ];

  return (
    <div className="p-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center glow-cyan">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Behavioral drift intelligence · all-time summary
            </p>
          </div>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
        >
          <Zap className="w-4 h-4" />
          Run Analysis
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={clsx("rounded-2xl border p-5 backdrop-blur-sm", bg)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">
                {label}
              </span>
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center",
                  bg
                )}
              >
                <Icon className={clsx("w-4 h-4", color)} />
              </div>
            </div>
            <p className={clsx("text-3xl font-bold tabular-nums", color)}>
              {value === 0 ? "0" : value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drift frequency bars */}
        <div className="lg:col-span-1 bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Drift Frequency
          </h2>
          {topDrifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <Activity className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No data yet</p>
              <Link
                href="/analyze"
                className="text-cyan-600 text-xs mt-2 hover:text-cyan-400 transition-colors"
              >
                Run first analysis →
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {topDrifts.map(([drift, count]) => (
                <div key={drift}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 truncate pr-2">{drift}</span>
                    <span className="text-slate-600 flex-shrink-0">{count}×</span>
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700 drift-fill"
                      style={{
                        "--drift-width": `${(count / maxFreq) * 100}%`,
                        "--drift-color": DRIFT_COLORS[drift] ?? "#06b6d4",
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NIST controls at risk */}
        <div className="lg:col-span-1 bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Controls at Risk
          </h2>
          {topNist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <Shield className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No controls flagged</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topNist.map(([ctrl, count]) => (
                <div
                  key={ctrl}
                  className="flex items-center gap-3 p-2.5 bg-red-950/20 border border-red-900/30 rounded-xl"
                >
                  <span className="text-xs font-mono font-bold text-red-400 w-10 flex-shrink-0">
                    {ctrl}
                  </span>
                  <span className="text-xs text-slate-500 flex-1 truncate">
                    {NIST_RISK_LEVEL[ctrl] ?? "Control"}
                  </span>
                  <span className="text-xs text-slate-600">{count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent analyses */}
        <div className="lg:col-span-1 bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Recent
            </h2>
            {history.length > 0 && (
              <Link
                href="/history"
                className="text-xs text-cyan-600 hover:text-cyan-400 transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <Clock className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No history yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((entry) => {
                const drifts = entry.results.filter(
                  (r) => r.drift_detected !== "Insufficient signal"
                );
                const ms = drifts.length
                  ? Math.max(...drifts.map((r) => r.severity))
                  : 0;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
                  >
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                        ms >= 4
                          ? "bg-red-500/20 text-red-400"
                          : ms >= 3
                          ? "bg-orange-500/20 text-orange-400"
                          : ms > 0
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-800 text-slate-600"
                      )}
                    >
                      {ms || "—"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">
                        {drifts.length > 0
                          ? drifts.map((r) => r.drift_detected).join(", ")
                          : "No drift"}
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs text-slate-700 flex-shrink-0">
                      {entry.processingMs.toFixed(0)}ms
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




