"use client";

import { useState, useCallback } from "react";
import {
  Cpu,
  Zap,
  RotateCcw,
  Download,
  AlertTriangle,
  Shield,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { analyzeLogs, type AnalysisResult, type LogEntry } from "../../lib/api";
import { addHistory } from "../../lib/history";
import SeverityChart from "../../components/SeverityChart";
import ResultCard from "../../components/ResultCard";

/* ─── Scenario presets ────────────────────────────────────────── */
const SCENARIOS: Array<{
  name: string;
  short: string;
  emoji: string;
  ring: string;
  logs: LogEntry[];
}> = [
  {
    name: "Fatigue/Numbness",        short: "Fatigue",
    emoji: "😴",                     ring: "border-amber-500/40 hover:border-amber-400/70 text-amber-400",
    logs: [{
      source: "audit_system", team_id: "security-ops", log_type: "audit_log",
      data: { skip_rate: 0.65, reviews_completed: 4, reviews_skipped: 9, avg_review_time_min: 0.8, findings_count: 0, overdue_days: 18 },
    }],
  },
  {
    name: "Overconfidence",          short: "Overconfidence",
    emoji: "😤",                     ring: "border-red-500/40 hover:border-red-400/70 text-red-400",
    logs: [{
      source: "iam", team_id: "security-ops", log_type: "access_log",
      data: { access_frequency: 130, privilege_level: "admin", unusual_hours: true, resources_accessed: Array.from({ length: 25 }, (_, i) => `res-${i}`), failed_attempts: 4 },
    }],
  },
  {
    name: "Hurry/Urgency Override",  short: "Hurry Override",
    emoji: "⚡",                     ring: "border-orange-500/40 hover:border-orange-400/70 text-orange-400",
    logs: [{
      source: "approval_gate", team_id: "security-ops", log_type: "approval",
      data: { approved: true, review_time_hours: 0.04, bypassed: true, justification_provided: false, approver_level: "manager" },
    }],
  },
  {
    name: "Quiet Fear/Avoidance",    short: "Quiet Fear",
    emoji: "😰",                     ring: "border-purple-500/40 hover:border-purple-400/70 text-purple-400",
    logs: [{
      source: "ticketing", team_id: "security-ops", log_type: "incident_response",
      data: { response_time_min: 320, severity: "high", escalated: false, reported: false, incident_type: "data_access" },
    }],
  },
  {
    name: "Hoarding/Control Grip",   short: "Hoarding",
    emoji: "🔒",                     ring: "border-blue-500/40 hover:border-blue-400/70 text-blue-400",
    logs: [{
      source: "iam", team_id: "security-ops", log_type: "access_log",
      data: { access_frequency: 45, privilege_level: "admin", unusual_hours: false, resources_accessed: Array.from({ length: 60 }, (_, i) => `resource-${i}`), failed_attempts: 0 },
    }],
  },
  {
    name: "Compliance Theater",      short: "Comp. Theater",
    emoji: "🎭",                     ring: "border-pink-500/40 hover:border-pink-400/70 text-pink-400",
    logs: [{
      source: "compliance_tool", team_id: "security-ops", log_type: "compliance_report",
      data: { completion_rate: 0.97, actual_findings: 0, policy_exceptions: 8, auto_closed: true, last_updated_days: 45 },
    }],
  },
];

const SAMPLE_LOGS: LogEntry[] = [
  ...SCENARIOS[0].logs,
  ...SCENARIOS[1].logs,
  ...SCENARIOS[2].logs,
  ...SCENARIOS[3].logs,
];

/* ─── Pipeline stage labels ────────────────────────────────────── */
const PIPELINE_STAGES = [
  "Input Guard",
  "Signal Processor",
  "Drift Detector",
  "Severity Scorer",
  "NIST Mapper",
  "RAG Retriever",
  "Output Guard",
];

/* ─── Page component ───────────────────────────────────────────── */
export default function AnalyzePage() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify({ logs: SAMPLE_LOGS }, null, 2)
  );
  const [results,    setResults]    = useState<AnalysisResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [timeMs,     setTimeMs]     = useState(0);
  const [error,      setError]      = useState("");
  const [hasRun,     setHasRun]     = useState(false);
  const [stageIdx,   setStageIdx]   = useState(0);

  const runAnalysis = useCallback(async (logs: LogEntry[]) => {
    setProcessing(true);
    setError("");
    setResults([]);
    setHasRun(false);
    setStageIdx(0);

    // Cycle through pipeline stages visually
    const interval = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, PIPELINE_STAGES.length - 1));
    }, 280);

    try {
      const resp = await analyzeLogs(logs);
      clearInterval(interval);
      setStageIdx(PIPELINE_STAGES.length - 1);
      setResults(resp.results);
      setTimeMs(resp.processing_time_ms);
      setHasRun(true);
      addHistory({
        timestamp:    new Date().toISOString(),
        results:      resp.results,
        processingMs: resp.processing_time_ms,
        logCount:     logs.length,
      });
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Analysis failed. Is the backend running?");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const logs   = parsed.logs ?? parsed;
      if (!Array.isArray(logs) || logs.length === 0) {
        setError("Provide at least one log entry.");
        return;
      }
      runAnalysis(logs);
    } catch {
      setError("Invalid JSON — check your input.");
    }
  };

  const loadScenario = (logs: LogEntry[]) => {
    setJsonInput(JSON.stringify({ logs }, null, 2));
    setError("");
    setResults([]);
    setHasRun(false);
  };

  const exportResults = () => {
    const blob = new Blob(
      [JSON.stringify({ results, processing_time_ms: timeMs }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = `drift-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionable   = results.filter((r) => r.drift_detected !== "Insufficient signal");
  const maxSeverity  = actionable.length ? Math.max(...actionable.map((r) => r.severity)) : 0;
  const avgConf      = results.length
    ? results.reduce((a, r) => a + r.confidence, 0) / results.length
    : 0;

  return (
    <div className="p-8">
      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analyze</h1>
        </div>
        <p className="text-slate-600 text-sm ml-11">
          Submit security logs for AI-powered behavioral drift detection
        </p>
      </div>

      {/* ── Scenario presets ── */}
      <div className="mb-6">
        <p className="text-xs text-slate-700 uppercase tracking-widest font-medium mb-3">
          Quick Scenarios
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.name}
              onClick={() => loadScenario(s.logs)}
              className={clsx(
                "flex flex-col items-center gap-2 p-3 bg-[#070e1d] border rounded-xl text-xs font-medium transition-all duration-150",
                s.ring
              )}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-center leading-tight">{s.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Input card ── */}
      <div
        className={clsx(
          "border rounded-2xl p-6 mb-6 transition-all duration-300",
          processing
            ? "border-cyan-500/40 bg-cyan-950/10 scan-overlay"
            : "border-slate-800/60 bg-[#070e1d]"
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-slate-400">JSON Input</span>
            <span className="text-xs text-slate-700 font-mono">application/json</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setJsonInput(JSON.stringify({ logs: SAMPLE_LOGS }, null, 2));
                setError("");
                setResults([]);
                setHasRun(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={processing}
              className={clsx(
                "flex items-center gap-2 px-5 py-1.5 text-sm font-bold rounded-lg transition-all duration-200",
                processing
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black"
              )}
            >
              <Zap className="w-4 h-4" />
              {processing ? "Scanning…" : "Analyze"}
            </button>
          </div>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"logs": [{"source": "audit_system", "team_id": "ops", "log_type": "audit_log", "data": {}}]}'
          className="w-full h-56 bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 resize-none leading-relaxed"
          spellCheck={false}
        />

        {error && (
          <div className="mt-3 flex items-center gap-2.5 text-red-400 text-sm p-3 bg-red-950/30 border border-red-900/40 rounded-xl animate-fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* ── Pipeline progress ── */}
      {processing && (
        <div className="mb-6 p-5 bg-cyan-950/20 border border-cyan-800/30 rounded-2xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 border-2 border-cyan-900 rounded-full" />
              <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-cyan-300 font-semibold text-sm">
                Running LangGraph pipeline…
              </p>
              <p className="text-slate-600 text-xs mt-0.5">
                Stage: <span className="text-cyan-500">{PIPELINE_STAGES[stageIdx]}</span>
              </p>
            </div>
          </div>
          {/* Stage dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1.5 flex-shrink-0">
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i < stageIdx
                      ? "bg-cyan-400"
                      : i === stageIdx
                      ? "bg-cyan-300 animate-pulse"
                      : "bg-slate-700"
                  )}
                />
                <span
                  className={clsx(
                    "text-xs",
                    i <= stageIdx ? "text-slate-400" : "text-slate-700"
                  )}
                >
                  {stage}
                </span>
                {i < PIPELINE_STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-800 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {hasRun && results.length > 0 && !processing && (
        <div className="animate-fade-in">
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Drifts Found",   value: actionable.length,              icon: Target,        color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20"    },
              { label: "Max Severity",   value: `${maxSeverity} / 5`,           icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
              { label: "Avg Confidence", value: `${(avgConf*100).toFixed(0)}%`, icon: Shield,        color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20"  },
              { label: "Pipeline Time",  value: `${timeMs.toFixed(1)} ms`,      icon: Clock,         color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={clsx("rounded-2xl border p-4", bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={clsx("w-3.5 h-3.5", color)} />
                  <span className="text-xs text-slate-600 uppercase tracking-wider">{label}</span>
                </div>
                <p className={clsx("text-2xl font-bold tabular-nums", color)}>{value}</p>
              </div>
            ))}
          </div>

          {/* Chart + export */}
          {actionable.length > 0 && (
            <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Severity &amp; Confidence Chart
                </h2>
                <button
                  onClick={exportResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export JSON
                </button>
              </div>
              <SeverityChart results={results} />
            </div>
          )}

          {/* NIST risk table */}
          {actionable.length > 0 && (
            <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6 mb-6 overflow-x-auto">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                NIST SP 800-53 Controls at Risk
              </h2>
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs text-slate-700 font-medium pb-3 pr-4">Drift Type</th>
                    <th className="text-left text-xs text-slate-700 font-medium pb-3 pr-4">Severity</th>
                    <th className="text-left text-xs text-slate-700 font-medium pb-3 pr-4">Confidence</th>
                    <th className="text-left text-xs text-slate-700 font-medium pb-3">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {actionable.map((r, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 text-slate-300 font-medium">{r.drift_detected}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={clsx(
                            "text-xs font-bold",
                            r.severity >= 4 ? "text-red-400" : r.severity === 3 ? "text-orange-400" : "text-green-400"
                          )}
                        >
                          {r.severity} / 5
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-cyan-400">
                          {(r.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {r.nist_controls_at_risk.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 bg-red-950/40 border border-red-800/50 text-red-300 rounded-lg text-xs font-mono"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Detail cards */}
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-4">
            Detection Details
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
            {results.map((r, i) => (
              <div
                key={i}
                className="animate-slide-in-right anim-delay"
                style={{ "--anim-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <ResultCard result={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
