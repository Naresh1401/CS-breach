const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LogEntry {
  source: string;
  team_id: string;
  log_type: string;
  data: Record<string, unknown>;
}

export interface AnalysisResult {
  drift_detected: string;
  severity: number;
  confidence: number;
  nist_controls_at_risk: string[];
  explanation: string;
  recommended_action: string;
}

export interface AnalyzeResponse {
  results: AnalysisResult[];
  processing_time_ms: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  database: string;
  vector_db: string;
}

export interface TeamAffected {
  team_id: string;
  detection_count: number;
}

export interface DashboardOverview {
  total_signals: number;
  total_detections: number;
  active_alerts: number;
  early_warnings: number;
  drift_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  top_affected_teams: TeamAffected[];
}

export interface Alert {
  id: string;
  team_id: string;
  drift_type: string;
  severity: number;
  confidence: number;
  status: string;
  is_early_warning: boolean;
  response_text: string;
  affected_controls: string[];
  action_items: string[];
  created_at: string;
}

export interface DriftDetection {
  id: string;
  team_id: string;
  pattern_type: string;
  severity: number;
  confidence: number;
  is_early_warning: boolean;
  explanation: string;
  recommended_action: string;
  nist_controls: string[];
  created_at: string;
}

export interface NISTRisk {
  control_id: string;
  control_name: string;
  family: string;
  risk_level: number;
  detection_count: number;
  rationale: string;
  associated_drifts: string[];
}

export interface TrendPoint {
  date: string;
  total_detections: number;
  avg_severity: number;
}

export interface TrendData {
  trends: TrendPoint[];
  drift_breakdown: Record<string, Record<string, number>>;
}

export interface SimulationResult {
  signals_generated: number;
  detections_found: number;
  alerts_created: number;
  drift_summary: Record<string, number>;
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  analyzeLogs: (logs: LogEntry[]): Promise<AnalyzeResponse> =>
    fetchJSON(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    }),

  getHealth: (): Promise<HealthResponse> =>
    fetchJSON(`${API_URL}/health`),

  getOverview: (): Promise<DashboardOverview> =>
    fetchJSON(`${API_URL}/dashboard/overview`),

  getAlerts: (params?: { status?: string }): Promise<Alert[]> => {
    const qs = params?.status ? `?status=${params.status}` : "";
    return fetchJSON(`${API_URL}/alerts${qs}`);
  },

  updateAlertStatus: (id: string, status: string): Promise<void> =>
    fetchJSON(`${API_URL}/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }),

  getDrift: (params?: { team_id?: string }): Promise<DriftDetection[]> => {
    const qs = params?.team_id ? `?team_id=${params.team_id}` : "";
    return fetchJSON(`${API_URL}/drift/detections${qs}`);
  },

  getNISTRisk: (): Promise<NISTRisk[]> =>
    fetchJSON(`${API_URL}/nist-risk`),

  getTrends: (days: number = 30): Promise<TrendData> =>
    fetchJSON(`${API_URL}/trends?days=${days}`),

  runSimulation: (scenario: string = "mixed", numSignals: number = 50): Promise<SimulationResult> =>
    fetchJSON(`${API_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, num_signals: numSignals }),
    }),
};

export interface ApiKeyStatus {
  configured: boolean;
  masked_key: string;
}

export async function getApiKeyStatus(): Promise<ApiKeyStatus> {
  return fetchJSON(`${API_URL}/api-key/status`);
}

export async function setApiKey(api_key: string): Promise<ApiKeyStatus> {
  return fetchJSON(`${API_URL}/api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key }),
  });
}

// Backward-compatible named exports used by analyze & sidebar pages
export const analyzeLogs = api.analyzeLogs;
export const getHealth = api.getHealth;
