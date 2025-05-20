"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataSets, HealthDataPoint, Metric, generateCurrentMetrics } from '@/app/store/healthDataSets';

interface HealthStore {
  // Current real-time metrics
  currentMetrics: Record<string, Metric>;
  
  // Historical data for charts
  historicalData: HealthDataPoint[];
  
  // Current active dataset
  activeDataset: 'normalDay' | 'highActivity' | 'illness' | 'recovery';
  
  // Selected time range for charts
  selectedTimeRange: '24h' | '7d' | '30d' | '90d';
  
  // Sync interval in seconds
  syncInterval: number;
  
  // Actions
  setActiveDataset: (dataset: 'normalDay' | 'highActivity' | 'illness' | 'recovery') => void;
  syncMetrics: () => Promise<void>;
  fetchHistoricalData: (timeRange: '24h' | '7d' | '30d' | '90d') => Promise<void>;
  setTimeRange: (range: '24h' | '7d' | '30d' | '90d') => void;
  setSyncInterval: (seconds: number) => void;
}

// Create the store with persistence
export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      currentMetrics: {},
      historicalData: [],
      activeDataset: 'normalDay',
      selectedTimeRange: '24h',
      syncInterval: 30,
      
      setActiveDataset: (dataset) => {
        set({ activeDataset: dataset });
        get().syncMetrics();
        get().fetchHistoricalData(get().selectedTimeRange);
      },
      
      syncMetrics: async () => {
        const { activeDataset } = get();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        const metrics = generateCurrentMetrics(activeDataset);
        set({ currentMetrics: metrics });
        
        return Promise.resolve();
      },
      
      fetchHistoricalData: async (timeRange) => {
        const { activeDataset } = get();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const data = dataSets[activeDataset].generator(timeRange);
        set({ 
          historicalData: data,
          selectedTimeRange: timeRange
        });
        
        return Promise.resolve();
      },
      
      setTimeRange: (range) => {
        set({ selectedTimeRange: range });
        get().fetchHistoricalData(range);
      },
      
      setSyncInterval: (seconds) => {
        set({ syncInterval: seconds });
      }
    }),
    {
      name: 'health-store', // unique name for localStorage
      partialize: (state) => ({ 
        activeDataset: state.activeDataset,
        selectedTimeRange: state.selectedTimeRange,
        syncInterval: state.syncInterval
      })
    }
  )
); 