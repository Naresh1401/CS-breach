import type { AnalysisResult } from "./api";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  results: AnalysisResult[];
  processingMs: number;
  logCount: number;
}

const STORAGE_KEY = "cg_history_v2";
const MAX_ENTRIES = 100;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<HistoryEntry, "id">): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.push({ ...entry, id: crypto.randomUUID() });
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
