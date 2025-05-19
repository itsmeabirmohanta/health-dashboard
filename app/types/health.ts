// Health metric types
export type MetricType = 'heartRate' | 'bloodOxygen' | 'steps' | 'sleep' | 'temperature' | 'weight' | 'bloodPressure';

export interface MetricValue {
  value: number | string | { sys: number, dia: number };
  unit?: string;
  timestamp: number;
  change?: number;  // Percentage change from previous reading
}

export interface MetricConfig {
  key: string;
  name: string;
  color: string;
  yAxisId: string;
  domain: [number, number] | ['dataMin', 'dataMax'] | [number, 'dataMax'] | ['dataMin', number];
  referenceValue: number | null;
  referenceLabel: string;
  unit: string;
}

export interface CurrentMetrics {
  [key: string]: MetricValue;
}

export interface HistoricalDataPoint {
  timestamp: number;
  heartRate: number;
  bloodOxygen: number;
  steps: number;
  sleep: number;
  temperature: number;
  weight: number;
  bloodPressure?: { sys: number, dia: number };
  [key: string]: number | { sys: number, dia: number } | undefined;
}

// For health insights and AI analysis
export interface HealthInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metric?: string;
  timestamp: Date;
  confidence: number; // 0-1
  actionable: boolean;
  recommendedAction?: string;
}

export interface HealthScore {
  overall: number; // 0-100
  categories: {
    cardiac: number;
    respiratory: number;
    activity: number;
    sleep: number;
    stress: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  insights: string[];
}

// For doctor/guardian mode
export interface MonitoredUser {
  id: string;
  name: string;
  relationship: 'patient' | 'parent' | 'child' | 'spouse' | 'friend' | 'other';
  avatar?: string;
  lastUpdated: Date;
  overallStatus: 'healthy' | 'caution' | 'warning' | 'critical';
  metrics: CurrentMetrics;
  notes: UserNote[];
  alerts: number; // Count of unread alerts
}

export interface UserNote {
  id: string;
  timestamp: Date;
  text: string;
  author: string;
  metric?: MetricType;
} 