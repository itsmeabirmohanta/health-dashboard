export interface HealthData {
  heartRate: number;
  bloodOxygen: number;
  sleep: number;
  steps: number;
  temperature: number;
}

export interface HistoricalDataPoint extends HealthData {
  timestamp: string;
}