"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import type { AnalysisResult } from "../lib/api";

const SEVERITY_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-2xl min-w-[160px]">
      <p className="text-white font-semibold text-xs pb-2 mb-2 border-b border-slate-700">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs mt-1.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0 color-swatch"
              style={{ "--swatch-color": p.color } as React.CSSProperties}
            />
            <span className="text-slate-400">{p.name === "severity" ? "Severity" : "Confidence"}</span>
          </div>
          <span className="text-white font-medium">
            {p.name === "severity" ? `${p.value} / 5` : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SeverityChart({ results }: { results: AnalysisResult[] }) {
  const data = results
    .filter((r) => r.drift_detected !== "Insufficient signal")
    .map((r) => ({
      name: r.drift_detected.split("/")[0].trim(),
      severity: r.severity,
      confidence: Math.round(r.confidence * 100),
      sevColor: SEVERITY_COLORS[r.severity] ?? "#64748b",
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
        No actionable drift detected
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="sev"
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <YAxis
          yAxisId="conf"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 8 }}
          formatter={(value: string) =>
            value === "severity" ? "Severity (0-5)" : "Confidence (%)"
          }
        />
        <Bar
          yAxisId="sev"
          dataKey="severity"
          name="severity"
          radius={[5, 5, 0, 0]}
          maxBarSize={44}
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.sevColor} fillOpacity={0.85} />
          ))}
        </Bar>
        <Bar
          yAxisId="conf"
          dataKey="confidence"
          name="confidence"
          fill="#06b6d4"
          fillOpacity={0.25}
          radius={[5, 5, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
