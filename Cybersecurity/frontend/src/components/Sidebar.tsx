"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Cpu,
  History,
  ChevronRight,
  Wifi,
  WifiOff,
  Key,
  Check,
  Eye,
  EyeOff,
  BarChart3,
  AlertCircle,
  Radar,
  ShieldCheck,
  TrendingUp,
  FlaskConical,
} from "lucide-react";
import { getHealth, type HealthResponse, getApiKeyStatus, setApiKey, type ApiKeyStatus } from "../lib/api";
import clsx from "clsx";

const NAV_MAIN = [
  { href: "/",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze",   icon: Cpu,             label: "Analyze"   },
  { href: "/history",   icon: History,         label: "History"   },
] as const;

const NAV_INTEL = [
  { href: "/overview",  icon: BarChart3,       label: "Overview"  },
  { href: "/alerts",    icon: AlertCircle,     label: "Alerts"    },
  { href: "/drift-map", icon: Radar,           label: "Drift Map" },
  { href: "/nist-risk", icon: ShieldCheck,     label: "NIST Risk" },
  { href: "/trends",    icon: TrendingUp,      label: "Trends"    },
  { href: "/simulate",  icon: FlaskConical,    label: "Simulate"  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [health, setHealth]   = useState<HealthResponse | null>(null);
  const [checking, setChecking] = useState(true);

  // API key state
  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const check = () =>
      getHealth()
        .then(setHealth)
        .catch(() => setHealth(null))
        .finally(() => setChecking(false));

    check();
    getApiKeyStatus().then(setKeyStatus).catch(() => {});
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  const isOnline = health?.status === "ok";

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col z-30 bg-[#060d1b] border-r border-[#0f2240]/80">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[#0f2240]/60">
        <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center glow-cyan">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">CyberGov AI</p>
          <p className="text-slate-600 text-xs font-mono">NIST SP 800-53</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-xs text-slate-700 font-medium uppercase tracking-widest px-3 mb-3">Menu</p>
        {NAV_MAIN.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={clsx(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  active ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-400"
                )}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight className="w-3 h-3 text-cyan-500/50" />
              )}
            </Link>
          );
        })}

        <p className="text-xs text-slate-700 font-medium uppercase tracking-widest px-3 mt-6 mb-3">Intelligence</p>
        {NAV_INTEL.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={clsx(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  active ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-400"
                )}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight className="w-3 h-3 text-cyan-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* API Key input */}
      <div className="px-3 pb-2 border-t border-[#0f2240]/60 pt-4">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 p-3.5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">
              OpenAI API Key
            </span>
            {keyStatus?.configured && (
              <span className="ml-auto text-[10px] text-green-400 font-medium">Active</span>
            )}
          </div>

          {keyStatus?.configured && !keySaved ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{keyStatus.masked_key}</span>
                <button
                  onClick={() => { setKeyStatus({ configured: false, masked_key: "" }); setKeyInput(""); }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => { setKeyInput(e.target.value); setKeySaved(false); }}
                  placeholder="sk-..."
                  aria-label="OpenAI API key"
                  className="w-full bg-[#0a1628] border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={async () => {
                  if (!keyInput.trim()) return;
                  setKeySaving(true);
                  try {
                    const result = await setApiKey(keyInput.trim());
                    setKeyStatus(result);
                    setKeySaved(true);
                    setKeyInput("");
                    setTimeout(() => setKeySaved(false), 2000);
                  } catch {
                    /* ignore */
                  } finally {
                    setKeySaving(false);
                  }
                }}
                disabled={!keyInput.trim() || keySaving}
                className={clsx(
                  "w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  keySaved
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {keySaving ? "Saving…" : keySaved ? <><Check className="w-3 h-3" /> Saved</> : "Save Key"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* API status footer */}
      <div className="px-3 pb-4 border-t border-[#0f2240]/60 pt-4">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 p-3.5">
          {/* Online / offline */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">API</span>
            <div className="flex items-center gap-1.5">
              {checking ? (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              ) : isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-green-400 animate-blink" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
              )}
              <span
                className={clsx(
                  "text-xs font-semibold",
                  checking ? "text-yellow-400" : isOnline ? "text-green-400" : "text-red-400"
                )}
              >
                {checking ? "…" : isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {health && (
            <div className="space-y-1.5">
              {[
                { label: "Version",   value: health.version                                },
                { label: "Database",  value: health.database,  ok: health.database  === "connected" },
                { label: "Vector DB", value: health.vector_db, ok: health.vector_db === "connected" },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-slate-700">{label}</span>
                  <span className={ok === undefined ? "text-slate-400" : ok ? "text-green-400" : "text-yellow-400"}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
