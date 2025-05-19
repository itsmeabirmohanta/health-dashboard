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

interface SettingsState {
  syncFrequency: number; // in seconds
  units: Units;
  thresholds: Thresholds;
  setSyncFrequency: (frequency: number) => void;
  setUnits: (units: Units) => void;
  setThreshold: (metric: keyof Thresholds, range: ThresholdRange) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  syncFrequency: 10, // 10 seconds by default
  
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
  }))
}));