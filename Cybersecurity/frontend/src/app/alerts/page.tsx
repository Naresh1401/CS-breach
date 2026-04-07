"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/store";

const STATUS_META: Record<string, { label: string; icon: typeof AlertCircle; color: string; bg: string }> = {
  active:       { label: "Active",       icon: AlertCircle,   color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25" },
  acknowledged: { label: "Acknowledged", icon: Clock,         color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/25" },
  resolved:     { label: "Resolved",     icon: CheckCircle2,  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/25" },
  dismissed:    { label: "Dismissed",    icon: XCircle,       color: "text-slate-400",  bg: "bg-slate-500/10 border-slate-500/25" },
};

const SEV_META: Record<number, { text: string; bg: string; border: string }> = {
  1: { text: "text-green-400",  bg: "bg-green-900/40",  border: "border-green-700/40" },
  2: { text: "text-lime-400",   bg: "bg-lime-900/40",   border: "border-lime-700/40" },
  3: { text: "text-yellow-400", bg: "bg-yellow-900/40", border: "border-yellow-700/40" },
  4: { text: "text-orange-400", bg: "bg-orange-900/40", border: "border-orange-700/40" },
  5: { text: "text-red-400",    bg: "bg-red-900/40",    border: "border-red-700/40" },
};

const FILTERS = ["all", "active", "acknowledged", "resolved", "dismissed"] as const;

export default function AlertsPage() {
  const { alerts, loading, error, fetchAlerts, updateAlertStatus } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAlerts(filter === "all" ? undefined : { status: filter });
  }, [fetchAlerts, filter]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  const handleStatusChange = async (id: string, status: string) => {
    await updateAlertStatus(id, status);
    fetchAlerts(filter === "all" ? undefined : { status: filter });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Alerts</h1>
            <p className="text-slate-600 text-sm">{alerts.length} alert{alerts.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button
          onClick={() => fetchAlerts(filter === "all" ? undefined : { status: filter })}
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

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-slate-600" />
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
              filter === f
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                : "text-slate-500 hover:text-slate-300 border border-transparent hover:bg-white/[0.04]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!loading && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-700">
          <AlertCircle className="w-12 h-12 mb-3 opacity-25" />
          <p className="text-lg font-medium text-slate-600">No alerts</p>
          <p className="text-sm mt-1">Run a simulation to generate alerts.</p>
        </div>
      )}

      {/* Alert list */}
      <div className="space-y-3 pb-8">
        {alerts.map((alert, idx) => {
          const sm = SEV_META[alert.severity] ?? SEV_META[1];
          const st = STATUS_META[alert.status] ?? STATUS_META.active;
          const StatusIcon = st.icon;
          const isOpen = expanded.has(alert.id);

          return (
            <div
              key={alert.id}
              className="bg-[#070e1d] border border-slate-800/60 rounded-2xl overflow-hidden animate-fade-in anim-delay"
              style={{ "--anim-delay": `${idx * 30}ms` } as React.CSSProperties}
            >
              {/* Row */}
              <button
                onClick={() => toggle(alert.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className={clsx("w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold flex-shrink-0", sm.text, sm.bg, sm.border)}>
                  {alert.severity}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-200 truncate">{alert.drift_type}</h3>
                    {alert.is_early_warning && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-md font-medium">
                        Early Warning
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700">
                    {alert.team_id} · {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border", st.bg)}>
                  <StatusIcon className={clsx("w-3 h-3", st.color)} />
                  <span className={st.color}>{st.label}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-slate-800/60 p-5 space-y-4">
                  {/* Response text */}
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">Response</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{alert.response_text || "No response generated."}</p>
                  </div>

                  {/* Controls + Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">Affected Controls</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(alert.affected_controls ?? []).map((ctrl) => (
                          <span key={ctrl} className="px-2 py-1 bg-red-950/30 border border-red-900/30 rounded-lg text-xs font-mono text-red-400">
                            {ctrl}
                          </span>
                        ))}
                        {(!alert.affected_controls || alert.affected_controls.length === 0) && (
                          <span className="text-xs text-slate-700">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">Action Items</p>
                      <ul className="space-y-1">
                        {(alert.action_items ?? []).map((item, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                            <Shield className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                        {(!alert.action_items || alert.action_items.length === 0) && (
                          <li className="text-xs text-slate-700">None</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Status actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/40">
                    <span className="text-xs text-slate-600 mr-2">Set status:</span>
                    {(["acknowledged", "resolved", "dismissed"] as const).map((s) => {
                      if (s === alert.status) return null;
                      const meta = STATUS_META[s];
                      const Ic = meta.icon;
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(alert.id, s)}
                          className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:brightness-125",
                            meta.bg
                          )}
                        >
                          <Ic className={clsx("w-3 h-3", meta.color)} />
                          <span className={meta.color}>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
