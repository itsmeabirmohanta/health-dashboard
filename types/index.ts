export type MetricType = 
  | 'heartRate' 
  | 'bloodOxygen' 
  | 'steps' 
  | 'sleep' 
  | 'bloodPressure' 
  | 'temperature'
  | 'weight'
  | 'caloriesBurned';

export type MetricUnit = 
  | 'bpm' 
  | '%' 
  | 'steps' 
  | 'hours' 
  | 'mmHg' 
  | '°F' 
  | '°C'
  | 'kg'
  | 'lb'
  | 'kcal';

export type MetricValue = number | string | { sys: number; dia: number };

export interface MetricData {
  id: string;
  timestamp: string;
  type: MetricType;
  value: MetricValue;
  unit: MetricUnit;
}

export interface Alert {
  id: string;
  type: MetricType;
  message: string;
  timestamp: string;
  level: 'info' | 'warning' | 'danger';
  read: boolean;
}

export interface HistoricalDataPoint {
  timestamp: string;
  heartRate?: number;
  bloodOxygen?: number;
  steps?: number;
  sleep?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  temperature?: number;
  weight?: number;
  caloriesBurned?: number;
}

export interface MetricThresholds {
  [key: string]: {
    warning: {
      min: number;
      max: number;
    };
    danger: {
      min: number;
      max: number;
    };
  };
}

export interface UserSettings {
  syncInterval: number; // minutes
  thresholds: MetricThresholds;
  units: 'metric' | 'imperial';
  visibleMetrics: MetricType[];
  theme: 'light' | 'dark' | 'system';
} 