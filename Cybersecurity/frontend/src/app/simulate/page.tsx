"use client";

import { useState } from "react";
import {
  FlaskConical,
  Play,
  Zap,
  BarChart2,
  AlertCircle,
  Radar,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/store";

const SCENARIOS = [
  { value: "mixed",              label: "Mixed",              emoji: "🎲", desc: "Random mix of all drift types" },
  { value: "fatigue_numbness",   label: "Fatigue/Numbness",   emoji: "😴", desc: "Audit skip, review fatigue" },
  { value: "overconfidence",     label: "Overconfidence",     emoji: "😤", desc: "Access overreach, privilege abuse" },
  { value: "hurry_urgency",      label: "Hurry/Urgency",      emoji: "⚡", desc: "Approval bypass, rush override" },
  { value: "quiet_fear",         label: "Quiet Fear",         emoji: "😰", desc: "Incident avoidance, slow response" },
  { value: "hoarding_control",   label: "Hoarding/Control",   emoji: "🔒", desc: "Resource hoarding, excess control" },
  { value: "compliance_theater", label: "Compliance Theater", emoji: "🎭", desc: "Surface compliance, no substance" },
] as const;

const SIGNAL_COUNTS = [10, 25, 50, 100] as const;

export default function SimulatePage() {
  const { simulationResult, loading, error, runSimulation } = useStore();
  const [scenario, setScenario] = useState("mixed");
  const [numSignals, setNumSignals] = useState<number>(50);

  const handleRun = () => {
    runSimulation(scenario, numSignals);
  };

  const driftEntries = Object.entries(simulationResult?.drift_summary ?? {}) as [string, number][];
  const maxDrift = Math.max(...driftEntries.map(([, v]) => v), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/25 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Simulate</h1>
        </div>
        <p className="text-slate-600 text-sm ml-11">
          Generate synthetic signals and run drift detection
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-800/40 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Scenario picker */}
          <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Scenario
            </h2>
            <div className="space-y-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setScenario(s.value)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                    scenario === s.value
                      ? "bg-violet-500/10 border border-violet-500/25"
                      : "border border-transparent hover:bg-white/[0.03]"
                  )}
                >
                  <span className="text-lg">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={clsx(
                      "text-sm font-medium",
                      scenario === s.value ? "text-violet-300" : "text-slate-400"
                    )}>
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-700 truncate">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Signal count */}
          <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Signal Count
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {SIGNAL_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumSignals(n)}
                  className={clsx(
                    "py-2 rounded-xl text-sm font-medium transition-all",
                    numSignals === n
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                      : "text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-white/[0.03]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={loading}
            className={clsx(
              "w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-bold transition-all",
              loading
                ? "bg-violet-500/10 border border-violet-500/20 text-violet-400/60"
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                Running Simulation…
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Simulation
              </>
            )}
          </button>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2">
          {!simulationResult ? (
            <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl flex flex-col items-center justify-center h-full min-h-[400px] text-slate-700">
              <FlaskConical className="w-14 h-14 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-600">No simulation results</p>
              <p className="text-sm mt-1 text-slate-700">
                Select a scenario and click Run Simulation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Signals Generated", value: simulationResult.signals_generated, icon: Zap,         color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
                  { label: "Detections Found",  value: simulationResult.detections_found,  icon: Radar,       color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                  { label: "Alerts Created",     value: simulationResult.alerts_created,    icon: AlertCircle, color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className={clsx("rounded-2xl border p-5", bg)}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">{label}</span>
                      <Icon className={clsx("w-4 h-4", color)} />
                    </div>
                    <p className={clsx("text-2xl font-bold tabular-nums", color)}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Drift summary */}
              <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Drift Summary
                  </h2>
                </div>

                {driftEntries.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-slate-700">
                    <p className="text-sm">No drifts detected in simulation</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {driftEntries
                      .sort(([, a], [, b]) => b - a)
                      .map(([drift, count]) => (
                        <div key={drift}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-400 truncate pr-2">{drift}</span>
                            <span className="text-slate-600 flex-shrink-0">{count} detections</span>
                          </div>
                          <div className="w-full bg-slate-800/60 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-violet-500 transition-all duration-700"
                              style={{ width: `${(count / maxDrift) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Success indicator */}
              <div className="bg-green-950/20 border border-green-800/30 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-400">Simulation Complete</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Results are reflected in the Overview, Alerts, Drift Map, and NIST Risk pages.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
