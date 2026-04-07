"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { AnalysisResult } from "../lib/api";
import clsx from "clsx";

interface SeverityMeta {
  label: string;
  cardBg: string;
  border: string;
  text: string;
  badgeBg: string;
  shadow: string;
}

const SEVERITY_META: Record<number, SeverityMeta> = {
  0: { label: "None",     cardBg: "bg-slate-900/40", border: "border-slate-800",       text: "text-slate-500",  badgeBg: "bg-slate-800",      shadow: "" },
  1: { label: "Low",      cardBg: "bg-green-950/30", border: "border-green-800/40",    text: "text-green-400",  badgeBg: "bg-green-900/50",   shadow: "" },
  2: { label: "Med-Low",  cardBg: "bg-lime-950/30",  border: "border-lime-800/40",     text: "text-lime-400",   badgeBg: "bg-lime-900/50",    shadow: "" },
  3: { label: "Medium",   cardBg: "bg-yellow-950/30",border: "border-yellow-700/40",   text: "text-yellow-400", badgeBg: "bg-yellow-900/50",  shadow: "" },
  4: { label: "High",     cardBg: "bg-orange-950/30",border: "border-orange-700/50",   text: "text-orange-400", badgeBg: "bg-orange-900/50",  shadow: "shadow-orange-500/10 shadow-lg" },
  5: { label: "Critical", cardBg: "bg-red-950/30",   border: "border-red-700/50",      text: "text-red-400",    badgeBg: "bg-red-900/50",     shadow: "shadow-red-500/15 shadow-xl" },
};

const confidenceBarColor = (c: number) =>
  c >= 0.8 ? "bg-cyan-500" : c >= 0.6 ? "bg-blue-500" : "bg-slate-600";

export default function ResultCard({ result }: { result: AnalysisResult }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied]     = useState(false);

  const isInsufficient = result.drift_detected === "Insufficient signal";
  const meta = SEVERITY_META[result.severity] ?? SEVERITY_META[0];

  const copyAction = () => {
    navigator.clipboard.writeText(result.recommended_action).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isInsufficient) {
    return (
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-slate-500 text-sm font-medium">Insufficient Signal</p>
          <p className="text-slate-700 text-xs mt-1 leading-relaxed">
            Confidence below threshold — log does not exhibit strong drift indicators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "border rounded-xl overflow-hidden transition-all duration-200",
        meta.cardBg,
        meta.border,
        meta.shadow
      )}
    >
      {/* ── Clickable header ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Severity number badge */}
        <div
          className={clsx(
            "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 font-bold text-base",
            meta.text,
            meta.border,
            meta.badgeBg
          )}
        >
          {result.severity}
        </div>

        <div className="flex-1 min-w-0">
          {/* Drift type + warning icon */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm truncate">
              {result.drift_detected}
            </h3>
            {result.severity >= 4 && (
              <AlertTriangle className={clsx("w-3.5 h-3.5 flex-shrink-0", meta.text)} />
            )}
          </div>

          {/* Confidence bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-800 rounded-full h-1">
              <div
                className={clsx(
                  "h-1 rounded-full transition-all duration-700 bar-progress",
                  confidenceBarColor(result.confidence)
                )}
                style={{ "--bar-width": `${result.confidence * 100}%` } as React.CSSProperties}
              />
            </div>
            <span className="text-xs text-slate-600 w-14 text-right">
              {(result.confidence * 100).toFixed(0)}% conf
            </span>
          </div>
        </div>

        {/* Severity label + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-0.5 rounded-lg border",
              meta.text,
              meta.border,
              meta.badgeBg
            )}
          >
            {meta.label}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-700" />
          )}
        </div>
      </button>

      {/* ── Expandable body ── */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/[0.05] space-y-4 pt-4">
          {/* NIST controls */}
          {result.nist_controls_at_risk.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">
                NIST Controls at Risk
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.nist_controls_at_risk.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-1 bg-red-950/50 border border-red-800/50 text-red-300 rounded-lg text-xs font-mono font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">
              Detection Rationale
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
          </div>

          {/* Recommended action */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-600 uppercase tracking-wider font-medium">
                Recommended Action
              </p>
              <button
                onClick={copyAction}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-300 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCheck className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-cyan-300 leading-relaxed bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-3.5">
              {result.recommended_action}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

