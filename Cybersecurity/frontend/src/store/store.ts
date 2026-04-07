import { create } from 'zustand';
import { api, type DashboardOverview, type Alert, type DriftDetection, type NISTRisk, type TrendData, type SimulationResult } from '@/lib/api';

interface AppState {
  overview: DashboardOverview | null;
  alerts: Alert[];
  driftDetections: DriftDetection[];
  nistRisks: NISTRisk[];
  trends: TrendData | null;
  simulationResult: SimulationResult | null;
  loading: boolean;
  error: string | null;
  activeTab: string;

  setActiveTab: (tab: string) => void;
  fetchOverview: () => Promise<void>;
  fetchAlerts: (params?: { status?: string }) => Promise<void>;
  fetchDrift: (params?: { team_id?: string }) => Promise<void>;
  fetchNISTRisks: () => Promise<void>;
  fetchTrends: (days?: number) => Promise<void>;
  runSimulation: (scenario?: string, numSignals?: number) => Promise<void>;
  updateAlertStatus: (id: string, status: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  overview: null,
  alerts: [],
  driftDetections: [],
  nistRisks: [],
  trends: null,
  simulationResult: null,
  loading: false,
  error: null,
  activeTab: 'overview',

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getOverview();
      set({ overview: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchAlerts: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getAlerts(params);
      set({ alerts: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchDrift: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getDrift(params);
      set({ driftDetections: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchNISTRisks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getNISTRisk();
      set({ nistRisks: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchTrends: async (days = 30) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getTrends(days);
      set({ trends: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  runSimulation: async (scenario = 'mixed', numSignals = 50) => {
    set({ loading: true, error: null });
    try {
      const data = await api.runSimulation(scenario, numSignals);
      set({ simulationResult: data, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  updateAlertStatus: async (id, status) => {
    try {
      await api.updateAlertStatus(id, status);
      const { alerts } = useStore.getState();
      set({
        alerts: alerts.map((a) =>
          a.id === id ? { ...a, status } : a
        ),
      });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
