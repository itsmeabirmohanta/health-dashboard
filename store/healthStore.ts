import { create } from 'zustand';

interface HealthMetric {
  value: number | string | { sys: number; dia: number };
  unit?: string;
  timestamp: Date;
}

interface HealthData {
  [key: string]: HealthMetric[];
}

interface HealthStore {
  currentMetrics: { [key: string]: HealthMetric };
  historicalData: HealthData;
  selectedTimeRange: '24h' | '7d' | '30d' | '90d';
  isLoading: boolean;
  lastUpdated: Date | null;
  unreadAlertCount: number;
  alerts: Array<{
    id: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // Actions
  syncMetrics: () => Promise<void>;
  fetchHistoricalData: (timeRange: '24h' | '7d' | '30d' | '90d') => Promise<void>;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  currentMetrics: {},
  historicalData: {},
  selectedTimeRange: '24h',
  isLoading: false,
  lastUpdated: null,
  unreadAlertCount: 0,
  alerts: [],

  syncMetrics: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        currentMetrics: {
          heartRate: { value: 75, unit: 'bpm', timestamp: new Date() },
          bloodPressure: { value: { sys: 120, dia: 80 }, unit: 'mmHg', timestamp: new Date() },
          bloodOxygen: { value: 98, unit: '%', timestamp: new Date() },
          temperature: { value: 98.6, unit: '°F', timestamp: new Date() },
          weight: { value: 70.5, unit: 'kg', timestamp: new Date() },
          steps: { value: 8432, timestamp: new Date() },
          sleep: { value: 7.5, unit: 'h', timestamp: new Date() }
        },
        lastUpdated: new Date(),
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to sync metrics:', error);
      set({ isLoading: false });
    }
  },

  fetchHistoricalData: async (timeRange) => {
    set({ isLoading: true, selectedTimeRange: timeRange });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock historical data
      const now = new Date();
      const data: HealthData = {
        heartRate: Array.from({ length: 24 }, (_, i) => ({
          value: 70 + Math.random() * 10,
          unit: 'bpm',
          timestamp: new Date(now.getTime() - (23 - i) * 3600000)
        })),
        bloodPressure: Array.from({ length: 24 }, (_, i) => ({
          value: { sys: 120 + Math.random() * 5, dia: 80 + Math.random() * 3 },
          unit: 'mmHg',
          timestamp: new Date(now.getTime() - (23 - i) * 3600000)
        }))
      };

      set({ historicalData: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      set({ isLoading: false });
    }
  },

  markAlertAsRead: (id) => {
    set(state => {
      const alerts = state.alerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      );
      return {
        alerts,
        unreadAlertCount: alerts.filter(a => !a.read).length
      };
    });
  },

  clearAllAlerts: () => {
    set({ alerts: [], unreadAlertCount: 0 });
  }
})); 