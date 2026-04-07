"use client";

import { useEffect } from "react";
import {
  BarChart3,
  Signal,
  Radar,
  AlertCircle,
  AlertTriangle,
  Users,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/store";

const DRIFT_COLORS: Record<string, string> = {
  fatigue_numbness:     "bg-amber-500",
  overconfidence:       "bg-red-500",
  hurry_urgency:        "bg-orange-500",
  quiet_fear:           "bg-purple-500",
  hoarding_control:     "bg-blue-500",
  compliance_theater:   "bg-pink-500",
};

const DRIFT_LABELS: Record<string, string> = {
  fatigue_numbness:     "Fatigue / Numbness",
  overconfidence:       "Overconfidence",
  hurry_urgency:        "Hurry / Urgency Override",
  quiet_fear:           "Quiet Fear / Avoidance",
  hoarding_control:     "Hoarding / Control Grip",
  compliance_theater:   "Compliance Theater",
};

const SEV_COLORS: Record<string, string> = {
  "1": "bg-green-500",
  "2": "bg-lime-500",
  "3": "bg-yellow-500",
  "4": "bg-orange-500",
  "5": "bg-red-500",
};

export default function OverviewPage() {
  const { overview, loading, error, fetchOverview } = useStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const stats = [
    { label: "Total Signals",    value: overview?.total_signals ?? 0,    icon: Signal,        color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
    { label: "Detections",       value: overview?.total_detections ?? 0, icon: Radar,         color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Active Alerts",    value: overview?.active_alerts ?? 0,    icon: AlertCircle,   color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
    { label: "Early Warnings",   value: overview?.early_warnings ?? 0,  icon: AlertTriangle, color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const driftEntries = Object.entries(overview?.drift_distribution ?? {}) as [string, number][];
  const maxDrift = Math.max(...driftEntries.map(([, v]) => v), 1);

  const sevEntries = (Object.entries(overview?.severity_distribution ?? {}) as [string, number][]).sort(
    ([a], [b]) => Number(a) - Number(b)
  );
  const maxSev = Math.max(...sevEntries.map(([, v]) => v), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
            <p className="text-slate-600 text-sm">Live backend intelligence summary</p>
          </div>
        </div>
        <button
          onClick={() => fetchOverview()}
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={clsx("rounded-2xl border p-5 backdrop-blur-sm", bg)}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">{label}</span>
              <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={clsx("w-4 h-4", color)} />
              </div>
            </div>
            <p className={clsx("text-3xl font-bold tabular-nums", color)}>
              {loading ? <span className="skeleton inline-block w-16 h-8 rounded" /> : value}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drift Distribution */}
        <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Drift Distribution
          </h2>
          {driftEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <Radar className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No drift data</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {driftEntries.map(([drift, count]) => (
                <div key={drift}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 truncate pr-2">
                      {DRIFT_LABELS[drift] ?? drift}
                    </span>
                    <span className="text-slate-600 flex-shrink-0">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                    <div
                      className={clsx("h-1.5 rounded-full transition-all duration-700", DRIFT_COLORS[drift] ?? "bg-cyan-500")}
                      style={{ width: `${(count / maxDrift) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Severity Distribution */}
        <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Severity Distribution
          </h2>
          {sevEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <AlertTriangle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No severity data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sevEntries.map(([sev, count]) => (
                <div key={sev} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-6 text-right">L{sev}</span>
                  <div className="flex-1 bg-slate-800/60 rounded-full h-2">
                    <div
                      className={clsx("h-2 rounded-full transition-all duration-700", SEV_COLORS[sev] ?? "bg-slate-500")}
                      style={{ width: `${(count / maxSev) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Affected Teams */}
        <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Top Affected Teams
          </h2>
          {(!overview?.top_affected_teams || overview.top_affected_teams.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
              <Users className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No team data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {overview.top_affected_teams.map((team) => (
                <div
                  key={team.team_id}
                  className="flex items-center gap-3 p-3 bg-slate-900/40 border border-slate-800 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-300 flex-1 truncate font-mono">{team.team_id}</span>
                  <span className="text-xs text-slate-600">{team.detection_count} detections</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
