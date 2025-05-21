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
  | 'kcal'
  | 'minutes';

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

// Goal Tracking Types
export type GoalType = 'steps' | 'activeMinutes' | 'sleepHours' | 'caloriesBurned' | 'hydration';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: MetricUnit | 'ml' | 'L'; // Adding ml/L for hydration
  startDate: string;
  endDate?: string; // Optional end date for time-bound goals
  status: 'onTrack' | 'atRisk' | 'achieved' | 'notStarted';
}

// Nutrition Types
export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein?: number; // grams
  carbs?: number;   // grams
  fats?: number;    // grams
  servingSize?: string; // e.g., "100g", "1 cup"
}

export interface LoggedMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  items: MealItem[];
  totalCalories: number;
}

export interface NutritionSummary {
  date: string;
  totalCalories: number;
  targetCalories?: number;
  protein?: number; // total grams for the day
  carbs?: number;   // total grams for the day
  fats?: number;    // total grams for the day
  meals: LoggedMeal[];
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g., "10mg", "1 tablet"
  frequency: string; // e.g., "Once daily", "Twice daily with meals"
  instructions?: string;
  nextReminder?: string; // ISO string for the next scheduled time
  takenToday?: boolean; // Simple tracking for dashboard
}

// Hydration Types
export interface HydrationLog {
  id: string;
  timestamp: string;
  amount: number; // in ml
  unit: 'ml' | 'L';
}

export interface HydrationSummary {
  date: string;
  totalIntake: number; // in ml
  targetIntake?: number; // in ml
  logs: HydrationLog[];
} 