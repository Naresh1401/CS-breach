"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Calendar,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import clsx from "clsx";
import { useStore } from "../../store/store";

const DRIFT_CHART_COLORS: Record<string, string> = {
  fatigue_numbness:   "#f59e0b",
  overconfidence:     "#ef4444",
  hurry_urgency:      "#f97316",
  quiet_fear:         "#8b5cf6",
  hoarding_control:   "#3b82f6",
  compliance_theater: "#ec4899",
};

const DRIFT_LABELS: Record<string, string> = {
  fatigue_numbness:   "Fatigue",
  overconfidence:     "Overconfidence",
  hurry_urgency:      "Hurry",
  quiet_fear:         "Quiet Fear",
  hoarding_control:   "Hoarding",
  compliance_theater: "Comp. Theater",
};

const PERIOD_OPTIONS = [
  { label: "7d",  days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const TrendTooltip = ({ active, payload, label }: TrendTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-2xl min-w-[140px]">
      <p className="text-white font-semibold text-xs pb-2 mb-2 border-b border-slate-700">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs mt-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-slate-400">{p.name}</span>
          </div>
          <span className="text-white font-medium">{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendsPage() {
  const { trends, loading, error, fetchTrends } = useStore();
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchTrends(days);
  }, [fetchTrends, days]);

  const trendData = (trends?.trends ?? []).map((t) => ({
    date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Detections: t.total_detections,
    "Avg Severity": t.avg_severity,
  }));

  // Drift breakdown for bar chart
  const breakdown = (trends?.drift_breakdown ?? {}) as Record<string, Record<string, number>>;
  const allDriftTypes = new Set<string>();
  for (const dateData of Object.values(breakdown)) {
    for (const dt of Object.keys(dateData)) allDriftTypes.add(dt);
  }
  const breakdownData = Object.entries(breakdown).map(([date, drifts]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ...drifts,
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/25 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trends</h1>
            <p className="text-slate-600 text-sm">Detection trends over time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#070e1d] border border-slate-800/60 rounded-xl p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDays(opt.days)}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                  days === opt.days
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchTrends(days)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-sm font-medium rounded-xl transition-all disabled:opacity-40"
          >
            <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-800/40 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 pb-8">
        {/* Detection trend area chart */}
        <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Detection Volume & Severity
            </h2>
          </div>

          {trendData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-slate-700">
              <Calendar className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No trend data for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TrendTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area
                  type="monotone"
                  dataKey="Detections"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#gradDetections)"
                />
                <Area
                  type="monotone"
                  dataKey="Avg Severity"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#gradSeverity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Drift breakdown stacked bar chart */}
        <div className="bg-[#070e1d] border border-slate-800/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Drift Type Breakdown
            </h2>
          </div>

          {breakdownData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-slate-700">
              <Calendar className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No breakdown data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={breakdownData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f2240" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TrendTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => DRIFT_LABELS[value] ?? value}
                />
                {Array.from(allDriftTypes).map((dt) => (
                  <Bar
                    key={dt}
                    dataKey={dt}
                    stackId="drift"
                    fill={DRIFT_CHART_COLORS[dt] ?? "#64748b"}
                    radius={[2, 2, 0, 0]}
                    name={dt}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
