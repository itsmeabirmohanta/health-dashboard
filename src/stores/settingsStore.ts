import { create } from 'zustand';

interface Units {
  temperature: 'celsius' | 'fahrenheit';
  distance: 'kilometers' | 'miles';
}

interface ThresholdRange {
  min: number;
  max: number;
}

interface Thresholds {
  heartRate: ThresholdRange;
  bloodOxygen: ThresholdRange;
  sleep: ThresholdRange;
  steps: ThresholdRange;
  temperature: ThresholdRange;
}

interface Notifications {
  alerts: boolean;
  sync: boolean;
  goals: boolean;
}

interface SettingsState {
  syncFrequency: number;
  units: Units;
  thresholds: Thresholds;
  notifications: Notifications;
  setSyncFrequency: (frequency: number) => void;
  setUnits: (units: Units) => void;
  setThreshold: (metric: keyof Thresholds, range: ThresholdRange) => void;
  toggleNotification: (type: keyof Notifications) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  syncFrequency: 10,
  
  units: {
    temperature: 'fahrenheit',
    distance: 'miles'
  },
  
  thresholds: {
    heartRate: { min: 40, max: 120 },
    bloodOxygen: { min: 92, max: 100 },
    sleep: { min: 6, max: 9 },
    steps: { min: 5000, max: 15000 },
    temperature: { min: 97, max: 100 }
  },

  notifications: {
    alerts: true,
    sync: false,
    goals: true
  },
  
  setSyncFrequency: (frequency: number) => set({
    syncFrequency: frequency
  }),
  
  setUnits: (units: Units) => set({
    units
  }),
  
  setThreshold: (metric: keyof Thresholds, range: ThresholdRange) => set(state => ({
    thresholds: {
      ...state.thresholds,
      [metric]: range
    }
  })),

  toggleNotification: (type: keyof Notifications) => set(state => ({
    notifications: {
      ...state.notifications,
      [type]: !state.notifications[type]
    }
  }))
}));