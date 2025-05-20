import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MetricData, 
  Alert, 
  HistoricalDataPoint, 
  MetricType, 
  UserSettings,
  MetricThresholds
} from '@/types';
import { 
  generateRandomMetric, 
  generateHistoricalData,
  checkMetricAlerts,
  DEFAULT_THRESHOLDS
} from '@/lib/data-generator';

interface HealthStore {
  // Current metrics
  currentMetrics: Record<string, MetricData>;
  lastUpdated: string | null;
  isLoading: boolean;
  
  // Historical data
  historicalData: HistoricalDataPoint[];
  selectedTimeRange: '24h' | '7d' | '30d' | '90d';
  
  // Alerts
  alerts: Alert[];
  unreadAlertCount: number;
  
  // Settings
  settings: UserSettings;
  
  // Actions
  syncMetrics: () => void;
  clearAlerts: () => void;
  markAlertAsRead: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleMetricVisibility: (type: MetricType) => void;
  updateThresholds: (type: string, level: 'warning' | 'danger', values: { min: number; max: number }) => void;
  fetchHistoricalData: (range: '24h' | '7d' | '30d' | '90d') => void;
}

// Default metrics to track
const DEFAULT_METRICS: MetricType[] = [
  'heartRate',
  'bloodOxygen',
  'steps',
  'sleep',
  'bloodPressure',
  'temperature'
];

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  syncInterval: 30, // 30 minutes
  thresholds: DEFAULT_THRESHOLDS,
  units: 'imperial', // default to imperial (US)
  visibleMetrics: DEFAULT_METRICS,
  theme: 'system',
};

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMetrics: {},
      lastUpdated: null,
      isLoading: false,
      historicalData: [],
      selectedTimeRange: '24h',
      alerts: [],
      unreadAlertCount: 0,
      settings: DEFAULT_SETTINGS,

      // Actions
      syncMetrics: async () => {
        set({ isLoading: true });
        
        try {
          const { settings } = get();
          const metrics: Record<string, MetricData> = {};
          const newAlerts: Alert[] = [];
          
          // Generate random metrics for each visible metric type
          for (const type of settings.visibleMetrics) {
            const metric = generateRandomMetric(type);
            metrics[type] = metric;
            
            // Check if the metric should trigger an alert
            const alert = checkMetricAlerts(metric, settings.thresholds as any);
            if (alert) {
              newAlerts.push(alert);
            }
          }
          
          // Update store with new metrics and alerts
          const now = new Date().toISOString();
          const currentAlerts = [...get().alerts, ...newAlerts];
          
          set({
            currentMetrics: metrics,
            lastUpdated: now,
            alerts: currentAlerts.slice(0, 100), // Limit to last 100 alerts
            unreadAlertCount: get().unreadAlertCount + newAlerts.length,
            isLoading: false
          });
        } catch (error) {
          console.error('Error syncing metrics:', error);
          set({ isLoading: false });
        }
      },
      
      clearAlerts: () => {
        set({ alerts: [], unreadAlertCount: 0 });
      },
      
      markAlertAsRead: (id: string) => {
        const { alerts, unreadAlertCount } = get();
        const updatedAlerts = alerts.map(alert => 
          alert.id === id ? { ...alert, read: true } : alert
        );
        
        set({ 
          alerts: updatedAlerts,
          unreadAlertCount: Math.max(0, unreadAlertCount - 1)
        });
      },
      
      updateSettings: (newSettings: Partial<UserSettings>) => {
        set({ 
          settings: { ...get().settings, ...newSettings }
        });
      },
      
      toggleMetricVisibility: (type: MetricType) => {
        const { settings } = get();
        const visibleMetrics = settings.visibleMetrics.includes(type)
          ? settings.visibleMetrics.filter(t => t !== type)
          : [...settings.visibleMetrics, type];
        
        set({ 
          settings: { ...settings, visibleMetrics }
        });
      },
      
      updateThresholds: (type, level, values) => {
        const { settings } = get();
        const thresholds = { ...settings.thresholds };
        
        if (thresholds[type]) {
          thresholds[type] = {
            ...thresholds[type],
            [level]: values
          };
        } else {
          thresholds[type] = {
            warning: level === 'warning' ? values : { min: 0, max: 0 },
            danger: level === 'danger' ? values : { min: 0, max: 0 }
          };
        }
        
        set({
          settings: {
            ...settings,
            thresholds
          }
        });
      },
      
      fetchHistoricalData: (range) => {
        set({ isLoading: true, selectedTimeRange: range });
        
        // Generate different amounts of data based on selected range
        let days = 1;
        let pointsPerDay = 24;
        
        switch (range) {
          case '24h':
            days = 1;
            pointsPerDay = 24; // hourly
            break;
          case '7d':
            days = 7;
            pointsPerDay = 24; // hourly
            break;
          case '30d':
            days = 30;
            pointsPerDay = 8; // every 3 hours
            break;
          case '90d':
            days = 90;
            pointsPerDay = 4; // every 6 hours
            break;
        }
        
        // Generate and set historical data
        const data = generateHistoricalData(days, pointsPerDay);
        set({ historicalData: data, isLoading: false });
      }
    }),
    {
      name: 'health-metrics-storage',
      // Only persist metrics & settings, not loading state
      partialize: (state) => ({
        alerts: state.alerts,
        unreadAlertCount: state.unreadAlertCount,
        settings: state.settings
      })
    }
  )
); 