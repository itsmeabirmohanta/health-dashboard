import { create } from 'zustand';
import { addMilliseconds, subHours, subDays, subMonths } from 'date-fns';
import { getRandomValue } from '../utils/dataUtils';
import { HealthData, HistoricalDataPoint } from '../types/health';

type DateRange = 'day' | 'week' | 'month';

interface HealthDataState {
  healthData: {
    currentData: HealthData;
    historicalData: HistoricalDataPoint[];
  };
  lastSynced: Date | null;
  selectedDateRange: DateRange;
  selectedMetrics: string[];
  syncData: () => void;
  setSelectedDateRange: (range: DateRange) => void;
  toggleMetric: (metric: string) => void;
}

// Generate historical data based on the selected date range
const generateHistoricalData = (range: DateRange): HistoricalDataPoint[] => {
  const now = new Date();
  let startDate: Date;
  let pointCount: number;
  let interval: number;
  
  switch (range) {
    case 'day':
      startDate = subHours(now, 24);
      pointCount = 24;
      interval = 60 * 60 * 1000; // 1 hour in milliseconds
      break;
    case 'week':
      startDate = subDays(now, 7);
      pointCount = 7 * 24; // One point every hour for a week
      interval = 60 * 60 * 1000; // 1 hour in milliseconds
      break;
    case 'month':
      startDate = subMonths(now, 1);
      pointCount = 30; // One point per day for a month
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      break;
  }
  
  const data: HistoricalDataPoint[] = [];
  
  for (let i = 0; i < pointCount; i++) {
    const timestamp = addMilliseconds(startDate, i * interval);
    
    // Base values that increase or decrease over time
    const timeProgress = i / pointCount;
    const variation = Math.sin(timeProgress * Math.PI * 2) * 10;
    
    data.push({
      timestamp: timestamp.toISOString(),
      heartRate: Math.round(70 + variation + getRandomValue(-5, 5)),
      bloodOxygen: Math.round((96 + variation / 10 + getRandomValue(-1, 1)) * 10) / 10,
      sleep: range === 'day' ? 
        (i % 24 < 8 ? 7 + getRandomValue(-1, 1) : 0) : // Show sleep only during night hours for day view
        Math.round((7 + getRandomValue(-1, 1)) * 10) / 10,
      steps: Math.round(timeProgress * 10000 + getRandomValue(-500, 500)),
      temperature: Math.round((98.6 + variation / 20 + getRandomValue(-0.2, 0.2)) * 10) / 10
    });
  }
  
  return data;
};

export const useHealthDataStore = create<HealthDataState>((set, get) => ({
  healthData: {
    currentData: {
      heartRate: 72,
      bloodOxygen: 98,
      sleep: 7.5,
      steps: 8472,
      temperature: 98.6
    },
    historicalData: generateHistoricalData('day')
  },
  lastSynced: null,
  selectedDateRange: 'day',
  selectedMetrics: ['heartRate', 'steps'],
  
  syncData: () => {
    const { selectedDateRange } = get();
    
    // Generate new current data
    const newCurrentData = {
      heartRate: Math.round(getRandomValue(65, 80)),
      bloodOxygen: Math.round(getRandomValue(95, 99) * 10) / 10,
      sleep: Math.round(getRandomValue(6, 8) * 10) / 10,
      steps: Math.round(getRandomValue(7500, 10000)),
      temperature: Math.round(getRandomValue(97.8, 99.2) * 10) / 10
    };
    
    // Generate new historical data based on the selected date range
    const newHistoricalData = generateHistoricalData(selectedDateRange);
    
    set({
      healthData: {
        currentData: newCurrentData,
        historicalData: newHistoricalData
      },
      lastSynced: new Date()
    });
  },
  
  setSelectedDateRange: (range: DateRange) => {
    set({
      selectedDateRange: range,
      healthData: {
        ...get().healthData,
        historicalData: generateHistoricalData(range)
      }
    });
  },
  
  toggleMetric: (metric: string) => {
    const { selectedMetrics } = get();
    
    if (selectedMetrics.includes(metric)) {
      set({
        selectedMetrics: selectedMetrics.filter(m => m !== metric)
      });
    } else {
      set({
        selectedMetrics: [...selectedMetrics, metric]
      });
    }
  }
}));